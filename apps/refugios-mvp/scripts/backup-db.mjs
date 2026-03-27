import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { Client } from "pg";
import "dotenv/config";

function parseArgs(argv) {
  const args = { out: null };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--out" && argv[index + 1]) {
      args.out = argv[index + 1];
      index += 1;
    }
  }

  return args;
}

function quoteIdent(identifier) {
  return `"${String(identifier).replace(/"/g, "\"\"")}"`;
}

async function getPublicTables(client) {
  const result = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  return result.rows.map((row) => row.table_name);
}

async function getColumns(client, tableName) {
  const result = await client.query(
    `
      SELECT
        column_name,
        data_type,
        udt_name,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `,
    [tableName]
  );

  return result.rows;
}

async function getPrimaryKeyColumns(client, tableName) {
  const result = await client.query(
    `
      SELECT a.attname AS column_name
      FROM pg_index i
      JOIN pg_class t ON t.oid = i.indrelid
      JOIN pg_namespace n ON n.oid = t.relnamespace
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(i.indkey)
      WHERE n.nspname = 'public'
        AND t.relname = $1
        AND i.indisprimary
      ORDER BY array_position(i.indkey, a.attnum)
    `,
    [tableName]
  );

  return result.rows.map((row) => row.column_name);
}

async function getRows(client, tableName, primaryKeyColumns) {
  const quotedTable = quoteIdent(tableName);
  const orderByClause =
    primaryKeyColumns.length > 0
      ? ` ORDER BY ${primaryKeyColumns.map(quoteIdent).join(", ")}`
      : "";

  const result = await client.query(`SELECT * FROM public.${quotedTable}${orderByClause}`);
  return result.rows;
}

async function main() {
  const { out } = parseArgs(process.argv.slice(2));
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    console.error("DATABASE_URL no definida");
    process.exit(1);
  }

  const needsSsl = connectionString.includes("sslmode=require") || connectionString.includes("render.com");
  const client = new Client({
    connectionString,
    ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {})
  });

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  const outputPath = path.resolve(
    out || path.join("tmp", "db-backups", `postgres-backup-${timestamp}.json`)
  );

  try {
    await client.connect();

    const dbInfo = await client.query(
      `
        SELECT
          current_database() AS database_name,
          current_user AS database_user,
          current_setting('server_version') AS server_version
      `
    );

    const tables = await getPublicTables(client);
    const backup = {
      generatedAt: now.toISOString(),
      database: dbInfo.rows[0],
      tables: []
    };

    for (const tableName of tables) {
      const [columns, primaryKeyColumns] = await Promise.all([
        getColumns(client, tableName),
        getPrimaryKeyColumns(client, tableName)
      ]);
      const rows = await getRows(client, tableName, primaryKeyColumns);

      backup.tables.push({
        tableName,
        rowCount: rows.length,
        primaryKeyColumns,
        columns,
        rows
      });
    }

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(backup, null, 2), "utf8");

    const totalRows = backup.tables.reduce((sum, table) => sum + table.rowCount, 0);
    console.log(
      JSON.stringify(
        {
          outputPath,
          tables: backup.tables.length,
          totalRows
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

await main();
