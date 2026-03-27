import pg from 'pg';
import "dotenv/config";

const { Client } = pg;
const connectionString = process.env.DATABASE_URL?.trim();

async function hardReset() {
  if (!connectionString) {
    console.error("DATABASE_URL no definida. Abortando.");
    process.exit(1);
  }

  if (process.env.CONFIRM_DESTRUCTIVE !== "true") {
    console.error("Abortado. Define CONFIRM_DESTRUCTIVE=true para reiniciar la base.");
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
    console.log("Conectado a Render.");
    
    // Obtener todas las tablas del esquema public excepto schema_migrations
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name != 'schema_migrations'
    `);
    
    const tables = res.rows.map(r => r.table_name);
    
    if (tables.length > 0) {
      console.log(`Vaciando tablas: ${tables.join(', ')}`);
      await client.query(`TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE;`);
    }

    console.log("Insertando usuario administrador base...");
    // Contraseña: refugios123
    await client.query(`
      INSERT INTO app_users (full_name, email, role, is_active, password_hash)
      VALUES ('Administrador', 'rodrigo@refugios.local', 'admin', true, '$2b$10$FzKVn.S5kD00ngB.Q.2wieTO/EvbrZOfhcHutqYEiwIXBx6vJOXIy')
    `);
    
    console.log("Insertando cabañas por defecto...");
    await client.query(`
      INSERT INTO cabins (name, short_code, max_guests)
      VALUES 
        ('Cabaña 1 Azul', 'C1', 4),
        ('Cabaña 2 Roja', 'C2', 4),
        ('Cabaña 3 Verde', 'C3', 4),
        ('Casa AvA', 'CASA', 8)
    `);

    console.log("¡Éxito! Tablas vacías. Usuario 'rodrigo@refugios.local' (pass: refugios123) y 4 cabañas base creadas.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

hardReset();
