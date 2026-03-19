#!/usr/bin/env node
/**
 * Genera una migración SQL de Ventas desde staging normalizado.
 *
 * Objetivo: insertar filas en `sales` y vincularlas a `reservations` reales (ASSET_PDF_RESERVAS_YYYY)
 * usando coincidencia por (año, mes, primer nombre normalizado).
 *
 * Uso:
 *   node scripts/extract-ventas-staging.mjs "../../assets/Ventas AvA 2025.pdf" 2025
 *   node scripts/generate-ventas-migration.mjs db/staging/ventas_ava_2025.normalized.json db/migrations/023_seed_ventas_2025_from_staging.sql
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function norm(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normUpper(value) {
  return norm(value).toUpperCase();
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlNullableString(value) {
  if (value === null || value === undefined) return "NULL";
  const s = String(value);
  if (!s.trim()) return "NULL";
  return sqlString(s);
}

function sqlNullableNumber(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  const n = Number(value);
  return Number.isFinite(n) ? String(Math.round(n)) : "NULL";
}

function buildSeedKey(prefix, row) {
  const y = Number(row.year);
  const m = Number(row.month);
  const p = Number(row.page);
  const r = Number(row.row_no);
  return `${prefix}_${y}_M${m}_P${p}_R${r}`;
}

function buildSql({ rows, year, sourceFile, notePrefix, outTag }) {
  const seedValues = rows
    .filter((r) => Number(r.year) === year)
    .map((r) => {
      const seedKey = buildSeedKey(notePrefix, r);
      const guestName = String(r.guest_name || "").trim();
      const guestResolved = guestName === "..." ? `PENDIENTE PDF VENTAS ${year} P${r.page}-R${r.row_no}` : guestName;
      const firstNameNorm = normUpper(guestResolved.split(" ")[0] || guestResolved);
      const amountResolved = Number(r.total_stay || 0) > 0 ? Number(r.total_stay) : Number(r.utility || 0);

      return `    (${sqlString(seedKey)}, ${sqlString(sourceFile)}, ${year}, ${r.month}, ${r.page}, ${r.row_no}, ${sqlString(
        guestName
      )}, ${sqlNullableString(r.r_or_c)}, ${sqlNullableString(r.product_code)}, ${sqlNullableNumber(r.pax)}, ${sqlNullableNumber(
        r.pax_ad
      )}, ${sqlNullableNumber(r.nights)}, ${sqlNullableNumber(r.nightly_price)}, ${sqlNullableNumber(r.cleaning_supplement)}, ${sqlNullableNumber(
        r.total_per_night
      )}, ${sqlNullableNumber(r.total_stay)}, ${sqlNullableNumber(r.utility)}, ${sqlNullableString(r.notes)}, ${sqlNullableString(
        r.quality_flags
      )}, ${sqlString(guestResolved)}, ${sqlString(firstNameNorm)}, ${sqlNullableNumber(amountResolved)})`;
    })
    .join(",\n");

  return `-- Seed de ventas ${year} desde staging normalizado (${sourceFile})
-- Inserta en sales y actualiza reservations.

WITH seed(
  seed_key,
  source_file,
  year,
  month,
  page,
  row_no,
  guest_name,
  r_or_c,
  product_code,
  pax,
  pax_ad,
  nights,
  nightly_price,
  cleaning_supplement,
  total_per_night,
  total_stay,
  utility,
  notes,
  quality_flags,
  guest_name_resolved,
  guest_first_norm,
  amount_resolved
) AS (
  VALUES
${seedValues}
),
resolved AS (
  SELECT
    s.*,
    make_date(s.year, s.month, 1) AS month_date,
    (
      SELECT r.id
      FROM reservations r
      JOIN guests g ON g.id = r.guest_id
      WHERE r.notes LIKE ${sqlString(`ASSET_PDF_RESERVAS_${year}%`)}
        AND date_trunc('month', r.check_in) = date_trunc('month', make_date(s.year, s.month, 1))
        AND upper(regexp_replace(g.full_name, '\\s+.*$', '')) = s.guest_first_norm
      ORDER BY r.check_in, r.id
      LIMIT 1
    ) AS reservation_id
  FROM seed s
  WHERE COALESCE(s.amount_resolved, 0) > 0
),
updated_reservations AS (
  UPDATE reservations r
  SET 
    source = CASE 
      WHEN res.product_code = 'T' THEN 'direct'
      WHEN res.product_code = 'P' THEN 'web'
      WHEN res.product_code = 'A' THEN 'airbnb'
      WHEN res.product_code = 'B' THEN 'booking'
      ELSE r.source
    END,
    payment_method = CASE
      WHEN res.product_code = 'T' THEN 'transfer'
      WHEN res.product_code = 'P' THEN 'card'
      WHEN res.product_code IN ('A', 'B') THEN 'other'
      ELSE r.payment_method
    END,
    cabin_id = CASE
      WHEN res.r_or_c = 'C' THEN 4
      WHEN res.r_or_c = 'R' AND r.cabin_id IS NULL THEN (SELECT id FROM cabins WHERE sort_order IN (1,2,3) ORDER BY random() LIMIT 1)
      ELSE r.cabin_id
    END,
    additional_charge = COALESCE(res.cleaning_supplement, 0),
    reservation_document_type = CASE
      WHEN res.notes ILIKE '%sii%' OR res.notes ILIKE '%boleta%' THEN 'boleta'
      WHEN res.notes ILIKE '%factura%' THEN 'factura'
      ELSE NULL
    END,
    total_amount = res.amount_resolved
  FROM resolved res
  WHERE r.id = res.reservation_id
  RETURNING r.id
)
INSERT INTO sales (
  reservation_id,
  category,
  amount,
  payment_method,
  sale_date,
  description
)
SELECT
  r.reservation_id,
  CASE WHEN r.cleaning_supplement > 0 THEN 'lodging' ELSE 'lodging' END,
  r.amount_resolved::numeric(12,2),
  CASE
    WHEN r.product_code = 'T' THEN 'transfer'
    WHEN r.product_code = 'P' THEN 'card'
    ELSE 'other'
  END,
  COALESCE((SELECT rr.check_in FROM reservations rr WHERE rr.id = r.reservation_id), r.month_date),
  (${sqlString(outTag)} || ' | key=' || r.seed_key || ' | ' || r.guest_name_resolved
    || CASE WHEN r.notes IS NOT NULL THEN ' | notes=' || r.notes ELSE '' END
  )
FROM resolved r
WHERE NOT EXISTS (
  SELECT 1 FROM sales s WHERE s.description = (${sqlString(outTag)} || ' | key=' || r.seed_key || ' | ' || r.guest_name_resolved
    || CASE WHEN r.notes IS NOT NULL THEN ' | notes=' || r.notes ELSE '' END
  )
);
`;
}

const args = process.argv.slice(2);
const stagingPath = args[0] ? path.resolve(args[0]) : null;
const outPath = args[1] ? path.resolve(args[1]) : null;

if (!stagingPath || !outPath) {
  console.error("Uso: node scripts/generate-ventas-migration.mjs <staging.json> <out.sql>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(stagingPath, "utf8"));
const rows = Array.isArray(data) ? data : data.rows || data.items || data;

if (!Array.isArray(rows) || rows.length === 0) {
  console.error("Staging inválido: se esperaba un array de filas normalizadas");
  process.exit(1);
}

const year = Number(rows[0].year);
const sourceFile = String(rows[0].source_file || `Ventas AvA ${year}.pdf`);
const notePrefix = "ASSET_PDF_VENTAS";
const outTag = `ASSET_PDF_VENTAS_${year}`;

const sql = buildSql({ rows, year, sourceFile, notePrefix, outTag });
fs.writeFileSync(outPath, sql, "utf8");
console.log("Migración generada:");
console.log(`- ${outPath}`);
console.log(`Filas staging: ${rows.length}`);

