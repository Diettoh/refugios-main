#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function normName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function toDateKey(value) {
  return String(value || "").slice(0, 10);
}

function toUtcDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function dayKeysBetweenInclusive(startKey, endKey) {
  const start = toUtcDate(startKey);
  const end = toUtcDate(endKey);
  const out = [];
  const oneDay = 86400000;
  let cur = start.getTime();
  const endMs = end.getTime();
  let guard = 0;
  while (cur <= endMs && guard < 400) {
    out.push(new Date(cur).toISOString().slice(0, 10));
    cur += oneDay;
    guard += 1;
  }
  return out;
}

function inferStays(days) {
  // Build a per-day multiplicity count for each (guest_name, pax)
  const byGuest = new Map(); // name|pax -> Map(dateKey -> count)
  const allDates = new Set();

  for (const day of days || []) {
    const date = toDateKey(day.date);
    if (!date) continue;
    allDates.add(date);
    for (const e of day.entries || []) {
      const name = normName(e.name);
      const pax = Number(e.pax);
      if (!name || !Number.isFinite(pax) || pax <= 0) continue;
      const k = `${name}|${pax}`;
      if (!byGuest.has(k)) byGuest.set(k, new Map());
      const m = byGuest.get(k);
      m.set(date, (m.get(date) || 0) + 1);
    }
  }

  const stays = [];

  for (const [k, counts] of byGuest) {
    const [name, paxStr] = k.split("|");
    const pax = Number(paxStr);
    const dates = [...counts.keys()].sort();
    if (dates.length === 0) continue;

    // Iterate day-by-day from first to last date (fills gaps with count=0)
    const start = dates[0];
    const end = dates[dates.length - 1];
    const fullRange = dayKeysBetweenInclusive(start, end);

    const active = []; // array of { check_in, last_night }

    let prevDate = null;
    for (const date of fullRange) {
      const need = counts.get(date) || 0;

      if (prevDate) {
        const diffDays = Math.round((toUtcDate(date) - toUtcDate(prevDate)) / 86400000);
        if (diffDays !== 1) {
          // gap: close all active at prevDate
          for (const a of active) stays.push({ guest_name: name, pax, check_in: a.check_in, last_night: prevDate });
          active.length = 0;
        }
      }

      // Extend or close existing stays
      if (need < active.length) {
        // Close extra active stays at previous date (or same date-1 for first day)
        const closeAt = prevDate || date;
        const toClose = active.splice(need); // the tail
        for (const a of toClose) stays.push({ guest_name: name, pax, check_in: a.check_in, last_night: closeAt });
      }

      // Extend remaining active stays to this date
      for (const a of active) a.last_night = date;

      // Start new stays if needed
      while (active.length < need) {
        active.push({ check_in: date, last_night: date });
      }

      prevDate = date;
    }

    // Close remaining active stays at end
    for (const a of active) stays.push({ guest_name: name, pax, check_in: a.check_in, last_night: a.last_night });
  }

  // Convert last_night -> check_out (exclusive)
  for (const s of stays) {
    const last = toUtcDate(s.last_night);
    s.check_out = new Date(last.getTime() + 86400000).toISOString().slice(0, 10);
    delete s.last_night;
  }

  stays.sort(
    (a, b) =>
      a.check_in.localeCompare(b.check_in) ||
      a.check_out.localeCompare(b.check_out) ||
      a.guest_name.localeCompare(b.guest_name) ||
      a.pax - b.pax
  );

  return stays;
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlDate(dateKey) {
  return `DATE ${sqlString(dateKey)}`;
}

function buildMigrationSql({ stays, sourceFile, year }) {
  const values = stays
    .map((s, idx) => {
      const month = Number(s.check_in.slice(5, 7));
      const seedKey = `ASSET_PDF_RESERVAS_${year}_M${month}_R${idx + 1}`;
      return `    (${sqlString(seedKey)}, ${sqlString(sourceFile)}, ${year}, ${sqlString(s.guest_name)}, ${s.pax}, ${sqlDate(s.check_in)}, ${sqlDate(s.check_out)})`;
    })
    .join(",\n");

  return `-- Import real de reservas desde calendario PDF (RESERVAS ${year}.pdf)
-- Fuente: assets/${sourceFile}
-- Generado desde staging day-occupancy (scripts/extract-reservas-staging.mjs)
-- Nota: el PDF no codifica cabin_id; se importa sin cabaña asignada.

-- 1) Eliminar seed sintético previo (no representa el PDF real).
DELETE FROM reservations
WHERE notes = 'ASSET_PDF_RESERVAS_${year}';

WITH seed(seed_key, source_file, year, guest_name, pax, check_in_date, check_out_date) AS (
  VALUES
${values}
),
normalized AS (
  SELECT
    s.*,
    ('ASSET_PDF_RESERVAS_${year}'
     || ' | key=' || s.seed_key
     || ' | src=' || s.source_file
     || ' | pax=' || s.pax
    ) AS reservation_note
  FROM seed s
),
ins_guests AS (
  INSERT INTO guests (full_name, notes)
  SELECT DISTINCT n.guest_name, 'ASSET_PDF_RESERVAS_${year}'
  FROM normalized n
  WHERE NOT EXISTS (
    SELECT 1 FROM guests g WHERE LOWER(g.full_name) = LOWER(n.guest_name)
  )
  RETURNING id
),
resolved AS (
  SELECT
    n.*,
    (
      SELECT g.id
      FROM guests g
      WHERE LOWER(g.full_name) = LOWER(n.guest_name)
      ORDER BY g.id
      LIMIT 1
    ) AS guest_id
  FROM normalized n
),
ins_reservations AS (
  INSERT INTO reservations (
    guest_id,
    cabin_id,
    source,
    payment_method,
    status,
    lead_stage,
    check_in,
    check_out,
    guests_count,
    total_amount,
    notes
  )
  SELECT
    r.guest_id,
    NULL,
    'other',
    'transfer',
    'confirmed',
    'confirmed',
    r.check_in_date,
    r.check_out_date,
    GREATEST(r.pax, 1),
    0,
    r.reservation_note
  FROM resolved r
  WHERE r.guest_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM reservations rr WHERE COALESCE(rr.notes, '') = r.reservation_note
  )
  RETURNING id
)
SELECT
  (SELECT COUNT(*) FROM seed) AS seed_rows,
  (SELECT COUNT(*) FROM ins_reservations) AS inserted_reservations;
`;
}

const args = process.argv.slice(2);
const stagingPath = args[0] ? path.resolve(args[0]) : path.resolve("db/staging/reservas_2026.day_occupancy.json");
const outPath = args[1] ? path.resolve(args[1]) : path.resolve("db/migrations/021_import_reservas_2026_from_pdf.sql");

if (!fs.existsSync(stagingPath)) {
  console.error(`Staging no encontrado: ${stagingPath}`);
  console.error("Primero genera staging con: node scripts/extract-reservas-staging.mjs <pdf> 2026");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(stagingPath, "utf8"));
const year = Number(data.year) || 2026;
const sourceFile = String(data.source_file || "RESERVAS 2026.pdf");
const stays = inferStays(data.days || []);

const sql = buildMigrationSql({ stays, sourceFile, year });
fs.writeFileSync(outPath, sql, "utf8");

console.log("Migración generada:");
console.log(`- ${outPath}`);
console.log(`Stays inferidas: ${stays.length}`);
console.log(`Seed note prefix: ASSET_PDF_RESERVAS_${year} | key=...`);
console.log("Tip: revisar el archivo y luego ejecutar db:migrate / deploy.");
