import pg from 'pg';
import "dotenv/config";
const { Client } = pg;

const connectionString = process.env.DATABASE_URL?.trim();

async function inspectTable() {
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
    
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'guests'
    `);
    console.log("Columnas de 'guests':");
    console.table(columns.rows);

    const indexes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'guests'
    `);
    console.log("Índices de 'guests':");
    console.table(indexes.rows);

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

inspectTable();
