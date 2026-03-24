import pg from 'pg';

const { Client } = pg;
const connectionString = "postgresql://refugios_db_user:Lo7OemwvdKBKSaAUhJfTeYUZwdInBd3Y@dpg-d6u4vif5gffc739hch1g-a.oregon-postgres.render.com/refugios_db";

async function truncateDB() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
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
