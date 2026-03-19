import fs from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
async function run() {
  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  
  console.log("Wiping old imports...");
  await db.query("DELETE FROM sales WHERE description LIKE 'ASSET_PDF_VENTAS_%'");
  await db.query("DELETE FROM reservations WHERE notes LIKE 'ASSET_PDF_RESERVAS_%'");
  
  const files = [
    'db/migrations/021_import_reservas_2026_from_pdf.sql',
    'db/migrations/022_import_reservas_2025_from_pdf.sql',
    'db/migrations/014_seed_ventas_2026_from_staging.sql',
    'db/migrations/023_seed_ventas_2025_from_staging.sql'
  ];
  for (const f of files) {
    console.log('Running ' + f);
    const sql = fs.readFileSync(f, 'utf8');
    await db.query(sql);
  }
  
  await db.end();
  console.log('Done!');
}
run().catch(console.error);
