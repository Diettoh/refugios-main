#!/usr/bin/env node
/**
 * Verifica conexión a la base de datos y que las tablas esperadas existan.
 * Uso: node scripts/check-db.mjs   (desde apps/refugios-mvp, con .env cargado)
 */
import { Client } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL no está definida.");
  console.error("En .env define por ejemplo:");
  console.error("  DATABASE_URL=postgresql://refugios:refugios_qa@localhost:5433/refugios");
  console.error("Si usas Docker: docker compose -f docker-compose.tunnel.yml up -d db");
  process.exit(1);
}

const needsSsl = connectionString.includes("sslmode=require");
const client = new Client({
  connectionString,
  connectionTimeoutMillis: 5000,
  ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {})
});

const TABLES = [
  "schema_migrations",
  "app_users",
  "guests",
  "reservations",
  "sales",
  "expenses",
  "documents",
  "cabins",
  "cabin_images"
];

async function run() {
  try {
    await client.connect();
    console.log("Conexión OK.");
  } catch (err) {
    console.error("No se pudo conectar a la base de datos:");
    if (err.code === "ECONNREFUSED") {
      console.error("  El servidor rechazó la conexión. ¿Está Postgres en marcha?");
      console.error("  Con Docker: docker compose -f docker-compose.tunnel.yml up -d db");
    } else if (err.code === "ENOTFOUND") {
      console.error("  Host no encontrado. Revisa el host en DATABASE_URL.");
    } else if (err.code === "28P01") {
      console.error("  Usuario o contraseña incorrectos.");
    } else if (err.code === "3D000") {
      console.error("  La base de datos no existe. Créala o revisa el nombre en DATABASE_URL.");
    } else {
      console.error("  ", err.message);
    }
    process.exit(1);
  }

  try {
    const missing = [];
    for (const table of TABLES) {
      const r = await client.query(
        `SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1`,
        [table]
      );
      if (r.rowCount === 0) missing.push(table);
    }
    if (missing.length > 0) {
      console.error("Tablas faltantes (ejecuta migraciones: npm run db:migrate):", missing.join(", "));
      process.exit(1);
    }
    const count = await client.query("SELECT COUNT(*) AS n FROM schema_migrations");
    console.log("Tablas OK. Migraciones aplicadas:", count.rows[0].n);
    console.log("Base de datos lista.");
  } catch (err) {
    console.error("Error al verificar tablas:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
