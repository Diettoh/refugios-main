import pg from 'pg';
import "dotenv/config";

const { Client } = pg;
const connectionString = process.env.DATABASE_URL?.trim();

async function truncateDB() {
  if (!connectionString) {
    console.error("DATABASE_URL no definida. Abortando.");
    process.exit(1);
  }

  if (process.env.CONFIRM_DESTRUCTIVE !== "true") {
    console.error("Abortado. Define CONFIRM_DESTRUCTIVE=true para truncar la base.");
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
    console.log("Conectado a la base de datos de Render.");
    
    // Eliminamos todo el contenido transaccional, pero dejamos las cabañas y los usuarios.
    // Usamos CASCADE para que elimine en cascada (ventas, documentos, etc).
    console.log("Limpiando datos...");
    await client.query("TRUNCATE TABLE reservations, guests, sales, expenses, documents RESTART IDENTITY CASCADE;");
    
    console.log("¡Éxito! Todas las reservas, gastos, ventas y huéspedes han sido eliminados de la base de datos.");
  } catch (err) {
    console.error("Error durante el borrado:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

truncateDB();
