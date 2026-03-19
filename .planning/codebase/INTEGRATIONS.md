# External Integrations

**Analysis Date:** 2026-03-16

## APIs & External Services

**Trello (via trello-agent-integration sidecar):**
- Trello REST API v1 - Creates cards, moves cards, adds comments for new reservations
  - SDK/Client: Native `fetch` (no SDK), `https://api.trello.com/1`
  - Implementation: `trello-agent-integration/src/trello/client.js`
  - Auth: `TRELLO_API_KEY` + `TRELLO_TOKEN` env vars (appended to every request as query params)
  - Integration is optional — disabled by default (`TRELLO_BRIDGE_ENABLED=false`)
  - The main app calls the bridge at `TRELLO_BRIDGE_BASE_URL/v1/cards` via HTTP POST; does not call Trello directly
  - Bridge sidecar (`trello-agent-integration/`) runs as a separate Express process on port 3400
  - Bridge env vars: `TRELLO_API_KEY`, `TRELLO_TOKEN`, `TRELLO_DEFAULT_LIST_ID`

**Cloudflare Tunnel:**
- `cloudflared` CLI - Exposes local port 3000 to a public HTTPS URL (TryCloudflare, no account required)
- Used for client demos; not a persistent integration
- `GET /api/public-url` endpoint detects tunnel URL via `x-forwarded-host` header

## Data Storage

**Databases:**
- PostgreSQL 16
  - Connection: `DATABASE_URL` env var (connection string)
  - Client: `pg` Pool with raw parameterized queries — no ORM
  - SSL: auto-detected from `sslmode=require` in the connection string
  - Implementation: `apps/refugios-mvp/src/db/client.js`
  - Local dev: Docker/Podman Compose exposes Postgres on port 5433 (container port 5432)
  - Production: Neon or Render managed Postgres (URL with SSL)

**File Storage:**
- Local filesystem only — PDF and Excel files are read from a local `data/` directory during import scripts; no cloud file storage

**Caching:**
- None

## Authentication & Identity

**Auth Provider:**
- Custom (no third-party auth provider)
  - Implementation: email + bcryptjs password hash stored in `app_users` table
  - Session: stateless JWT (HS256) issued at `POST /api/auth/login`
  - Token payload: `{ sub, email, role, name }`
  - Token verified on every protected route via `apps/refugios-mvp/src/middleware/auth.js`
  - Role-based access control: roles `admin`, `operator`, `viewer` enforced per route via `requireRole()` middleware
  - Auth routes: `apps/refugios-mvp/src/routes/auth.js`

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, Datadog, etc.)

**Logs:**
- `console.error` for errors, `console.log` for migration status
- No structured logging library

**Health Checks:**
- `GET /health` — service liveness (used by Render and Docker Compose)
- `GET /api/health/db` — database connectivity and migration status (public, no JWT required)

## CI/CD & Deployment

**Hosting:**
- Render.com — primary deployment (`apps/refugios-mvp/render.yaml`)
  - Runtime: Node 20
  - Plan: starter
  - Build: `npm install && npm run db:migrate`
  - Start: `npm run start`
  - Health check path: `/health`
  - URL: refugios.onrender.com
- Vercel — alternative serverless adapter present (`apps/refugios-mvp/api/index.js`, `apps/refugios-mvp/vercel.json`)

**CI Pipeline:**
- None detected (no GitHub Actions, CircleCI, etc.)

## Environment Configuration

**Required env vars for production:**
- `DATABASE_URL` - PostgreSQL connection string with SSL
- `JWT_SECRET` - Must override default `dev-secret-change-me`
- `PORT` - (Render sets automatically)

**Optional env vars:**
- `JWT_EXPIRES_IN` - Token TTL (default `12h`)
- `TOTAL_CABINS` - Cabin capacity for occupancy validation (default `6`)
- `TRELLO_BRIDGE_ENABLED` - `1` | `true` | `yes` to activate Trello sync
- `TRELLO_BRIDGE_BASE_URL` - URL of trello-agent-integration sidecar
- `TRELLO_BRIDGE_CREATE_CARD_PATH` - Path override (default `/v1/cards`)
- `TRELLO_BRIDGE_DEFAULT_LIST_ID` - Trello list ID for new reservation cards

**Trello bridge (trello-agent-integration/) required env vars:**
- `TRELLO_API_KEY`
- `TRELLO_TOKEN`
- `TRELLO_DEFAULT_LIST_ID`

**Secrets location:**
- `.env` file (gitignored) for local development
- Infisical self-hosted (localhost:8180) for production secrets per project workspace conventions

## Webhooks & Callbacks

**Incoming:**
- None — the app does not expose any webhook receiver endpoint

**Outgoing:**
- Trello bridge: main app POSTs to `TRELLO_BRIDGE_BASE_URL/v1/cards` when a reservation is created (fire-and-forget, errors logged but not propagated to client)
  - Implementation: `apps/refugios-mvp/src/utils/trelloBridge.js`
  - Timeout: 5 seconds via `AbortController`

## Data Import (Offline Integration)

**PDF/Excel import scripts** — not a live integration but worth noting as a data pipeline:
- `apps/refugios-mvp/scripts/sync-pdfs.mjs` - scans a local `data/` folder and dispatches each file to `import-pdf-excel.mjs`
- `apps/refugios-mvp/scripts/import-pdf-excel.mjs` - parses PDF (via `pdf-parse`) and Excel (via `xlsx`) to seed historical sales, reservations, and expenses
- Used for one-time or periodic batch migration of client records from spreadsheets/printed documents

---

*Integration audit: 2026-03-16*
