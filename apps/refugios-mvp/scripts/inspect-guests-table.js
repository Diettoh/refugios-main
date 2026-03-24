import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://refugios_db_user:Lo7OemwvdKBKSaAUhJfTeYUZwdInBd3Y@dpg-d6u4vif5gffc739hch1g-a.oregon-postgres.render.com/refugios_db";

async function inspectTable() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
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
