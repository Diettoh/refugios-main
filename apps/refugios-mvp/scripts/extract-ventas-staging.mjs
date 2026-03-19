#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

function parseMoneyToken(token) {
  if (!token) return null;
  const cleaned = String(token).replace(/\./g, "").replace(/,/g, ".").trim();
  if (!/^\d+(?:\.\d+)?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function normalizeNotes(text) {
  const v = String(text || "").trim();
  if (!v || v === "--") return null;
  return v.replace(/\s+/g, " ");
}

function splitPagesFromPdf(pdfPath) {
  try {
    const text = execFileSync("pdftotext", ["-layout", pdfPath, "-"], { encoding: "utf8" });
    return text.split("\f").map((p) => p.trimEnd());
  } catch (err) {
    if (err && err.code === "ENOENT") {
      const fallback = resolveWinGetPopplerPdftotext();
      if (fallback) {
        const text = execFileSync(fallback, ["-layout", pdfPath, "-"], { encoding: "utf8" });
        return text.split("\f").map((p) => p.trimEnd());
      }
      return splitPagesFromPdfParse(pdfPath);
    }
    // Some sandboxes return EPERM despite command output being available.
    if (err && typeof err.stdout === "string" && err.stdout.trim()) {
      return err.stdout.split("\f").map((p) => p.trimEnd());
    }
    throw err;
  }
}

function resolveWinGetPopplerPdftotext() {
  if (process.platform !== "win32") return null;
  const base = process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Packages") : null;
  if (!base) return null;
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
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
  const result = await parser.getText();
  const text = result?.text || "";
  await parser.destroy();
  return splitPagesFromMarkers(text);
}

function parseRowLine(line, page, month, year, sourceFile) {
  const usdIdx = line.indexOf("-$");
  if (usdIdx < 0) return null;

  const left = line.slice(0, usdIdx).trimEnd();
  const right = line.slice(usdIdx + 2).trim();
  const utilMatch = right.match(/(\d{1,3}(?:\.\d{3})*|\d+)-?/);
  const utilidad = utilMatch ? parseMoneyToken(utilMatch[1]) : null;
  const notes = normalizeNotes(utilMatch ? right.replace(utilMatch[0], "") : right);

  const rowMatch = left.match(/^\s*(\d+)\s+(.+)$/u);
  if (!rowMatch) return null;
  const rowNo = Number(rowMatch[1]);
  const rowBody = rowMatch[2];

  let numericStart = rowBody.search(/\s+\d+\s+\d+\s+\d+\s+\d{1,3}(?:\.\d{3})*/);
  if (numericStart < 0) {
    numericStart = rowBody.search(/\s+\d+/);
  }

  const prefix = (numericStart >= 0 ? rowBody.slice(0, numericStart) : rowBody).trim();
  const numericTail = (numericStart >= 0 ? rowBody.slice(numericStart) : "").trim();
  const tokens = prefix.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;

  let guestName = prefix;
  let rOrC = null;
  let productCode = null;
  const rcIdx = tokens.findIndex((t) => /^[RC]$/i.test(t));
  if (rcIdx >= 0) {
    rOrC = tokens[rcIdx].toUpperCase();
    guestName = tokens.slice(0, rcIdx).join(" ").trim();
  }
  const productInline = prefix.match(/\b[RC]\s+([TPAB])\b/i);
  if (productInline) productCode = productInline[1].toUpperCase();

  if (!guestName || guestName.toUpperCase() === "TOTAL") return null;

  const numericTokens = [...numericTail.matchAll(/\d{1,3}(?:\.\d{3})*|\d+/g)].map((m) => m[0]);
  const parsedNums = numericTokens.map((t) => parseMoneyToken(t)).filter((n) => n !== null);

  let pax = null;
  let paxAd = null;
  let nights = null;
  let nightlyPrice = null;
  let totalPerNight = null;
  let totalStay = 0;
  let cleaningSupplement = null;
  let hasCompleteNumericColumns = false;
  if (parsedNums.length >= 6) {
    hasCompleteNumericColumns = true;
    pax = parsedNums[0];
    paxAd = parsedNums[1];
    nights = parsedNums[2];
    nightlyPrice = parsedNums[3];
    totalPerNight = parsedNums[parsedNums.length - 2];
    totalStay = parsedNums[parsedNums.length - 1];
    cleaningSupplement = parsedNums.length >= 7 ? parsedNums[4] : null;
  }

  if ((!totalStay || totalStay <= 0) && (!utilidad || utilidad <= 0)) return null;

  const qualityFlags = [];
  if (!hasCompleteNumericColumns) qualityFlags.push("insufficient_numeric_columns");
  if (guestName === "...") qualityFlags.push("name_placeholder");
  if ((!totalStay || totalStay <= 0) && utilidad && utilidad > 0) qualityFlags.push("missing_total_stay_uses_utility");
  if (!productCode) qualityFlags.push("missing_product_code");
  if (nightlyPrice && nightlyPrice >= 1000000) qualityFlags.push("potential_outlier_high_nightly_price");

  return {
    source_file: sourceFile,
    year,
    month,
    page,
    row_no: rowNo,
    guest_name: guestName,
    r_or_c: rOrC,
    product_code: productCode,
    pax,
    pax_ad: paxAd,
    nights,
    nightly_price: nightlyPrice,
    cleaning_supplement: cleaningSupplement,
    total_per_night: totalPerNight,
    total_stay: totalStay,
    utility: utilidad,
    notes,
    quality_flags: qualityFlags.join(";"),
    raw_line: line.trim()
  };
}

function toCsv(rows) {
  const headers = [
    "source_file",
    "year",
    "month",
    "page",
    "row_no",
    "guest_name",
    "r_or_c",
    "product_code",
    "pax",
    "pax_ad",
    "nights",
    "nightly_price",
    "cleaning_supplement",
    "total_per_night",
    "total_stay",
    "utility",
    "notes",
    "quality_flags"
  ];

  const esc = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => esc(row[h])).join(","));
  }
  return lines.join("\n") + "\n";
}

function buildSummary(rows, year) {
  const byMonth = new Map();
  let flaggedRows = 0;
  for (const row of rows) {
    if (!byMonth.has(row.month)) byMonth.set(row.month, { rows: 0, total: 0 });
    const agg = byMonth.get(row.month);
    agg.rows += 1;
    agg.total += row.total_stay || 0;
    if (row.quality_flags) flaggedRows += 1;
  }

  let out = "# Ventas AvA staging\n\n";
  out += `- year: ${year}\n`;
  out += `- rows_detected: ${rows.length}\n`;
  out += `- total_stay_sum: ${rows.reduce((acc, r) => acc + (r.total_stay || 0), 0)}\n`;
  out += `- flagged_rows: ${flaggedRows}\n`;
  out += "\n## By month\n\n";
  out += "month,rows,total_stay_sum\n";

  for (let m = 1; m <= 12; m++) {
    const agg = byMonth.get(m) || { rows: 0, total: 0 };
    out += `${m},${agg.rows},${agg.total}\n`;
  }

  out += "\n## Notes\n\n";
  out += "- Dataset extracted from PDF with line-level traceability (`raw_line`, `page`, `row_no`).\n";
  out += "- Empty rows are excluded; rows with missing totals are kept when utility exists and flagged.\n";
  out += "- Keep this staging dataset immutable; generate SQL migrations from it.\n";
  return out;
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Uso: node scripts/extract-ventas-staging.mjs <ruta-pdf> [year]");
  process.exit(1);
}

const pdfPath = path.resolve(args[0]);
const year = args[1] ? Number(args[1]) : 2026;
if (!fs.existsSync(pdfPath)) {
  console.error(`Archivo no encontrado: ${pdfPath}`);
  process.exit(1);
}

const pages = await splitPagesFromPdf(pdfPath);
const sourceFile = path.basename(pdfPath);
const rows = [];

for (let i = 0; i < pages.length; i++) {
  const pageNo = i + 1;
  const pageText = pages[i] || "";
  if (/Anual\s+2024|Anual\s+2025/i.test(pageText)) continue;
  if (pageNo > 12) continue;

  const month = pageNo;
  const lines = pageText.split(/\r?\n/).filter((l) => l.trim());
  for (const line of lines) {
    if (!/^\s*\d+\s+/.test(line)) continue;
    const parsed = parseRowLine(line, pageNo, month, year, sourceFile);
    if (parsed) rows.push(parsed);
  }
}

const outDir = path.resolve("db/staging");
fs.mkdirSync(outDir, { recursive: true });

const base = `ventas_ava_${year}`;
const jsonPath = path.join(outDir, `${base}.normalized.json`);
const csvPath = path.join(outDir, `${base}.normalized.csv`);
const summaryPath = path.join(outDir, `${base}.summary.md`);

fs.writeFileSync(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
fs.writeFileSync(csvPath, toCsv(rows), "utf8");
fs.writeFileSync(summaryPath, buildSummary(rows, year), "utf8");

console.log(`Staging generado:`);
console.log(`- ${jsonPath}`);
console.log(`- ${csvPath}`);
console.log(`- ${summaryPath}`);
console.log(`Filas: ${rows.length}`);
