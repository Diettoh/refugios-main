import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import usersRouter from "./routes/users.js";
import guestsRouter from "./routes/guests.js";
import reservationsRouter from "./routes/reservations.js";
import cabinsRouter from "./routes/cabins.js";
import salesRouter from "./routes/sales.js";
import expensesRouter from "./routes/expenses.js";
import documentsRouter from "./routes/documents.js";
import exportsRouter from "./routes/exports.js";
import authRouter from "./routes/auth.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "refugios-mvp", ts: new Date().toISOString() });
});

// URL pública (cuando se accede por tunnel: https://xxx.trycloudflare.com)
app.get("/api/public-url", (req, res) => {
  const protocol = req.get("x-forwarded-proto") || req.protocol || "https";
  const host = req.get("x-forwarded-host") || req.get("host") || "localhost:3000";
  const publicUrl = `${protocol}://${host}`;
  res.json({ public_url: publicUrl });
});

// Diagnóstico de base de datos (conexión y tablas)
app.get("/api/health/db", async (_req, res) => {
  try {
    const { query } = await import("./db/client.js");
    await query("SELECT 1");
    const r = await query(
      "SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'schema_migrations'"
    );
    const hasMigrations = Number(r?.rows?.[0]?.n || 0) > 0;
    const dbUrl = String(process.env.DATABASE_URL || "");
    const dbFingerprint = dbUrl
      ? crypto.createHash("sha256").update(dbUrl).digest("hex").slice(0, 12)
      : "";
    return res.json({
      db: "ok",
      migrations: hasMigrations,
      db_fingerprint: dbFingerprint,
      runtime: { node: process.version }
    });
  } catch (err) {
    const code = err?.code || "";
    const msg =
      code === "MISSING_DATABASE_URL"
        ? "Falta DATABASE_URL en el entorno"
        : code === "ECONNREFUSED"
          ? "No se pudo conectar al servidor (¿Postgres en marcha?)"
          : code === "42P01"
            ? "Tablas no creadas; ejecuta npm run db:migrate"
            : code === "28P01"
              ? "Credenciales de base de datos inválidas"
              : err?.message || "Error de base de datos";
    return res.status(503).json({ db: "error", error: msg, code });
  }
});

// Auth va ANTES del middleware JWT
app.use("/api/auth", authRouter);

// Todas las rutas /api/* (salvo auth y health) requieren JWT
app.use("/api", requireAuth);

app.use("/api/users", usersRouter);
app.use("/api/guests", guestsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/cabins", cabinsRouter);
app.use("/api/sales", salesRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/exports", exportsRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error?.code === "MISSING_DATABASE_URL") {
    return res.status(503).json({ error: "Servicio no configurado: falta DATABASE_URL" });
  }
  if (error?.code === "42P01") {
    return res.status(503).json({ error: "Base de datos sin migrar. Ejecuta db:migrate." });
  }
  if (["ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED"].includes(error?.code)) {
    return res.status(503).json({ error: "No se pudo conectar a la base de datos." });
  }
  if (error?.code === "28P01") {
    return res.status(503).json({ error: "Credenciales de base de datos invalidas." });
  }
  if (error?.code === "23503") {
    return res.status(400).json({ error: "Referencia invalida: verifica huésped, reserva o venta relacionada." });
  }
  if (error?.code === "23514") {
    return res.status(400).json({ error: "Dato fuera de catálogo permitido (canal, estado, documento o forma de pago)." });
  }
  if (error?.code === "22P02") {
    return res.status(400).json({ error: "Formato de dato invalido en la solicitud." });
  }
  if (error?.code === "23502") {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
