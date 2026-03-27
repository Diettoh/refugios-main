import pg from 'pg';
import "dotenv/config";
const { Client } = pg;

const connectionString = process.env.DATABASE_URL?.trim();

async function check() {
  if (!connectionString) {
    console.error("DATABASE_URL no definida. Abortando.");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: connectionString.includes("sslmode=require") || connectionString.includes("render.com")
      ? { rejectUnauthorized: false }
      : false
  });

  try {
    await client.connect();
    console.log("Conectado a la DB de Render.");

    const res = await client.query(`
      SELECT id, guest_id, check_in, check_out, notes 
      FROM reservations 
      WHERE (check_in >= '2026-01-01' AND check_in <= '2026-02-28')
         OR notes LIKE '%Francisco Espinoza%'
      ORDER BY check_in, id
    `);

    console.log("Reservas encontradas (Ene-Feb 2026):");
    console.table(res.rows.map(r => ({
      id: r.id,
      guest: r.guest_id,
      in: r.check_in.toISOString().split('T')[0],
      out: r.check_out.toISOString().split('T')[0],
      notes: (r.notes || "").substring(0, 50) + "..."
    })));

    const count = await client.query("SELECT COUNT(*) FROM reservations");
    console.log("Total de reservas:", count.rows[0].count);

  } catch (err) {
    console.error("Error al conectar o consultar:", err.message);
  } finally {
    await client.end();
  }
}

check();
