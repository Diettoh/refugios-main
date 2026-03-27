import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { Client } from "pg";
import "dotenv/config";

const VALID_MODES = new Set(["all", "schema", "data"]);
const DATA_MIGRATION_PATTERNS = [
  /(^|_)seed(_|\.sql$)/i,
  /(^|_)import(_|\.sql$)/i,
  /demo_to_production/i,
  /assign_cabins_for_asset_reservations/i,
  /dedupe/i,
  /recalculate/i,
  /corrected/i,
  /relink/i,
  /cleanup/i,
  /(^|_)clean(_|\.sql$)/i
];

function parseMigrationMode(argv) {
  let cliMode = null;

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--mode" && argv[index + 1]) {
      cliMode = argv[index + 1];
      index += 1;
      continue;
    }

    if (value.startsWith("--mode=")) {
      cliMode = value.slice("--mode=".length);
    }
  }

  const mode = (cliMode || process.env.DB_MIGRATION_MODE || "all").trim().toLowerCase();

  if (!VALID_MODES.has(mode)) {
    console.error(`Modo de migración inválido: ${mode}. Usa all, schema o data.`);
    process.exit(1);
  }

  return mode;
}

function inferMigrationType(filename, sql) {
  const explicitMode = sql.match(/^\s*--\s*migration-mode\s*:\s*(schema|data)\s*$/im)?.[1]?.toLowerCase();

  if (explicitMode) {
    return explicitMode;
  }

  return DATA_MIGRATION_PATTERNS.some((pattern) => pattern.test(filename)) ? "data" : "schema";
}

function shouldApplyMigration(migrationType, selectedMode) {
  return selectedMode === "all" || selectedMode === migrationType;
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL no definida");
  process.exit(1);
}

const selectedMode = parseMigrationMode(process.argv.slice(2));
const connectionString = process.env.DATABASE_URL.trim();
const maskedUrl = connectionString.includes("@") 
  ? connectionString.replace(/:([^:@]+)@/, ":****@")
  : "URL malformada (no contiene @)";

console.log(`Conectando a DB: ${maskedUrl}`);
console.log(`Modo de migración: ${selectedMode}`);

const needsSsl = connectionString.includes("sslmode=require") || connectionString.includes("render.com");
const client = new Client({
  connectionString,
  ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {})
});

const migrationsDir = path.join(process.cwd(), "db", "migrations");

function listMigrations() {
  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

try {
  await client.connect();
  let appliedCount = 0;
  let skippedByModeCount = 0;

  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const files = listMigrations();

  for (const filename of files) {
    const already = await client.query("SELECT 1 FROM schema_migrations WHERE filename = $1", [filename]);
    if (already.rowCount > 0) {
      console.log(`skip ${filename}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, filename), "utf8");
    const migrationType = inferMigrationType(filename, sql);

    if (!shouldApplyMigration(migrationType, selectedMode)) {
      skippedByModeCount += 1;
      console.log(`skip ${filename} (type=${migrationType}, mode=${selectedMode})`);
      continue;
    }

    await client.query("BEGIN");
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [filename]);
    await client.query("COMMIT");
    console.log(`applied ${filename}`);
    appliedCount += 1;
  }

  console.log(`Migraciones completadas: applied=${appliedCount}, skipped_by_mode=${skippedByModeCount}`);
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  console.error(error);
  process.exit(1);
} finally {
  await client.end();
}
