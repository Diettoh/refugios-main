#!/usr/bin/env node
/**
 * Sincroniza PDFs y Excel desde una carpeta hacia la base de datos.
 * Detecta tipo por nombre de archivo (ventas, reservas, gastos) y año si aparece (ej. 2026).
 *
 * Uso: node scripts/sync-pdfs.mjs [carpeta] [año]
 *   carpeta: ruta a la carpeta con PDFs/Excel (default: ./data)
 *   año: año a usar para PDFs sin año en el nombre (default: año actual)
 *
 * Ejemplo: node scripts/sync-pdfs.mjs ./data 2026
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptDir = __dirname;
const appDir = path.resolve(scriptDir, "..");
const dataDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(appDir, "data");
const defaultYear = process.argv[3] ? parseInt(process.argv[3], 10) : new Date().getFullYear();

function detectTypeAndYear(filename) {
  const base = path.basename(filename, path.extname(filename));
  const lower = base.toLowerCase();
  let type = null;
  if (lower.includes("ventas") || lower.includes("venta")) type = "ventas";
  else if (lower.includes("reservas") || lower.includes("reserva")) type = "reservas";
  else if (lower.includes("gastos") || lower.includes("gasto")) type = "gastos";
  const yearMatch = base.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : defaultYear;
  return { type, year };
}

async function run() {
  if (!fs.existsSync(dataDir)) {
    console.warn(`Carpeta no encontrada: ${dataDir}`);
    console.warn("Creando carpeta de ejemplo. Coloca aquí tus PDFs/Excel (ej. Ventas AvA 2026.pdf, RESERVAS 2026.pdf, Gastos AvA Refugios 2026.xlsx) y vuelve a ejecutar.");
    fs.mkdirSync(dataDir, { recursive: true });
    process.exit(0);
  }

  const files = fs.readdirSync(dataDir).map((f) => path.join(dataDir, f));
  const pdfs = files.filter((f) => fs.statSync(f).isFile() && f.toLowerCase().endsWith(".pdf"));
  const excels = files.filter((f) => fs.statSync(f).isFile() && f.toLowerCase().endsWith(".xlsx"));

  const importScript = path.join(scriptDir, "import-pdf-excel.mjs");

  let total = 0;
  for (const file of [...pdfs, ...excels]) {
    const ext = path.extname(file).toLowerCase();
    const { type, year } = detectTypeAndYear(file);
    if (!type) {
      console.warn(`Omitido (nombre no reconocido): ${path.basename(file)}`);
      continue;
    }
    if (ext === ".xlsx" && type !== "gastos") {
      console.warn(`Omitido (Excel solo para gastos): ${path.basename(file)}`);
      continue;
    }
    if (ext === ".pdf" && type === "gastos") {
      console.warn(`Omitido (gastos debe ser .xlsx): ${path.basename(file)}`);
      continue;
    }

    const { spawn } = await import("node:child_process");
    const child = spawn(
      process.execPath,
      [importScript, type, file, String(year)],
      { cwd: appDir, stdio: "inherit", env: process.env }
    );
    const code = await new Promise((resolve) => child.on("close", resolve));
    if (code === 0) total += 1;
  }

  console.log(`Sincronización terminada. Archivos procesados: ${total}.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
