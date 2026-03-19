import pg from 'pg';
const { Client } = pg;

async function run() {
  const db = new Client({
    connectionString: 'postgresql://refugios:refugios_qa@localhost:5433/refugios'
  });
  await db.connect();

  const res = await db.query('SELECT id, name, short_code FROM cabins ORDER BY id');
  console.table(res.rows);

  const res2 = await db.query('SELECT cabin_id, COUNT(*) as count FROM reservations GROUP BY cabin_id ORDER BY cabin_id');
  console.table(res2.rows);

  await db.end();
}

run().catch(console.error);