#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";
import { buildVentasMonthlyPdfBuffer } from "../src/utils/pdf/ventasMonthlyPdf.js";
import { buildReservasMonthlyPdfBuffer } from "../src/utils/pdf/reservasMonthlyPdf.js";
import {
  loadReservasMonthlyFromStaging,
  loadReservasMonthlyNotes,
  loadVentasMonthlyStructuredData
} from "../src/utils/pdf/stagingData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..", "..");

function usage() {
  console.log("Uso: node scripts/compare-export-pdfs.mjs <ventas|reservas> <year> <month>");
  process.exit(1);
}

function ensureInt(value, min, max) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

function splitPagesFromMarkers(text) {
  const raw = String(text || "").replace(/\r/g, "");
  return raw
    .split(/\s*--\s*\d+\s+of\s+\d+\s*--\s*/gi)
    .map((page) => page.trimEnd())
    .filter(Boolean);
}

async function screenshotPage(pdfBufferOrPath, pageOneBased, pngPath) {
  const data = Buffer.isBuffer(pdfBufferOrPath) ? pdfBufferOrPath : fs.readFileSync(pdfBufferOrPath);
  const parser = new PDFParse({ data });
  try {
    const result = await parser.getScreenshot({ partial: [pageOneBased], desiredWidth: 1200 });
    if (!result.pages?.[0]?.data) {
      throw new Error("No se pudo generar screenshot de la página solicitada");
    }
    fs.writeFileSync(pngPath, Buffer.from(result.pages[0].data));
  } finally {
    await parser.destroy();
  }
}

async function extractPageText(pdfBufferOrPath, pageOneBased, txtPath) {
  const data = Buffer.isBuffer(pdfBufferOrPath) ? pdfBufferOrPath : fs.readFileSync(pdfBufferOrPath);
  const parser = new PDFParse({ data });
  try {
    const result = await parser.getText();
    const pages = splitPagesFromMarkers(result?.text || "");
    const pageText = pages[pageOneBased - 1] || "";
    fs.writeFileSync(txtPath, `${pageText}\n`, "utf8");
  } finally {
    await parser.destroy();
  }
}

async function buildGeneratedPdf(kind, year, month) {
  if (kind === "ventas") {
    const data = await loadVentasMonthlyStructuredData({ year, month });
    if (!data) {
      throw new Error(`No hay staging de ventas para ${year}-${String(month).padStart(2, "0")}`);
    }
    return buildVentasMonthlyPdfBuffer({
      year,
      month,
      rows: data.rows,
      totals: data.totals,
      showAbonos: data.show_abonos
    });
  }

  const dayEntries = loadReservasMonthlyFromStaging({ year, month })?.dayEntries;
  if (!dayEntries) {
    throw new Error(`No hay staging de reservas para ${year}-${String(month).padStart(2, "0")}`);
  }
  const notes = await loadReservasMonthlyNotes({ year, month });
  return buildReservasMonthlyPdfBuffer({ year, month, dayEntries, notes });
}

async function main() {
  const [kindArg, yearArg, monthArg] = process.argv.slice(2);
  const kind = String(kindArg || "").toLowerCase();
  if (!["ventas", "reservas"].includes(kind)) usage();

  const year = ensureInt(yearArg, 2000, 2100);
  const month = ensureInt(monthArg, 1, 12);
  if (!year || !month) usage();

  const referencePdf =
    kind === "ventas"
      ? path.join(repoRoot, "assets", `Ventas AvA ${year}.pdf`)
      : path.join(repoRoot, "assets", `RESERVAS ${year}.pdf`);
  if (!fs.existsSync(referencePdf)) {
    throw new Error(`No existe PDF de referencia: ${referencePdf}`);
  }

  const generatedPdf = await buildGeneratedPdf(kind, year, month);
  const outDir = path.join(appRoot, "tmp", "pdf-compare", `${kind}-${year}-${String(month).padStart(2, "0")}`);
  fs.mkdirSync(outDir, { recursive: true });

  const generatedPdfPath = path.join(outDir, "generated.pdf");
  const generatedPngPath = path.join(outDir, "generated-page1.png");
  const referencePngPath = path.join(outDir, `reference-page${month}.png`);
  const generatedTxtPath = path.join(outDir, "generated-page1.txt");
  const referenceTxtPath = path.join(outDir, `reference-page${month}.txt`);

  fs.writeFileSync(generatedPdfPath, generatedPdf);
  await screenshotPage(generatedPdf, 1, generatedPngPath);
  await screenshotPage(referencePdf, month, referencePngPath);
  await extractPageText(generatedPdf, 1, generatedTxtPath);
  await extractPageText(referencePdf, month, referenceTxtPath);

  console.log("Comparacion lista:");
  console.log(`- PDF generado: ${generatedPdfPath}`);
  console.log(`- PNG generado: ${generatedPngPath}`);
  console.log(`- PNG referencia: ${referencePngPath}`);
  console.log(`- TXT generado: ${generatedTxtPath}`);
  console.log(`- TXT referencia: ${referenceTxtPath}`);
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
