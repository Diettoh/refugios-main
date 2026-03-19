import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.resolve(__dirname, "..", "..", "..");
const REPO_ROOT = path.resolve(APP_ROOT, "..", "..");
const STAGING_DIR = path.join(APP_ROOT, "db", "staging");
const ASSETS_DIR = path.join(REPO_ROOT, "assets");

const ventasAssetMetaCache = new Map();
const reservasAssetNotesCache = new Map();

function splitPagesFromMarkers(text) {
  const raw = String(text || "").replace(/\r/g, "");
  return raw
    .split(/\s*--\s*\d+\s+of\s+\d+\s*--\s*/gi)
    .map((page) => page.trimEnd())
    .filter(Boolean);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function parseMoneyToken(token) {
  if (!token) return null;
  const cleaned = String(token).replace(/\./g, "").replace(/,/g, ".").trim();
  if (!/^\d+(?:\.\d+)?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function firstPositive(...values) {
  for (const value of values) {
    const n = asNumber(value);
    if (n != null && n > 0) return n;
  }
  return 0;
}

function normalizeSpaces(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAbonoAndBoletas(notes) {
  const normalized = normalizeSpaces(notes);
  if (!normalized || normalized === "--") return { abono: null, boletas: null };

  let rest = normalized;
  let abono = null;
  const abonoMatch = rest.match(/\babono\s+(\d{1,3}(?:\.\d{3})*|\d+)\b/i);
  if (abonoMatch) {
    abono = parseMoneyToken(abonoMatch[1]);
    rest = normalizeSpaces(rest.replace(abonoMatch[0], ""));
  }

  return {
    abono,
    boletas: rest || null
  };
}

function parseVentasPageMetadata(pageText) {
  const lines = String(pageText || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const headerLine = lines.find((line) => /NOMBRE/i.test(line) && /UTILIDAD/i.test(line)) || "";
  const hasAbonos = /ABONOS/i.test(headerLine);

  const totalLine = lines.find((line) => /^TOTAL\b/i.test(line) && /-\$/i.test(line)) || "";
  const totalMatches = totalLine.match(/\d{1,3}(?:\.\d{3})*|\d+/g) || [];
  const totalAmount = totalMatches.length > 0 ? parseMoneyToken(totalMatches[totalMatches.length - 1]) : null;

  const footerLine =
    [...lines].reverse().find((line) => /NOCH/i.test(line) || /^ES\b/i.test(line) || /^NOCHES\b/i.test(line)) || "";
  const footerNumbers = footerLine.match(/\d+/g) || [];
  const totalNochesLeft = footerNumbers.length >= 1 ? Number(footerNumbers[0]) : null;
  const totalNochesRight = footerNumbers.length >= 2 ? Number(footerNumbers[1]) : null;

  return { hasAbonos, totalAmount, totalNochesLeft, totalNochesRight };
}

async function getVentasAssetMetadataByYear(year) {
  if (ventasAssetMetaCache.has(year)) {
    return ventasAssetMetaCache.get(year);
  }

  const pending = (async () => {
    const filePath = path.join(ASSETS_DIR, `Ventas AvA ${year}.pdf`);
    if (!fs.existsSync(filePath)) return new Map();

    const parser = new PDFParse({ data: fs.readFileSync(filePath) });
    try {
      const textResult = await parser.getText();
      const pages = splitPagesFromMarkers(textResult?.text || "");
      const byMonth = new Map();
      for (let i = 0; i < Math.min(12, pages.length); i += 1) {
        byMonth.set(i + 1, parseVentasPageMetadata(pages[i]));
      }
      return byMonth;
    } finally {
      await parser.destroy();
    }
  })();

  ventasAssetMetaCache.set(year, pending);
  return pending;
}

function buildPlaceholderVentasRow(rowNo) {
  return {
    row_no: rowNo,
    guest_name: "",
    r_or_c: "",
    product_code: "",
    pax: 0,
    pax_ad: 0,
    nights: 0,
    nightly_price: null,
    cleaning_supplement: null,
    total_per_night: null,
    total_stay: 0,
    utility: null,
    amount_resolved: 0,
    abono: null,
    boletas: null,
    notes: null,
    is_placeholder: true
  };
}

export async function loadVentasMonthlyStructuredData({ year, month }) {
  const stagingPath = path.join(STAGING_DIR, `ventas_ava_${year}.normalized.json`);
  const payload = readJson(stagingPath);
  if (!Array.isArray(payload)) return null;

  const rowsForMonth = payload.filter((row) => Number(row?.month) === Number(month));
  if (rowsForMonth.length === 0) return null;

  const rowMap = new Map();
  for (const sourceRow of rowsForMonth) {
    const rowNo = Number(sourceRow?.row_no);
    if (!Number.isInteger(rowNo) || rowNo < 1 || rowNo > 24) continue;

    const amountResolved = firstPositive(sourceRow?.utility, sourceRow?.total_stay);
    const parsedNotes = parseAbonoAndBoletas(sourceRow?.notes);
    rowMap.set(rowNo, {
      row_no: rowNo,
      guest_name: sourceRow?.guest_name || "",
      r_or_c: sourceRow?.r_or_c || "",
      product_code: sourceRow?.product_code || "",
      pax: asNumber(sourceRow?.pax),
      pax_ad: asNumber(sourceRow?.pax_ad),
      nights: asNumber(sourceRow?.nights),
      nightly_price: asNumber(sourceRow?.nightly_price),
      cleaning_supplement: asNumber(sourceRow?.cleaning_supplement),
      total_per_night: asNumber(sourceRow?.total_per_night),
      total_stay: asNumber(sourceRow?.total_stay),
      utility: asNumber(sourceRow?.utility),
      amount_resolved: amountResolved,
      abono: parsedNotes.abono,
      boletas: parsedNotes.boletas,
      notes: sourceRow?.notes || null,
      is_placeholder: false
    });
  }

  const paddedRows = [];
  for (let rowNo = 1; rowNo <= 24; rowNo += 1) {
    paddedRows.push(rowMap.get(rowNo) || buildPlaceholderVentasRow(rowNo));
  }

  const metaByMonth = await getVentasAssetMetadataByYear(year);
  const monthMeta = metaByMonth.get(Number(month)) || null;

  const computedAmount = rowsForMonth.reduce(
    (sum, row) => sum + firstPositive(row?.utility, row?.total_stay),
    0
  );
  const computedNoches = rowsForMonth.reduce((sum, row) => sum + Math.max(0, Number(row?.nights || 0)), 0);
  const computedRowsWithAmount = rowsForMonth.reduce(
    (sum, row) => sum + (firstPositive(row?.utility, row?.total_stay) > 0 ? 1 : 0),
    0
  );

  return {
    rows: paddedRows,
    show_abonos: monthMeta?.hasAbonos ?? paddedRows.some((row) => row.abono != null),
    totals: {
      total_amount: monthMeta?.totalAmount ?? computedAmount,
      total_noches_left: monthMeta?.totalNochesLeft ?? computedRowsWithAmount,
      total_noches_right: monthMeta?.totalNochesRight ?? computedNoches
    }
  };
}

export function loadReservasMonthlyFromStaging({ year, month }) {
  const stagingPath = path.join(STAGING_DIR, `reservas_${year}.day_occupancy.json`);
  const payload = readJson(stagingPath);
  if (!payload || !Array.isArray(payload.days)) return null;

  const monthPrefix = `${year}-${String(month).padStart(2, "0")}-`;
  const dayEntries = payload.days
    .filter((day) => String(day?.date || "").startsWith(monthPrefix))
    .map((day) => ({
      date: day.date,
      entries: Array.isArray(day.entries)
        ? day.entries.map((entry) => ({
            name: String(entry?.name || "").trim(),
            pax: asNumber(entry?.pax)
          }))
        : []
    }));

  return { dayEntries };
}

async function getReservasAssetNotesByYear(year) {
  if (reservasAssetNotesCache.has(year)) {
    return reservasAssetNotesCache.get(year);
  }

  const pending = (async () => {
    const filePath = path.join(ASSETS_DIR, `RESERVAS ${year}.pdf`);
    if (!fs.existsSync(filePath)) return new Map();

    const parser = new PDFParse({ data: fs.readFileSync(filePath) });
    try {
      const textResult = await parser.getText();
      const pages = splitPagesFromMarkers(textResult?.text || "");
      const notesByMonth = new Map();

      for (let i = 0; i < Math.min(12, pages.length); i += 1) {
        const lines = String(pages[i] || "")
          .split(/\r?\n/)
          .map((line) => line.trimEnd());
        const notesStart = lines.findIndex((line) => /^NOTAS:/i.test(line.trim()));
        if (notesStart < 0) {
          notesByMonth.set(i + 1, []);
          continue;
        }
        const notes = lines
          .slice(notesStart + 1)
          .map((line) => normalizeSpaces(line))
          .filter(Boolean);
        notesByMonth.set(i + 1, notes);
      }

      return notesByMonth;
    } finally {
      await parser.destroy();
    }
  })();

  reservasAssetNotesCache.set(year, pending);
  return pending;
}

export async function loadReservasMonthlyNotes({ year, month }) {
  const notesByMonth = await getReservasAssetNotesByYear(year);
  return notesByMonth.get(Number(month)) || [];
}
