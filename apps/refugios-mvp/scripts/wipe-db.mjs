import pg from 'pg';
import { execSync } from 'node:child_process';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("No se encontró DATABASE_URL. Abortando.");
  process.exit(1);
}

async function wipeAndMigrate() {
  const client = new Client({
    connectionString,
    ssl: connectionString.includes("render.com") || connectionString.includes("dpg-") ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log("Conectado a la base de datos.");
    
    // Eliminar todo el esquema público y volver a crearlo
    console.log("Eliminando todas las tablas y datos (DROP SCHEMA public CASCADE)...");
    await client.query("DROP SCHEMA public CASCADE;");
    await client.query("CREATE SCHEMA public;");
    
    console.log("Base de datos completamente limpia.");
    await client.end();

    // Volver a correr las migraciones desde cero
    console.log("Re-ejecutando migraciones...");
    execSync("npm run db:migrate", { stdio: 'inherit' });
    
    console.log("¡Éxito! Base de datos restaurada como nueva.");
  } catch (err) {
    console.error("Error durante el borrado:", err);
    process.exit(1);
  }
}

wipeAndMigrate();
