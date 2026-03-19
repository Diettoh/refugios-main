# Coding Conventions

**Analysis Date:** 2026-03-16

## Naming Patterns

**Files:**
- Route files: `camelCase` plural noun matching the resource — e.g. `reservations.js`, `cabins.js`, `expenses.js`
- Utility files: `camelCase` describing purpose — e.g. `trelloBridge.js`
- Middleware files: `camelCase` describing the concern — e.g. `auth.js`
- DB client file: `client.js`
- Script files: `kebab-case.mjs` — e.g. `migrate.mjs`, `check-db.mjs`, `import-historical.mjs`

**Functions:**
- `camelCase` throughout
- Helper predicates: `is` prefix — `isDateOnly()`, `isTimeOnly()`, `isDateTimeValue()`, `isPublicPath()`
- Transformer helpers: descriptive verb — `normalizeLeadStage()`, `normalizeDocumentId()`, `statusFromLeadStage()`, `mapReservationEstado()`
- Utility builders: descriptive noun phrase — `buildCardDescription()`, `getDateRange()`, `sendCsv()`
- Exported middleware: `requireAuth`, `requireRole` — imperative verb phrase

**Variables:**
- `camelCase` for local variables
- `SCREAMING_SNAKE_CASE` for module-level constants — `JWT_SECRET`, `JWT_EXPIRES_IN`, `DEFAULT_TOTAL_CABINS`, `MAX_IMAGES_PER_CABIN`, `MAX_BASE64_LENGTH`, `LEAD_STAGES`, `SOURCE_MAP`
- Database column names in queries use `snake_case` matching PostgreSQL column names
- Query result rows accessed via dot notation: `result.rows[0].full_name`

**Exports:**
- Each route file does `export default router`
- Named exports only for reusable functions: `export function requireAuth`, `export function requireRole`, `export async function notifyReservationCreatedToTrello`
- DB client exports named function: `export async function query`

## Code Style

**Module system:** ES Modules (`"type": "module"` in `package.json`). All files use `import`/`export`, never `require`.

**Formatting:**
- No formatter config present (no `.prettierrc`, no `biome.json`)
- 2-space indentation throughout
- Double quotes for strings
- Trailing commas in multi-line arrays and objects
- Template literals for log messages and string interpolation
- Opening brace on same line (K&R style)

**Linting:**
- No ESLint config at the application level — only in `node_modules` third-party packages
- The `check` script uses `node --check` for basic syntax validation only

## Import Organization

**Order (observed pattern):**
1. Node built-in modules with `node:` prefix — `import fs from "node:fs"`, `import path from "node:path"`
2. Third-party packages — `import express from "express"`, `import jwt from "jsonwebtoken"`
3. Internal modules with relative paths — `import { query } from "../db/client.js"`

**Path Aliases:**
- None — all internal imports use relative paths with explicit `.js` extensions

**Rule:** Always include `.js` extension on relative imports (required for ESM in Node.js)

## Error Handling

**Route error pattern:**
- All async route handlers wrap their body in `try/catch`
- Errors propagate to Express via `next(error)` or `return next(error)`
- A single global error handler in `src/app.js` (lines 79–106) translates PostgreSQL error codes to HTTP responses

**Global error handler maps these PostgreSQL codes:**
- `MISSING_DATABASE_URL` → 503
- `42P01` (table not found) → 503
- `ENOTFOUND`, `EAI_AGAIN`, `ECONNREFUSED` → 503
- `28P01` (bad credentials) → 503
- `23503` (foreign key violation) → 400
- `23514` (check constraint violation) → 400
- `22P02` (invalid input syntax) → 400
- `23502` (not null violation) → 400
- default → 500

**Inline validation pattern (before hitting the DB):**
```javascript
if (!guest_id || !source || !payment_method || !check_in || !check_out || !cabin_id) {
  return res.status(400).json({ error: "Campos requeridos faltantes (incluida cabaña)" });
}
```

**ID validation pattern (consistent across all routes):**
```javascript
const id = Number(req.params.id);
if (!Number.isInteger(id) || id <= 0) {
  return res.status(400).json({ error: "id invalido" });
}
```

**Side-effect errors (non-critical) are swallowed locally:**
```javascript
try {
  await notifyReservationCreatedToTrello({ reservation: newReservation, guestName });
} catch (bridgeError) {
  console.error(`[trello-bridge] No se pudo sincronizar la reserva #${newReservation.id}: ${bridgeError.message}`);
}
```
Use this pattern for optional integrations (Trello, notifications) so they never fail the main request.

**DB client error propagation:**
- The `query()` function in `src/db/client.js` throws a custom error with `error.code = "MISSING_DATABASE_URL"` when `DATABASE_URL` is not set — this lets the global handler catch it cleanly

## Logging

**Framework:** `console` only — no logging library

**Patterns:**
- Server startup: `console.log(message)` in `src/server.js`
- Global error handler: `console.error(error)` before sending response
- Non-critical side effects: `console.error(\`[module-name] message\`)` with bracketed prefix
- No `console.log` in route handlers for normal requests

**Log format for non-critical errors:**
```
[module-name] Descripción del error #${entityId}: ${error.message}
```
Example: `[reservations] No se pudo crear venta para reserva #${newReservation.id}: ${saleErr.message}`

## Comments

**When to Comment:**
- Block comments (`/** ... */`) on JSDoc style for exported functions and major route groups
- Single-line `//` comments for inline clarifications on non-obvious logic
- Spanish comments are used (matches the project's domain language)
- SQL queries embedded in JS have no comments except when a block is logically distinct

**JSDoc usage:**
- Used on middleware exports in `src/middleware/auth.js`
- Route group headers use `/** GET /api/... — description */` pattern
- Not used on route handlers themselves — inline `//` comments only

## Function Design

**Size:** Route handlers are allowed to be long when they contain complex validation + business logic (e.g. `POST /api/reservations` is ~220 lines). Helper functions extracted when reused across routes.

**Parameters:** Route handlers always use `(req, res, next)` signature. Underscore prefix for unused params: `(_req, res, next)` when `req` is not used.

**Return values:**
- Route handlers always use explicit `return res.json(...)` or `return res.status(...).json(...)` to exit early and prevent double-sends
- Helper functions return plain values or `null`

## Module Design

**Router pattern:** Each domain file creates its own `Router` instance and registers all routes on it:
```javascript
const router = Router();
// route definitions...
export default router;
```

**DB access:** All database calls go through the single `query()` function exported from `src/db/client.js`. No ORM — raw parameterized SQL with `$1, $2, ...` placeholders.

**Dynamic PATCH queries:** Updates to individual fields use a dynamic `updates[]` array + `params[]` array pattern with an incrementing `i` counter:
```javascript
const updates = [];
const params = [];
let i = 1;
if (field !== undefined) {
  updates.push(`field = $${i++}`);
  params.push(value);
}
// ...
params.push(id);
await query(`UPDATE table SET ${updates.join(", ")} WHERE id = $${i}`, params);
```

**Feature flags via env:** Optional integrations are gated with env-var checks:
```javascript
function isBridgeEnabled() {
  const value = String(process.env.TRELLO_BRIDGE_ENABLED || "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}
```

**Concurrent DB queries:** Use `Promise.all([...])` when multiple independent queries are needed in one handler — seen in `dashboard.js` and `reservations.js /funnel`.

---

*Convention analysis: 2026-03-16*
