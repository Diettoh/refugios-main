import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadReservasMonthlyNotes, loadVentasMonthlyStructuredData } from "../src/utils/pdf/stagingData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const stagingDir = path.join(appRoot, "db", "staging");
const docsDir = path.join(appRoot, "docs");

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function moneyCLP(value) {
  const n = Math.round(Number(value || 0));
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(n);
}

function normalizeFlagStats(rows) {
  const stats = {
    flagged: 0,
    missingNumeric: 0,
    missingProductCode: 0,
    placeholderName: 0,
    highNightlyRate: 0
  };

  for (const row of rows) {
    const flags = String(row?.quality_flags || "")
      .split(";")
      .map((flag) => flag.trim())
      .filter(Boolean);

    if (flags.length > 0) stats.flagged += 1;
    if (flags.includes("insufficient_numeric_columns")) stats.missingNumeric += 1;
    if (flags.includes("missing_product_code")) stats.missingProductCode += 1;
    if (flags.includes("name_placeholder")) stats.placeholderName += 1;
    if (flags.includes("potential_outlier_high_nightly_price")) stats.highNightlyRate += 1;
  }

  return stats;
}

function groupReservasMonthDays(payload, month) {
  const prefix = `-${String(month).padStart(2, "0")}-`;
  return (payload.days || []).filter((day) => String(day?.date || "").includes(prefix));
}

function uniqueGuestCount(days) {
  const names = new Set();
  for (const day of days) {
    for (const entry of day.entries || []) {
      const name = String(entry?.name || "").trim();
      if (name) names.add(name);
    }
  }
  return names.size;
}

function maxConcurrentEntries(days) {
  return days.reduce((max, day) => Math.max(max, Array.isArray(day.entries) ? day.entries.length : 0), 0);
}

function sumPax(days) {
  let total = 0;
  for (const day of days) {
    for (const entry of day.entries || []) {
      total += Number(entry?.pax || 0);
    }
  }
  return total;
}

async function buildVentasSection(year) {
  const filePath = path.join(stagingDir, `ventas_ava_${year}.normalized.json`);
  const rows = loadJson(filePath);

  let out = `## Ventas AvA ${year}.pdf\n\n`;
  out += `Objetivo: conservar 1:1 columnas de planilla/PDF (NOMBRE, R/C, T/P/A/B, PAX, PAX Ad, NOCHES, PRECIO POR NOCHE, SUPLEMENTO, TOTAL POR NOCHE, TOTAL ESTADIA, UTILIDAD, ABONOS, BOLETAS).\n\n`;

  for (let month = 1; month <= 12; month += 1) {
    const monthRows = rows.filter((row) => Number(row?.month) === month);
    const totalStay = monthRows.reduce((acc, row) => acc + Number(row?.total_stay || 0), 0);
    const totalUtility = monthRows.reduce((acc, row) => acc + Number(row?.utility || 0), 0);
    const abonosDetected = monthRows.filter((row) => /\babono\b/i.test(String(row?.notes || ""))).length;
    const boletasNotes = monthRows.filter((row) => /\b(sii|boleta|factura|x)\b/i.test(String(row?.notes || ""))).length;
    const stats = normalizeFlagStats(monthRows);

    const structured = await loadVentasMonthlyStructuredData({ year, month });
    const totalPdf = Number(structured?.totals?.total_amount || 0);
    const nochesPdf = Number(structured?.totals?.total_noches_right || 0);
    const showsAbonosColumn = Boolean(structured?.show_abonos);

    out += `### Página ${month} (${MONTHS[month - 1]})\n`;
    out += `- Datos detectados: filas=${monthRows.length}, total_estadia=${moneyCLP(totalStay)}, total_utilidad=${moneyCLP(totalUtility)}, total_pdf=${moneyCLP(totalPdf)}, noches_pdf=${nochesPdf || 0}.\n`;
    out += `- Calidad extracción: flagged=${stats.flagged}, missing_numeric=${stats.missingNumeric}, missing_product_code=${stats.missingProductCode}, placeholders=${stats.placeholderName}, nightly_outliers=${stats.highNightlyRate}.\n`;
    out += `- Notas comerciales: abonos_detectados=${abonosDetected}, notas_boletas=${boletasNotes}, columna_abonos_en_pdf=${showsAbonosColumn ? "si" : "no"}.\n`;
    out += `- Plan de acción:\n`;
    out += `1. Congelar layout visual de la página ${month} (márgenes, anchos, color de cabeceras, 24 filas) contra PDF original.\n`;

    if (monthRows.length === 0) {
      out += `2. Mantener mes sin datos con grilla completa vacía, totales en 0 y footer de NOCHES igual al PDF.\n`;
    } else {
      out += `2. Mapear cada fila a reserva+cobro real (no usar ` + "`description`" + ` como fuente primaria).\n`;
      out += `3. Persistir por fila: ` + "`product_code`" + `, ` + "`pax`" + `, ` + "`pax_ad`" + `, ` + "`nights`" + `, ` + "`nightly_price`" + `, ` + "`cleaning_supplement`" + `, ` + "`total_per_night`" + `, ` + "`total_stay`" + `, ` + "`utility`" + `.\n`;
      if (stats.flagged > 0) {
        out += `4. Resolver ${stats.flagged} filas con banderas de calidad antes de cerrar el mes (cálculo de columnas y códigos faltantes).\n`;
      } else {
        out += `4. Validar cuadratura mensual: suma de filas == total PDF y noches == footer PDF.\n`;
      }
      if (abonosDetected > 0 || showsAbonosColumn) {
        out += `5. Normalizar ABONOS/BOLETAS a campos estructurados y exponer filtros por estado documental en ventas/reservas.\n`;
      } else {
        out += `5. Confirmar que la ausencia de ABONOS en página ${month} coincide con el original.\n`;
      }
    }

    out += "\n";
  }

  return out;
}

async function buildReservasSection(year) {
  const filePath = path.join(stagingDir, `reservas_${year}.day_occupancy.json`);
  const payload = loadJson(filePath);

  let out = `## RESERVAS ${year}.pdf\n\n`;
  out += `Objetivo: conservar 1:1 calendario mensual (6 semanas), nombres por celda, pax, y notas de cierre por página.\n\n`;

  for (let month = 1; month <= 12; month += 1) {
    const pageMeta = (payload.pages || []).find((page) => Number(page?.month) === month) || {};
    const monthDays = groupReservasMonthDays(payload, month);
    const uniqueGuests = uniqueGuestCount(monthDays);
    const peak = maxConcurrentEntries(monthDays);
    const paxTotal = sumPax(monthDays);
    const notes = await loadReservasMonthlyNotes({ year, month });

    out += `### Página ${month} (${MONTHS[month - 1]})\n`;
    out += `- Datos detectados: dias_ocupados=${Number(pageMeta.count_days || 0)}, entradas_nombre_x_pax=${Number(pageMeta.count_entries || 0)}, huespedes_unicos=${uniqueGuests}, pico_simultaneo_dia=${peak}, suma_pax=${paxTotal}.\n`;
    out += `- Notas del mes: lineas=${notes.length}.\n`;
    out += `- Plan de acción:\n`;
    out += `1. Reconstruir check-in/check-out desde continuidad diaria del calendario (inicio/fin de bloque por huésped).\n`;

    if (Number(pageMeta.count_entries || 0) === 0) {
      out += `2. Mantener página vacía con estructura de calendario idéntica y sección NOTAS habilitada.\n`;
    } else {
      out += `2. Persistir por estadía: ` + "`guest_id`" + `, ` + "`check_in`" + `, ` + "`check_out`" + `, ` + "`nights`" + `, ` + "`guests_count`" + `, ` + "`source`" + `, ` + "`status`" + `.\n`;
      out += `3. Calcular y guardar ` + "`nights`" + ` en backend para soportar filtros y reporte de sumatoria de noches.\n`;
      if (peak > 6) {
        out += `4. Revisar sobreocupación pico (${peak}) y asignar unidad/cabaña por reglas operativas para no perder simultaneidad real.\n`;
      } else {
        out += `4. Validar asignación de cabaña y conflictos de disponibilidad contra el pico mensual (${peak}).\n`;
      }
    }

    if (notes.length > 0) {
      out += `5. Migrar NOTAS del mes a almacenamiento estructurado (` + "`reservation_month_notes`" + `) y renderizarlas en export PDF.\n`;
    } else {
      out += `5. Confirmar ausencia de notas y mantener bloque NOTAS visible en export para consistencia visual.\n`;
    }

    out += "\n";
  }

  return out;
}

async function main() {
  const now = new Date();
  let md = "# Plan de Accion PDF 1:1 (2025-2026)\n\n";
  md += `Generado: ${now.toISOString()}\n\n`;
  md += "## Alcance\n";
  md += "- PDF de ventas: `Ventas AvA 2025.pdf` y `Ventas AvA 2026.pdf`.\n";
  md += "- PDF de reservas: `RESERVAS 2025.pdf` y `RESERVAS 2026.pdf`.\n";
  md += "- Cada pagina/mes contiene checklist de migracion para no perder campos ni reglas.\n\n";
  md += "## Reglas Transversales\n";
  md += "1. Huespedes: upsert por documento y por alias de nombre normalizado para evitar duplicados.\n";
  md += "2. Reservas: persistir siempre `check_in`, `check_out`, `nights`, `guests_count`, `source`, `reservation_document_type`.\n";
  md += "3. Cobros/ventas: cada pago debe enlazar `reservation_id` cuando exista y conservar notas comerciales (`abono`, `boleta`, `factura`).\n";
  md += "4. Filtros obligatorios en sistema: categoria gasto, medio de pago, check-in/out (desde/hasta), noches min/max, estado deuda y documento.\n";
  md += "5. Exportadores PDF: validar pixel-match mensual contra PDF historico antes de cerrar cada mes.\n\n";

  md += await buildVentasSection(2025);
  md += await buildVentasSection(2026);
  md += await buildReservasSection(2025);
  md += await buildReservasSection(2026);

  fs.mkdirSync(docsDir, { recursive: true });
  const outPath = path.join(docsDir, "PDF_ACTION_PLAN_2025_2026.md");
  fs.writeFileSync(outPath, md, "utf8");
  console.log(`Plan generado: ${outPath}`);
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});

