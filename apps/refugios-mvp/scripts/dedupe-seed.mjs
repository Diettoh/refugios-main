/**
 * Ejecuta scripts/dedupe-seed.sql para eliminar duplicados del seed.
 * Uso: npm run db:dedupe-seed (con DATABASE_URL en .env)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL no definida");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, "dedupe-seed.sql");
const sql = fs.readFileSync(sqlPath, "utf8");

const connectionString = process.env.DATABASE_URL;
const needsSsl = connectionString.includes("sslmode=require");
const client = new Client({
  connectionString,
  ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {})
});

try {
  await client.connect();
  await client.query(sql);
  console.log("Duplicados del seed eliminados.");
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await client.end();
}
