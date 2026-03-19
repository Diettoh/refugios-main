#!/usr/bin/env node
/**
 * Script de importación de datos reales desde PDFs (Ventas, Reservas) y Excel (Gastos)
 * Estructura esperada:
 * - Ventas PDF: columnas NOMBRE, R/C, T/P/A/B, PAX, NOCHES, TOTAL Estadía, UTILIDAD por página/mes
 * - Reservas PDF: calendario con NOMBRE X# por día
 * - Gastos Excel: columnas con categoría, monto, fecha
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { query } from "../src/db/client.js";
import "dotenv/config";

const MONTHS_ES = { ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6, jul: 7, ago: 8, sep: 9, oct: 10, nov: 11, dic: 12 };

function parseNumber(str) {
  if (!str || str === "-" || str === "--") return 0;
  const cleaned = String(str).replace(/[.$]/g, "").replace(/\s/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function toSource(rOrC) {
  const s = String(rOrC || "").trim().toUpperCase();
  if (s === "R") return "other";
  if (s === "C") return "other";
  return "other";
}

async function ensureGuest(fullName) {
  if (!fullName || String(fullName).trim().length < 2) return null;
  const name = String(fullName).trim();
  const existing = await query("SELECT id FROM guests WHERE full_name = $1 LIMIT 1", [name]);
  if (existing.rowCount > 0) return existing.rows[0].id;
  const inserted = await query(
    "INSERT INTO guests (full_name) VALUES ($1) RETURNING id",
    [name]
  );
  return inserted.rows[0].id;
}

/** Importa Gastos desde Excel */
async function importExpensesFromExcel(filePath) {
  const XLSX = (await import("xlsx")).default;
  const workbook = XLSX.readFile(filePath);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: "" });
  if (rows.length < 2) return 0;

  const headers = rows[0].map((h) => String(h || "").toLowerCase().trim());
  const catIdx = headers.findIndex((h) => h.includes("categoria") || h.includes("concepto") || h.includes("categoría"));
  const amountIdx = headers.findIndex((h) => h.includes("monto") || h.includes("valor") || h.includes("amount"));
  const dateIdx = headers.findIndex((h) => h.includes("fecha") || h.includes("date"));
  const descIdx = headers.findIndex((h) => h.includes("descripcion") || h.includes("descripción") || h.includes("glosa"));

  if (amountIdx < 0) {
    console.warn("No se encontró columna de monto en Gastos Excel");
    return 0;
  }

  let count = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const amount = parseNumber(row[amountIdx]);
    if (amount <= 0) continue;

    let dateStr = dateIdx >= 0 ? row[dateIdx] : null;
    if (!dateStr && dateIdx < 0) dateStr = new Date().toISOString().slice(0, 10);
    if (dateStr instanceof Date) dateStr = dateStr.toISOString().slice(0, 10);
    if (typeof dateStr === "number") dateStr = XLSX.SSF.parse_date_code(dateStr);
    if (dateStr && typeof dateStr === "object" && dateStr.y) {
      dateStr = `${dateStr.y}-${String(dateStr.m).padStart(2, "0")}-${String(dateStr.d).padStart(2, "0")}`;
    }
    if (!dateStr || typeof dateStr !== "string") dateStr = new Date().toISOString().slice(0, 10);

    const category = catIdx >= 0 && row[catIdx] ? String(row[catIdx]).trim() || "otros" : "otros";
    const description = descIdx >= 0 && row[descIdx] ? String(row[descIdx]).trim() : `Importado desde Excel: ${path.basename(filePath)}`;

    await query(
      `INSERT INTO expenses (category, amount, payment_method, expense_date, description)
       VALUES ($1, $2, 'transfer', $3, $4)`,
      [category, amount, dateStr.slice(0, 10), description]
    );
    count += 1;
  }
  return count;
}

/** Importa Ventas desde PDF (texto extraído) */
async function importSalesFromPdfText(text, year) {
  const pages = text.split(/\s*--\s*\d+\s+of\s+\d+\s*--/i);
  let count = 0;

  for (let p = 0; p < Math.min(pages.length - 1, 12); p++) {
    const month = p + 1;
    const monthStr = `${year}-${String(month).padStart(2, "0")}`;
    const page = pages[p];
    const lines = page.split(/\r?\n/).filter(Boolean);

    for (const line of lines) {
      const parts = line.split(/[\t]+/).map((s) => s.trim());
      if (parts.length < 6) continue;

      const first = parts[0];
      const name = /^\d+$/.test(first) ? parts[1]?.trim() : first;
      const nightsIdx = /^\d+$/.test(first) ? 6 : 5;
      const nights = parseNumber(parts[nightsIdx] || parts[5]);
      const utilidad = parseNumber(parts[10] || parts[11] || parts[9]);
      const totalEstadia = parseNumber(parts[9] || parts[8] || parts[10]);

      const amount = utilidad > 0 ? utilidad : totalEstadia;
      if (!name || name === "NOMBRE" || name === "TOTAL" || amount <= 0) continue;
      if (/^\d+$/.test(name) || name === "CASA" || name === "REFUGIOS" || name.length < 2) continue;

      const guestId = await ensureGuest(name);
      let reservationId = null;

      if (guestId && nights > 0) {
        const checkIn = `${monthStr}-01`;
        const checkOut = `${monthStr}-${String(Math.min(nights + 1, 28)).padStart(2, "0")}`;
        const res = await query(
          `INSERT INTO reservations (guest_id, source, payment_method, status, check_in, check_out, guests_count, total_amount, notes)
           VALUES ($1, 'other', 'transfer', 'completed', $2, $3, 2, $4, 'Importado desde PDF Ventas')
           RETURNING id`,
          [guestId, checkIn, checkOut, amount]
        );
        if (res.rowCount > 0) reservationId = res.rows[0].id;
      }

      const saleDate = `${monthStr}-15`;
      await query(
        `INSERT INTO sales (reservation_id, category, amount, payment_method, sale_date, description)
         VALUES ($1, 'lodging', $2, 'transfer', $3, 'Importado PDF Ventas: ${name}')`,
        [reservationId, amount, saleDate]
      );
      count += 1;
    }
  }
  return count;
}

/** Importa Reservas desde PDF (calendario) */
async function importReservationsFromPdfText(text, year) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const namePattern = /([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+)\s*X\s*(\d+)/gi;
  const datePattern = /(\d{1,2})\s+(\d{1,2})/g;
  let count = 0;

  let currentMonth = 1;
  let currentStartDay = 1;

  for (const line of lines) {
    const matches = [...line.matchAll(namePattern)];
    for (const m of matches) {
      const name = m[1].trim();
      const pax = parseInt(m[2], 10) || 2;
      if (!name || name.length < 2) continue;

      const guestId = await ensureGuest(name);
      if (!guestId) continue;

      const checkIn = `${year}-${String(currentMonth).padStart(2, "0")}-01`;
      const checkOut = `${year}-${String(currentMonth).padStart(2, "0")}-03`;

      const existing = await query(
        "SELECT id FROM reservations WHERE guest_id = $1 AND check_in = $2 LIMIT 1",
        [guestId, checkIn]
      );
      if (existing.rowCount > 0) continue;

      await query(
        `INSERT INTO reservations (guest_id, source, payment_method, status, check_in, check_out, guests_count, total_amount, notes)
         VALUES ($1, 'other', 'transfer', 'completed', $2, $3, $4, 0, 'Importado desde PDF Reservas')`,
        [guestId, checkIn, checkOut, pax]
      );
      count += 1;
    }
  }
  return count;
}

/** Ejecuta importación de PDF usando pdf-parse (v2) */
async function importFromPdf(pdfPath, type, year) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
  const result = await parser.getText();
  const text = result?.text || "";
  await parser.destroy();

  if (type === "ventas") return importSalesFromPdfText(text, year);
  if (type === "reservas") return importReservationsFromPdfText(text, year);
  return 0;
}

// CLI
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log(`
Uso: node scripts/import-pdf-excel.mjs <tipo> <archivo> [año]

Tipos:
  gastos  - Excel (.xlsx) de gastos
  ventas  - PDF de ventas (ej: Ventas AvA 2026.pdf)
  reservas - PDF de reservas (ej: RESERVAS 2026.pdf)

Ejemplos (rutas relativas desde apps/refugios-mvp):
  node scripts/import-pdf-excel.mjs gastos "Gastos AvA Refugios 2026.xlsx"
  node scripts/import-pdf-excel.mjs ventas "Ventas AvA 2026.pdf" 2026
  node scripts/import-pdf-excel.mjs reservas "RESERVAS 2026.pdf" 2026
`);
  process.exit(1);
}

const [type, filePath, yearStr] = args;
const year = yearStr ? parseInt(yearStr, 10) : new Date().getFullYear();
const resolved = path.resolve(filePath);

if (!fs.existsSync(resolved)) {
  console.error(`Archivo no encontrado: ${resolved}`);
  process.exit(1);
}

try {
  let count = 0;
  if (type === "gastos" && resolved.endsWith(".xlsx")) {
    count = await importExpensesFromExcel(resolved);
    console.log(`Gastos importados: ${count}`);
  } else if ((type === "ventas" || type === "reservas") && resolved.endsWith(".pdf")) {
    count = await importFromPdf(resolved, type, year);
    console.log(`${type === "ventas" ? "Ventas" : "Reservas"} importadas: ${count}`);
  } else {
    console.error("Tipo o extensión no soportada. Usa: gastos (.xlsx), ventas (.pdf), reservas (.pdf)");
    process.exit(1);
  }
  console.log("Importación completada.");
} catch (err) {
  console.error(err);
  process.exit(1);
}
