#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const WEEKDAYS = ["LU", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

function splitPagesFromPdf(pdfPath) {
  try {
    const text = execFileSync("pdftotext", ["-layout", pdfPath, "-"], { encoding: "utf8" });
    return text.split("\f").map((p) => p.replace(/\r/g, "").trimEnd());
  } catch (err) {
    // Windows dev environments may not have poppler-utils installed (pdftotext missing).
    if (err && err.code === "ENOENT") {
      const fallback = resolveWinGetPopplerPdftotext();
      if (fallback) {
        const text = execFileSync(fallback, ["-layout", pdfPath, "-"], { encoding: "utf8" });
        return text.split("\f").map((p) => p.replace(/\r/g, "").trimEnd());
      }
      return splitPagesFromPdfParse(pdfPath);
    }
    if (err && typeof err.stdout === "string" && err.stdout.trim()) {
      return err.stdout.split("\f").map((p) => p.replace(/\r/g, "").trimEnd());
    }
    throw err;
  }
}

function resolveWinGetPopplerPdftotext() {
  if (process.platform !== "win32") return null;
  const base = process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Packages") : null;
  if (!base) return null;
  // Default winget location for oschwartz10612.Poppler
  const known = path.join(
    base,
    "oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe",
    "poppler-25.07.0",
    "Library",
    "bin",
    "pdftotext.exe"
  );
  try {
    if (fs.existsSync(known)) return known;
  } catch {
    // ignore
  }
  return null;
}

function splitPagesFromMarkers(text) {
  const raw = String(text || "").replace(/\r/g, "");
  const parts = raw.split(/\s*--\s*\d+\s+of\s+\d+\s*--\s*/gi);
  return parts.map((p) => p.trimEnd());
}

async function splitPagesFromPdfParse(pdfPath) {
  const fs = await import("node:fs");
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
  const result = await parser.getText();
  const text = result?.text || "";
  await parser.destroy();
  return splitPagesFromMarkers(text);
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function findHeaderLine(lines) {
  for (const line of lines) {
    const normalized = String(line || "");
    if (WEEKDAYS.every((w) => normalized.includes(w))) return normalized;
  }
  return null;
}

function columnStarts(headerLine) {
  const starts = [];
  for (const token of WEEKDAYS) {
    const idx = headerLine.indexOf(token);
    if (idx < 0) return null;
    starts.push(idx);
  }
  const sorted = [...starts].sort((a, b) => a - b);
  if (sorted.join(",") !== starts.join(",")) return null;
  return starts;
}

function sliceColumns(line, starts) {
  const cols = [];
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1] : line.length;
    cols.push(line.slice(start, end));
  }
  return cols;
}

function sliceColumnsTabs(line) {
  const rawCols = String(line || "").split("\t");
  if (rawCols.length < 7) return null;
  const cols = rawCols.slice(0, 7);
  if (rawCols.length > 7) {
    cols[6] = `${cols[6]} ${rawCols.slice(7).join(" ")}`;
  }
  return cols;
}

function parseDayLine(cols) {
  const days = [];
  let hits = 0;
  for (const col of cols) {
    const m = String(col || "").trim().match(/^(\d{1,2})\b/);
    const day = m ? Number(m[1]) : null;
    if (day != null) hits += 1;
    days.push(day);
  }
  return hits >= 4 ? days : null;
}

function extractEntries(colText) {
  const out = [];
  const text = String(colText || "").replace(/\s+/g, " ").trim();
  if (!text) return out;

  const re = /([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+?)\s+X\s*(\d{1,2})/gu;
  for (const m of text.matchAll(re)) {
    const name = String(m[1] || "").replace(/\s+/g, " ").trim();
    const pax = Number(m[2]);
    if (!name || !Number.isFinite(pax) || pax <= 0) continue;
    out.push({ name, pax });
  }
  return out;
}

function toDateKey(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildDayIndex() {
  const map = new Map(); // dateKey -> [{name,pax}]
  return {
    add(dateKey, entry) {
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey).push(entry);
    },
    toJson() {
      const days = [...map.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, entries]) => ({ date, entries }));
      return { days, count_days: days.length, count_entries: days.reduce((acc, d) => acc + d.entries.length, 0) };
    }
  };
}

function extractFromPage(pageText, year, month) {
  const dim = daysInMonth(year, month);
  const lines = String(pageText || "").split("\n");
  const header = findHeaderLine(lines);
  if (!header) return { error: "weekday_header_not_found" };
  const useTabs = header.includes("\t");
  const starts = useTabs ? null : columnStarts(header);
  if (!useTabs && !starts) return { error: "weekday_header_bad_columns" };

  const idx = buildDayIndex();

  let inGrid = false;
  let currentDays = null;
  for (const line of lines) {
    if (!inGrid) {
      if (line.includes("NOTAS:")) break;
      if (line.includes(header)) {
        inGrid = true;
      }
      continue;
    }

    if (line.includes("NOTAS:")) break;
    const cols = useTabs ? sliceColumnsTabs(line) : sliceColumns(line, starts);
    if (!cols) continue;
    const maybeDays = parseDayLine(cols);
    if (maybeDays) {
      currentDays = maybeDays;
      continue;
    }

    if (!currentDays) continue;
    for (let c = 0; c < cols.length; c++) {
      const day = currentDays[c];
      if (!day || day < 1 || day > dim) continue;
      for (const entry of extractEntries(cols[c])) {
        idx.add(toDateKey(year, month, day), entry);
      }
    }
  }

  return idx.toJson();
}

function summarizeByMonth(pdf) {
  const byMonth = new Map();
  for (const day of pdf.days) {
    const month = day.date.slice(5, 7);
    byMonth.set(month, (byMonth.get(month) || 0) + day.entries.length);
  }
  const out = {};
  for (let m = 1; m <= 12; m++) {
    const mm = String(m).padStart(2, "0");
    out[mm] = byMonth.get(mm) || 0;
  }
  return out;
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Uso: node scripts/extract-reservas-staging.mjs <ruta-pdf> [year]");
  process.exit(1);
}

const pdfPath = path.resolve(args[0]);
const year = args[1] ? Number(args[1]) : 2026;
if (!Number.isInteger(year) || year < 1900) {
  console.error("Año inválido");
  process.exit(1);
}
if (!fs.existsSync(pdfPath)) {
  console.error(`Archivo no encontrado: ${pdfPath}`);
  process.exit(1);
}

const pages = await splitPagesFromPdf(pdfPath);
if (pages.length < 12) {
  console.error(`Se esperaban 12 páginas (una por mes). Encontradas: ${pages.length}`);
  process.exit(1);
}

const all = buildDayIndex();
const pageMeta = [];

for (let i = 0; i < 12; i++) {
  const month = i + 1;
  const extracted = extractFromPage(pages[i], year, month);
  if (extracted?.error) {
    pageMeta.push({ month, ok: false, error: extracted.error });
    continue;
  }
  pageMeta.push({ month, ok: true, count_days: extracted.count_days, count_entries: extracted.count_entries });
  for (const d of extracted.days) {
    for (const e of d.entries) all.add(d.date, e);
  }
}

const result = {
  source_file: path.basename(pdfPath),
  year,
  pages: pageMeta,
  ...all.toJson()
};
result.entries_by_month = summarizeByMonth(result);

const outDir = path.resolve("db/staging");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `reservas_${year}.day_occupancy.json`);
fs.writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

console.log("Staging generado:");
console.log(`- ${outPath}`);
console.log(`Días con ocupación: ${result.count_days}`);
console.log(`Entradas (NOMBRE X#): ${result.count_entries}`);
console.log(`Entradas por mes: ${JSON.stringify(result.entries_by_month)}`);

