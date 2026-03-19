# Codebase Structure

**Analysis Date:** 2026-03-16

## Directory Layout

```
cabanas-mvp/                          # Repo root (monorepo-like workspace)
├── apps/
│   └── refugios-mvp/                 # Main application (the only active app)
│       ├── src/                      # Server-side source code
│       │   ├── app.js                # Express app factory
│       │   ├── server.js             # HTTP server entry point
│       │   ├── db/
│       │   │   └── client.js         # pg Pool + query() wrapper
│       │   ├── middleware/
│       │   │   └── auth.js           # requireAuth, requireRole middlewares
│       │   ├── routes/               # One file per resource domain
│       │   │   ├── auth.js           # POST /login, GET /me
│       │   │   ├── cabins.js         # Cabin CRUD + image management
│       │   │   ├── dashboard.js      # Analytics and summary endpoints
│       │   │   ├── documents.js      # Boletas/facturas CRUD
│       │   │   ├── expenses.js       # Expense CRUD
│       │   │   ├── exports.js        # CSV export endpoints
│       │   │   ├── guests.js         # Guest CRUD
│       │   │   ├── reservations.js   # Reservation CRUD + lead stage machine
│       │   │   ├── sales.js          # Sales CRUD
│       │   │   └── users.js          # User listing
│       │   └── utils/
│       │       └── trelloBridge.js   # Optional Trello integration (fire-and-forget)
│       ├── public/                   # Static frontend (served by Express)
│       │   ├── index.html            # Single HTML shell
│       │   ├── main.js               # Vanilla JS SPA (~111KB)
│       │   └── styles.css            # Application styles
│       ├── db/
│       │   ├── migrations/           # Numbered SQL migration files (001–019)
│       │   └── staging/              # Staging data imports (CSV/JSON/MD)
│       ├── scripts/                  # DB management and data import scripts (.mjs)
│       │   ├── migrate.mjs           # Migration runner
│       │   ├── seed.mjs              # Demo data seeder
│       │   ├── import-historical.mjs # Historical data import
│       │   ├── import-pdf-excel.mjs  # PDF/Excel import
│       │   ├── sync-pdfs.mjs         # PDF sync utility
│       │   ├── extract-ventas-staging.mjs
│       │   ├── dedupe-seed.mjs
│       │   └── check-db.mjs          # DB diagnostics
│       ├── api/
│       │   └── index.js              # Vercel serverless adapter (exports app)
│       ├── docs/                     # Project documentation
│       │   ├── SRS_IEEE830.md        # Requirements specification
│       │   ├── MANUAL_USUARIO.md     # User manual
│       │   └── ANALISIS_MIGRACION_DJANGO.md
│       ├── Dockerfile                # Production Docker image
│       ├── Dockerfile.dev            # Development Docker image
│       ├── docker-compose.yml        # Production compose
│       ├── docker-compose.dev.yml    # Development compose (hot-reload + local DB)
│       ├── docker-compose.tunnel.yml # Cloudflare tunnel compose
│       ├── Makefile                  # Dev task runner
│       ├── render.yaml               # Render.com deploy config
│       ├── vercel.json               # Vercel routing config
│       ├── package.json              # Node.js manifest (ESM, Node >=20)
│       └── .env.example              # Required environment variables template
├── assets/                           # Raw client assets (original files)
├── docs/                             # Repo-level documentation
├── templates/
│   └── express-api/                  # Boilerplate template for new Express apps
├── tools/                            # DevOps shell scripts
│   ├── check-render-deploy.sh
│   ├── deploy-and-wait-render.sh
│   ├── push-and-wait-render.sh
│   ├── notify-whatsapp.sh
│   └── create-boilerplate.mjs
├── trello-agent-integration/         # Standalone Trello bridge service
│   └── src/trello/
│       └── client.js
├── Dockerfile                        # Repo-root Dockerfile (points to refugios-mvp)
├── package.json                      # Root workspace package (minimal)
├── AGENTS.md                         # Claude/AI agent instructions
└── README.md                         # Project README
```

## Directory Purposes

**`apps/refugios-mvp/src/`:**
- Purpose: All server-side application code
- Contains: Express app, route handlers, middleware, DB client, utilities
- Key files: `server.js` (entry), `app.js` (factory), `src/db/client.js` (DB access)

**`apps/refugios-mvp/src/routes/`:**
- Purpose: One Express Router per business domain
- Contains: Route definitions, input validation, SQL queries, response formatting
- Key files: `reservations.js` (most complex, ~424 lines), `cabins.js`, `dashboard.js`, `exports.js`

**`apps/refugios-mvp/public/`:**
- Purpose: Frontend SPA served statically by Express
- Contains: Single HTML entry, bundled Vanilla JS app, CSS
- Key files: `main.js` (~111KB, all frontend logic), `index.html`, `styles.css`
- Note: No build step — files edited and committed directly

**`apps/refugios-mvp/db/migrations/`:**
- Purpose: Ordered SQL files for schema evolution
- Contains: DDL and seed statements, numbered `001` through `019`
- Key files: `001_init.sql` (base schema), subsequent files for incremental changes
- Note: Applied by `scripts/migrate.mjs`, tracked in `schema_migrations` table

**`apps/refugios-mvp/db/staging/`:**
- Purpose: Normalized source data used during initial data import
- Contains: CSV, JSON, summary MD files from client-provided spreadsheets
- Not executed automatically — consumed by import scripts

**`apps/refugios-mvp/scripts/`:**
- Purpose: CLI scripts for database lifecycle management
- Contains: Migration runner, seeders, data importers, diagnostics
- Key files: `migrate.mjs` (run on every deploy), `seed.mjs` (demo data)

**`apps/refugios-mvp/api/`:**
- Purpose: Vercel serverless function adapter
- Contains: `index.js` — re-exports Express `app` for Vercel
- Note: Only relevant if deploying to Vercel (primary deploy target is Render)

**`tools/`:**
- Purpose: DevOps helper scripts (not part of app runtime)
- Contains: Deploy monitoring, WhatsApp notifications, Render deploy wait scripts
- Note: Run manually from developer machine

**`trello-agent-integration/`:**
- Purpose: Standalone service that receives webhook POSTs and creates Trello cards
- Contains: `src/trello/client.js`
- Note: Optional; the app calls it via `TRELLO_BRIDGE_BASE_URL` env var

**`templates/express-api/`:**
- Purpose: Starter boilerplate for creating new Express API projects
- Contains: Minimal app, db, branding, and Vercel/Render config stubs
- Not part of the running application

## Key File Locations

**Entry Points:**
- `apps/refugios-mvp/src/server.js`: Production HTTP server start
- `apps/refugios-mvp/api/index.js`: Vercel serverless adapter

**Configuration:**
- `apps/refugios-mvp/.env.example`: All required environment variables
- `apps/refugios-mvp/render.yaml`: Render.com build/start/health config
- `apps/refugios-mvp/vercel.json`: Vercel routing
- `apps/refugios-mvp/package.json`: Scripts, dependencies, Node version

**Core Logic:**
- `apps/refugios-mvp/src/app.js`: Middleware registration, route mounting, error handler
- `apps/refugios-mvp/src/db/client.js`: Single query interface for all DB access
- `apps/refugios-mvp/src/middleware/auth.js`: JWT verification and role enforcement
- `apps/refugios-mvp/src/routes/reservations.js`: Most complex domain (CRM funnel, availability checks)

**Database:**
- `apps/refugios-mvp/db/migrations/001_init.sql`: Base schema (all 6 core tables)
- `apps/refugios-mvp/scripts/migrate.mjs`: Migration runner

**Frontend:**
- `apps/refugios-mvp/public/main.js`: Entire frontend application logic
- `apps/refugios-mvp/public/index.html`: SPA shell
- `apps/refugios-mvp/public/styles.css`: Application styles

**Testing:**
- No test files found in `apps/refugios-mvp/` — `package.json` defines `"test": "node --test tests/*.test.mjs"` but `tests/` directory does not exist

## Naming Conventions

**Files:**
- Route files: `[resource].js` (lowercase, singular noun) — e.g., `reservations.js`, `guests.js`
- Script files: `[verb]-[noun].mjs` — e.g., `import-historical.mjs`, `check-db.mjs`
- Migration files: `[NNN]_[description].sql` (zero-padded 3-digit prefix) — e.g., `001_init.sql`, `019_clean_non_asset_expenses_for_client_2026.sql`
- Config files: standard names (`Dockerfile`, `Makefile`, `render.yaml`, `vercel.json`)

**Directories:**
- Source: `src/` for runtime code
- Static: `public/` for frontend assets
- Database: `db/` for migrations and staging data
- Scripts: `scripts/` for CLI tooling

**JavaScript:**
- ESM modules throughout (`"type": "module"` in `package.json`)
- `.js` extension for app source, `.mjs` extension for scripts
- Named exports for functions (`export function requireAuth`), default exports for routers (`export default router`)

## Where to Add New Code

**New API resource/domain:**
- Route handler: `apps/refugios-mvp/src/routes/[resource].js`
- Mount in: `apps/refugios-mvp/src/app.js` — add `import` and `app.use("/api/[resource]", ...Router)`
- Schema: create new migration at `apps/refugios-mvp/db/migrations/[NNN]_[description].sql`

**New middleware:**
- Implementation: `apps/refugios-mvp/src/middleware/[name].js`
- Apply in: `apps/refugios-mvp/src/app.js`

**New utility/integration:**
- Implementation: `apps/refugios-mvp/src/utils/[name].js`
- Import in relevant route handler

**New export format:**
- Add route to: `apps/refugios-mvp/src/routes/exports.js`

**New database migration:**
- Create: `apps/refugios-mvp/db/migrations/[NNN]_[description].sql`
- Naming: increment the prefix number; use descriptive snake_case name
- Applied automatically on next `npm run db:migrate`

**New CLI/data script:**
- Create: `apps/refugios-mvp/scripts/[verb]-[noun].mjs`
- Register in `package.json` scripts if frequently used

**Frontend changes:**
- Edit: `apps/refugios-mvp/public/main.js` (all frontend logic is in this file)
- Styles: `apps/refugios-mvp/public/styles.css`

## Special Directories

**`apps/refugios-mvp/db/staging/`:**
- Purpose: Normalized CSV/JSON from client-provided data, used for historical imports
- Generated: No (manually curated)
- Committed: Yes

**`apps/refugios-mvp/node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (`npm install`)
- Committed: No (in `.gitignore`)

**`.planning/`:**
- Purpose: GSD planning documents (codebase maps, phases, tasks)
- Generated: By GSD tooling
- Committed: Yes

---

*Structure analysis: 2026-03-16*
