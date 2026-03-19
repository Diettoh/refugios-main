# Technology Stack

**Analysis Date:** 2026-03-16

## Languages

**Primary:**
- JavaScript (ES Modules) - Backend API and frontend UI

**Secondary:**
- SQL - Database migrations in `apps/refugios-mvp/db/migrations/*.sql`

## Runtime

**Environment:**
- Node.js >= 20 (enforced via `engines.node` in `apps/refugios-mvp/package.json`)

**Package Manager:**
- npm
- Lockfile: present (`apps/refugios-mvp/package-lock.json`, lockfileVersion 3)

## Frameworks

**Core:**
- Express 4.22.1 - HTTP server and REST API routing (`apps/refugios-mvp/src/app.js`)

**Build/Dev:**
- Node.js `--watch` flag for hot-reload in development (no external watcher needed)
- Make (`apps/refugios-mvp/Makefile`) - task runner for dev, qa, docker, tunnel targets
- Docker / Docker Compose - containerized deployment (`apps/refugios-mvp/docker-compose.yml`)
- Podman Compose - alternative for dev environment (`apps/refugios-mvp/docker-compose.dev.yml`)
- Cloudflare Tunnel (`cloudflared`) - local-to-internet tunnel for demos

## Key Dependencies

**Critical:**
- `pg` 8.13.1 - PostgreSQL client, used as raw query pool in `apps/refugios-mvp/src/db/client.js`
- `express` 4.22.1 - Web framework
- `jsonwebtoken` 9.0.3 - JWT creation and verification for auth (`apps/refugios-mvp/src/routes/auth.js`, `apps/refugios-mvp/src/middleware/auth.js`)
- `bcryptjs` 3.0.3 - Password hashing on login (`apps/refugios-mvp/src/routes/auth.js`)
- `dotenv` 16.6.1 - Environment variable loading

**Data Processing:**
- `pdf-parse` 2.4.5 - PDF parsing for historical data import scripts (`apps/refugios-mvp/scripts/import-pdf-excel.mjs`, `apps/refugios-mvp/scripts/sync-pdfs.mjs`)
- `xlsx` 0.18.5 - Excel (.xlsx) parsing for expense import scripts

**HTTP:**
- `cors` 2.8.5 - Cross-origin request handling (open CORS, `app.use(cors())` in `apps/refugios-mvp/src/app.js`)

## Configuration

**Environment:**
- Configured via `.env` file (template at `apps/refugios-mvp/.env.example`)
- Key variables required:
  - `PORT` - HTTP port (default: 3000)
  - `DATABASE_URL` - PostgreSQL connection string (required; app fails gracefully without it)
  - `JWT_SECRET` - JWT signing secret (default: `dev-secret-change-me`, must override in production)
  - `JWT_EXPIRES_IN` - Token expiry (default: `12h`)
  - `TOTAL_CABINS` - Capacity limit for occupancy checks (default: 6)
  - `TRELLO_BRIDGE_ENABLED` - Enable Trello bridge webhook (default: disabled)
  - `TRELLO_BRIDGE_BASE_URL` - Base URL of trello-agent-integration service (default: `http://localhost:3400`)
  - `TRELLO_BRIDGE_DEFAULT_LIST_ID` - Default Trello list for new reservation cards

**Build:**
- `apps/refugios-mvp/Dockerfile` - Production image (node:20-alpine, runs migrations on startup)
- `apps/refugios-mvp/Dockerfile.dev` - Development image with hot-reload
- `apps/refugios-mvp/docker-compose.yml` - QA/production Docker Compose (postgres:16-alpine + app)
- `apps/refugios-mvp/docker-compose.dev.yml` - Dev Docker Compose with volume mounts
- `apps/refugios-mvp/docker-compose.tunnel.yml` - Cloudflare tunnel variant
- `apps/refugios-mvp/render.yaml` - Render.com deployment config
- `apps/refugios-mvp/vercel.json` - Vercel serverless adapter (routes all traffic to `api/index.js`)

## Platform Requirements

**Development:**
- Node.js >= 20
- npm
- PostgreSQL 16 (or via Docker/Podman Compose on port 5433)
- Optional: `cloudflared` for tunnel demos

**Production:**
- Render.com (primary, `render.yaml` present, deployed at refugios.onrender.com)
- Vercel (alternative adapter present via `apps/refugios-mvp/api/index.js`)
- PostgreSQL (Neon or Render managed Postgres via `DATABASE_URL` with `sslmode=require`)

## Module System

**Type:** ES Modules (`"type": "module"` in `apps/refugios-mvp/package.json`)
- All source files use `import`/`export` syntax
- Scripts use `.mjs` extension for migration/seeding tools

## Monorepo Structure

**Root package** (`package.json`) is a factory/orchestrator with no runtime dependencies.
**Active app** lives in `apps/refugios-mvp/` with its own `package.json`.
**Trello bridge** lives in `trello-agent-integration/` as a separate Express service (port 3400, own process).

---

*Stack analysis: 2026-03-16*
