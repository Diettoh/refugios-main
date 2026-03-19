# Architecture

**Analysis Date:** 2026-03-16

## Pattern Overview

**Overall:** Monolithic Express REST API with co-located static frontend (SPA served from `public/`)

**Key Characteristics:**
- Single Node.js process serves both API (`/api/*`) and frontend (static files from `public/`)
- No service layer or repository layer — routes call `query()` directly from `src/db/client.js`
- Flat route structure: one file per resource domain
- Business logic lives inside route handlers (inline validation, conflict checks, side effects)
- Frontend is a single-page app in `public/index.html` + `public/main.js` (Vanilla JS, no bundler)

## Layers

**HTTP Entry:**
- Purpose: Start server and bind to port
- Location: `apps/refugios-mvp/src/server.js`
- Contains: `dotenv` load, `app.listen()`
- Depends on: `src/app.js`
- Used by: Node.js process, Docker/Render start command

**Application Configuration:**
- Purpose: Register middleware, mount routers, global error handler
- Location: `apps/refugios-mvp/src/app.js`
- Contains: CORS, JSON body parser, static file serving, route mounts, error handler
- Depends on: all routers in `src/routes/`, `src/middleware/auth.js`
- Used by: `src/server.js`, `api/index.js` (Vercel adapter)

**Middleware:**
- Purpose: JWT authentication and role-based access control
- Location: `apps/refugios-mvp/src/middleware/auth.js`
- Contains: `requireAuth` (verifies Bearer JWT), `requireRole(...roles)` (restricts by role)
- Depends on: `jsonwebtoken`, `JWT_SECRET` env var
- Used by: `src/app.js` (applied globally to all `/api/*` routes after `/api/auth`)

**Route Handlers:**
- Purpose: Handle HTTP requests, validate inputs, execute SQL, return JSON or CSV
- Location: `apps/refugios-mvp/src/routes/`
- Contains: `auth.js`, `cabins.js`, `dashboard.js`, `documents.js`, `expenses.js`, `exports.js`, `guests.js`, `reservations.js`, `sales.js`, `users.js`
- Depends on: `src/db/client.js`, `src/utils/trelloBridge.js`
- Used by: `src/app.js`

**Database Client:**
- Purpose: Postgres connection pool and parameterized query wrapper
- Location: `apps/refugios-mvp/src/db/client.js`
- Contains: `pg.Pool` singleton, exported `query(text, params)` function
- Depends on: `DATABASE_URL` env var, `pg` package
- Used by: all route handlers

**Utilities:**
- Purpose: Optional side-effect integrations
- Location: `apps/refugios-mvp/src/utils/trelloBridge.js`
- Contains: `notifyReservationCreatedToTrello()` — HTTP POST to external Trello bridge service
- Depends on: `TRELLO_BRIDGE_ENABLED`, `TRELLO_BRIDGE_BASE_URL`, `TRELLO_BRIDGE_DEFAULT_LIST_ID` env vars
- Used by: `src/routes/reservations.js` (fire-and-forget on POST)

**Frontend:**
- Purpose: Single-page admin dashboard
- Location: `apps/refugios-mvp/public/`
- Contains: `index.html`, `main.js` (Vanilla JS, ~111KB), `styles.css`
- Depends on: REST API at `/api/*`
- Used by: Served statically by Express

## Data Flow

**Standard API Request (authenticated):**

1. Client sends `Authorization: Bearer <jwt>` header with request
2. Express reaches `app.use("/api", requireAuth)` — JWT verified, `req.user` populated
3. Request dispatched to matching router (e.g., `app.use("/api/reservations", reservationsRouter)`)
4. Route handler validates inputs inline (type checks, required fields, format patterns)
5. `query(sql, params)` called against `pg.Pool` — parameterized, no ORM
6. Result rows returned as JSON (`res.json(...)`) or CSV (`res.send(...)` with Content-Disposition)

**Reservation Creation (with side effects):**

1. `POST /api/reservations` validates required fields and date formats
2. Guest-overlap check: `SELECT` with `daterange` overlap against active reservations
3. Capacity check: per-night occupancy vs `TOTAL_CABINS` env var (default 6)
4. Cabin conflict check: no two reservations for same cabin in same period
5. `INSERT INTO reservations` — returns new row
6. Auto-creates linked `sales` row (category `lodging`) — non-blocking try/catch
7. Calls `notifyReservationCreatedToTrello()` — non-blocking, 5s timeout abort

**Authentication Flow:**

1. `POST /api/auth/login` receives `{ email, password }`
2. `SELECT` from `app_users` by email
3. `bcrypt.compare(password, password_hash)`
4. On success: `jwt.sign({ sub, email, role, name }, JWT_SECRET, { expiresIn: "12h" })`
5. Token returned to client; frontend stores it and sends as `Authorization: Bearer` on subsequent requests

**State Management:**
- No in-memory state — all state in PostgreSQL
- Each request is stateless (JWT carries identity)
- Trello bridge is fire-and-forget; failure logged but does not affect response

## Key Abstractions

**`query(text, params)`:**
- Purpose: Single interface for all database access
- Examples: used in every file under `src/routes/`
- Pattern: `const result = await query("SELECT ...", [param1, param2])` — always parameterized

**Express Router per resource:**
- Purpose: Group CRUD operations for one domain entity
- Examples: `src/routes/reservations.js`, `src/routes/guests.js`, `src/routes/cabins.js`
- Pattern: `const router = Router(); router.get("/", ...); export default router;`

**Lead Stage state machine (reservations):**
- Purpose: Track reservation commercial progress
- Values: `lead_new` → `quoted` → `pending_deposit` → `confirmed` → `completed` / `cancelled`
- Functions: `normalizeLeadStage()`, `statusFromLeadStage()` in `src/routes/reservations.js`
- Pattern: `lead_stage` drives `status` field — `PATCH /:id/stage` to advance

**Schema migrations:**
- Purpose: Versioned, idempotent database evolution
- Examples: `apps/refugios-mvp/db/migrations/001_init.sql` through `019_*.sql`
- Pattern: `schema_migrations` table tracks applied files; `scripts/migrate.mjs` applies in filename order

## Entry Points

**Production server:**
- Location: `apps/refugios-mvp/src/server.js`
- Triggers: `npm run start` (Render), `node src/server.js`
- Responsibilities: Load env, bind port, start Express

**Vercel serverless adapter:**
- Location: `apps/refugios-mvp/api/index.js`
- Triggers: Vercel function invocation
- Responsibilities: Export `app` for Vercel's serverless handler

**Migration runner:**
- Location: `apps/refugios-mvp/scripts/migrate.mjs`
- Triggers: `npm run db:migrate`, Render build command
- Responsibilities: Connect to DB, create `schema_migrations`, apply pending `.sql` files

## Error Handling

**Strategy:** Errors bubble to Express global error handler via `next(error)`. Route handlers use try/catch and call `next(error)` on failure.

**Patterns:**
- All async route handlers wrapped in `try { ... } catch (error) { next(error) }`
- Global error handler in `src/app.js` maps PostgreSQL error codes to HTTP responses:
  - `MISSING_DATABASE_URL` → 503
  - `42P01` (missing table) → 503
  - `ECONNREFUSED` / `ENOTFOUND` → 503
  - `23503` (FK violation) → 400
  - `23514` (check constraint) → 400
  - `22P02` (invalid format) → 400
  - `23502` (not null) → 400
  - Default → 500
- Side effects (Trello bridge, auto-sale creation) use isolated try/catch — failure logged, not propagated
- DB health endpoint `GET /api/health/db` uses inline try/catch with structured error messages

## Cross-Cutting Concerns

**Logging:** `console.error()` only — no structured logging library. Used in global error handler and side-effect catch blocks.

**Validation:** Inline in each route handler. Patterns: `Number.isInteger()`, regex for dates (`/^\d{4}-\d{2}-\d{2}$/`), string trimming. No validation library (e.g., Zod, Joi).

**Authentication:** JWT Bearer token via `Authorization` header. Applied globally at `app.use("/api", requireAuth)`. Public exceptions: `/api/auth/login`, `/api/health/db`, `/api/public-url`.

**Role-Based Access Control:** `requireRole(...roles)` middleware exported from `src/middleware/auth.js` — available but not currently applied to specific routes beyond global auth.

**Exports/Reporting:** CSV generation handled in `src/routes/exports.js` via `sendCsv()` helper. No external library — manual semicolon-delimited CSV with quoting.

---

*Architecture analysis: 2026-03-16*
