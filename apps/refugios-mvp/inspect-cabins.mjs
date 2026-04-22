import pg from 'pg';
const { Client } = pg;

function getArgValue(flag) {
  const argv = process.argv.slice(2);
  const idx = argv.findIndex((a) => a === flag || a.startsWith(`${flag}=`));
  if (idx === -1) return null;
  const raw = argv[idx];
  if (raw.includes("=")) return raw.split("=").slice(1).join("=");
  return argv[idx + 1] || null;
}

async function run() {
  const urlFromArgs = getArgValue("--url");
  const connectionString =
    urlFromArgs ||
    process.env.DATABASE_URL ||
    'postgresql://refugios:refugios_qa@localhost:5433/refugios';

  const db = new Client({
    connectionString
  });
  await db.connect();

  const res = await db.query('SELECT id, name, short_code FROM cabins ORDER BY id');
  console.table(res.rows);

  const res2 = await db.query(
    `SELECT cabin_id, COUNT(*)::int AS count
     FROM reservations
     GROUP BY cabin_id
     ORDER BY cabin_id`
  );
  console.table(res2.rows);

  const res3 = await db.query(
    `SELECT
       COUNT(*) FILTER (WHERE cabin_id IS NULL)::int AS reservations_without_cabin,
       COUNT(*)::int AS reservations_total,
       MIN(check_in)::text AS min_check_in,
       MAX(check_in)::text AS max_check_in
     FROM reservations`
  );
  console.table(res3.rows);

  await db.end();
}

run().catch(console.error);
