# Codebase Concerns

**Analysis Date:** 2026-03-16

## Tech Debt

**Default password hardcoded in migration:**
- Issue: Migration `010_app_users_password_hash.sql` sets a known default bcrypt hash (`refugios123`) for all users without a password. Any user who was seeded and never changed their password uses this default.
- Files: `apps/refugios-mvp/db/migrations/010_app_users_password_hash.sql`
- Impact: Users with default password are exposed if the seed data reached production without a follow-up password change.
- Fix approach: Force password reset on first login or add a `password_changed` flag, then enforce change before allowing dashboard access.

**CORS is fully open (no origin restrictions):**
- Issue: `app.use(cors())` with no options allows requests from any origin.
- Files: `apps/refugios-mvp/src/app.js` line 21
- Impact: In production on Render, any domain can make authenticated API requests if it has a valid JWT. Not a blocker but a hardening gap.
- Fix approach: Set `cors({ origin: process.env.ALLOWED_ORIGIN || 'https://refugios.onrender.com' })` and add env var to Render.

**Occupancy check uses env var instead of DB-driven cabin count:**
- Issue: `TOTAL_CABINS` env var (default 6) drives the cabin availability check in `POST /api/reservations`. The actual number of active cabins in the `cabins` table is not used.
- Files: `apps/refugios-mvp/src/routes/reservations.js` lines 6-12, 195-216
- Impact: If cabins are added or removed via the CRUD API, the availability logic becomes inaccurate unless the env var is manually updated in Render.
- Fix approach: Replace `parseTotalCabins()` with a `SELECT COUNT(*) FROM cabins` query at reservation creation time.

**`/api/users` endpoint has no role restriction:**
- Issue: `GET /api/users` returns full user list (id, name, email, role) to any authenticated user, including `viewer` role.
- Files: `apps/refugios-mvp/src/routes/users.js`
- Impact: `viewer` users can enumerate all system users and their roles. No write operations are exposed, but enumeration is a low-severity information leak.
- Fix approach: Add `requireRole('admin')` middleware before the route handler.

**Monolithic frontend (2849-line single JS file):**
- Issue: All frontend logic (auth, modals, forms, charts, dashboard, exports, cabins) is in a single `public/main.js`.
- Files: `apps/refugios-mvp/public/main.js`
- Impact: Any change to any feature requires understanding the full file. No module boundaries. Adding new sections risks global variable collisions.
- Fix approach: Long-term, split into ES modules by section. Short-term, use clear function naming zones and avoid global `state` mutations across sections.

**`reservations.js` PATCH `/release` overwrites `check_out` to `CURRENT_DATE`:**
- Issue: The release endpoint sets `check_out = CURRENT_DATE` unconditionally. If a guest checks out earlier than the original booking, the original `total_amount` remains unchanged (the reservation was already billed at creation time for the full stay).
- Files: `apps/refugios-mvp/src/routes/reservations.js` lines 378-405
- Impact: Financial discrepancy between `total_amount` on the reservation and actual nights stayed when early checkout occurs.
- Fix approach: Recalculate `total_amount` on release based on actual nights, or flag it for manual review.

**`xlsx` package included but appears unused in production routes:**
- Issue: `xlsx` is listed as a runtime dependency in `package.json` but is only referenced in import scripts (`scripts/import-pdf-excel.mjs`), not in any API route. It is a large package (~1MB).
- Files: `apps/refugios-mvp/package.json`
- Impact: Unnecessary payload on production deploys (Render install).
- Fix approach: Move `xlsx` and `pdf-parse` to `devDependencies` or a separate `scripts/package.json`.

## Known Bugs

**`/api/cabins/images` returns stale `size_category`/`max_guests`/`amenities` fields:**
- Symptoms: The `GET /api/cabins/images` route maps these fields in the initial `byCabin` set assignment but reads them from `row.size_category`, which is `undefined` because the query only selects `c.id, c.name, c.sort_order, c.short_code, c.color_hex, c.icon`.
- Files: `apps/refugios-mvp/src/routes/cabins.js` lines 44-82
- Trigger: Calling `GET /api/cabins/images`, the returned cabin objects include `size_category: undefined`, `max_guests: undefined`, `amenities: undefined`.
- Workaround: Frontend uses the `GET /api/cabins` endpoint (which fetches all fields) to populate `state.cabinImages`. The `/images` compat endpoint is only used for availability views.

**Auto-created sales record is silently swallowed on failure:**
- Symptoms: When a reservation is created, the auto-inserted `sales` record failure is caught and only logged with `console.error`. The reservation is returned as 201 Created even if the associated sale was not created.
- Files: `apps/refugios-mvp/src/routes/reservations.js` lines 311-326
- Trigger: Any DB constraint violation (e.g., unexpected `payment_method` value) on the `sales` insert.
- Workaround: Manual sale entry through the sales form. The reservation itself exists correctly.

## Security Considerations

**JWT secret fallback to `dev-secret-change-me`:**
- Risk: If `JWT_SECRET` env var is missing in any environment, the application falls back to a known string. Tokens signed with the dev secret would be valid if the secret leaks or is guessed.
- Files: `apps/refugios-mvp/src/middleware/auth.js` line 3, `apps/refugios-mvp/src/routes/auth.js` line 8
- Current mitigation: Render env vars require explicit `JWT_SECRET`. Local `.env.example` does not document it.
- Recommendations: Add `JWT_SECRET` to `.env.example` with a placeholder. Add a startup check that exits if `JWT_SECRET === "dev-secret-change-me"` in production (`NODE_ENV=production`).

**SSL cert verification disabled for DB connections:**
- Risk: `ssl: { rejectUnauthorized: false }` disables certificate chain validation. Man-in-the-middle attacks on the DB connection are theoretically possible.
- Files: `apps/refugios-mvp/src/db/client.js` line 10, `apps/refugios-mvp/scripts/migrate.mjs` line 16, `apps/refugios-mvp/scripts/dedupe-seed.mjs` line 24, `apps/refugios-mvp/scripts/check-db.mjs` line 22
- Current mitigation: Neon PostgreSQL connections are over TLS; the risk is low in practice. This is a common pattern with Neon's self-signed certs.
- Recommendations: Accept as acceptable for MVP. Document in README. Revisit if upgrading to dedicated DB tier.

**No rate limiting on login endpoint:**
- Risk: `POST /api/auth/login` is public (bypasses JWT middleware) and has no rate limiting. Brute-force attacks on user accounts are possible.
- Files: `apps/refugios-mvp/src/routes/auth.js`, `apps/refugios-mvp/src/app.js`
- Current mitigation: None at application level. Render may provide basic DDoS protection.
- Recommendations: Add `express-rate-limit` targeting `/api/auth/login` with a limit of ~10 requests per minute per IP.

**Client PII (personal names, phone, document IDs) in DB staging files committed to repo:**
- Risk: `apps/refugios-mvp/db/migrations/006_demo_to_production.sql` contains real client guest names sourced from the client's booking history. `db/staging/ventas_ava_2026.normalized.csv` and `.json` contain detailed financial data per reservation.
- Files: `apps/refugios-mvp/db/migrations/006_demo_to_production.sql`, `apps/refugios-mvp/db/staging/ventas_ava_2026.normalized.csv`, `apps/refugios-mvp/db/staging/ventas_ava_2026.normalized.json`
- Current mitigation: Repo is private (`private: true` in package.json; confirmed cvti projects are always private).
- Recommendations: If repo ever becomes public or is shared with contractors, scrub real names from migration files and staging CSVs. Consider anonymizing before storage.

## Performance Bottlenecks

**`GET /api/guests` runs a full table scan with two lateral subqueries:**
- Problem: Every call loads all guests with their latest reservation and a SUM aggregation per reservation. No pagination is applied.
- Files: `apps/refugios-mvp/src/routes/guests.js` lines 13-52
- Cause: No `LIMIT`/`OFFSET` in the query. As the guest list grows (hundreds of guests), response time will increase.
- Improvement path: Add server-side pagination (page/pageSize params). Index `reservations(guest_id, check_in DESC)` would help the lateral subquery.

**`GET /api/dashboard/analytics` fires 6 parallel DB queries on every page load:**
- Problem: Six concurrent queries including one with `generate_series` over the full date range are fired on each analytics load.
- Files: `apps/refugios-mvp/src/routes/dashboard.js` lines 51-108
- Cause: No caching, no query result memoization. Analytics data is recalculated on every request.
- Improvement path: Cache dashboard responses in memory with a 5-minute TTL (`node-cache`). Or move to a materialized view refreshed nightly.

**`GET /api/cabins` loads all base64 image data in every listing:**
- Problem: The cabins listing endpoint fetches `image_data_base64` for all images of all cabins in a single response. For 6 cabins × 10 images × ~5MB base64 each this could reach several MB per response.
- Files: `apps/refugios-mvp/src/routes/cabins.js` lines 9-41
- Cause: Images are stored as base64 TEXT in Postgres. No lazy loading or separate image endpoint.
- Improvement path: Add an optional `?include_images=false` query param (default false for listings). Migrate image storage to an external store (Cloudinary, S3) and store URLs instead of base64.

## Fragile Areas

**Cabin ID inference in frontend dashboard uses hardcoded IDs 1-4:**
- Files: `apps/refugios-mvp/public/main.js` lines 2762-2808
- Why fragile: The `renderCabanasDash` and `inferCabinId` functions hardcode cabin IDs 1-4 and labels "Azul/Roja/Verde/Casa AvA". If cabins are renamed, reordered, or new cabins added via the CRUD interface, the dashboard charts will silently misattribute occupancy and revenue.
- Safe modification: The fix is to drive the chart from `state.cabinImages` dynamically (removing the `&& id <= 4` filters). Test with renamed cabins before any cabin CRUD.
- Test coverage: No tests exist for this logic.

**`/api/reservations/release` mutates `check_out` to today's date:**
- Files: `apps/refugios-mvp/src/routes/reservations.js` lines 384-393
- Why fragile: If called accidentally or via a double-click, a confirmed future reservation permanently has its check_out date set to today. There is no confirmation step and no undo endpoint.
- Safe modification: Add a frontend confirmation dialog before calling this endpoint. Consider adding an `original_check_out` field to allow reversals.

**Migration runner does not validate SQL file order on re-runs:**
- Files: `apps/refugios-mvp/scripts/migrate.mjs`
- Why fragile: Migrations are sorted alphabetically by filename. If a file is renamed or inserted out of sequence, idempotency is broken (already-applied migrations are skipped correctly, but the sequence assumption is file-name-based). Migration `016_dedupe_sales_seed_2026.sql` through `019_` are data patches, not schema changes, and depend on the exact state left by `014-015`.
- Safe modification: Always add migrations with the next sequential number. Never rename existing migration files.

**Image update is a destructive replace with no transaction protection on partial failure:**
- Files: `apps/refugios-mvp/src/routes/cabins.js` lines 326-345
- Why fragile: `PATCH /api/cabins/:id/images` first deletes all existing images, then inserts each new one with individual `await query()` calls. If the server crashes mid-insert, the cabin is left with no images.
- Safe modification: Wrap the delete + insert loop in a single transaction using `client.query('BEGIN')`.

## Scaling Limits

**Single Postgres connection pool (max default 10):**
- Current capacity: `pg.Pool` with default `max: 10` (not explicitly configured).
- Limit: Under concurrent load, requests queue at the pool level. On Render Starter plan (~512MB RAM), this is acceptable for single-tenant MVP usage.
- Scaling path: Set explicit `max: 5` to avoid overwhelming Neon free tier connection limits. For multi-tenant use, add PgBouncer.

**No horizontal scaling possible in current architecture:**
- Current capacity: Single Render web service instance.
- Limit: Session state is in JWT (stateless), so horizontal scaling is theoretically possible. However, the Trello bridge URL is env-var based and would need to be consistent.
- Scaling path: No blocker for adding Render auto-scaling. The only concern is DB connection count under multiple instances.

## Dependencies at Risk

**`xlsx` package (v0.18.5) is in a maintenance-only state:**
- Risk: The `xlsx` (SheetJS CE) package is in community edition mode since 2022. Known security vulnerabilities in older versions exist. It is pulled as a runtime dependency even though only used in scripts.
- Impact: Production bundle carries the risk. The `npm audit` may flag this package.
- Migration plan: Move to `devDependencies`. For import scripts, evaluate `exceljs` as a maintained alternative.

**`pdf-parse` (v2.4.5) is used only in import scripts, not in API routes:**
- Risk: Same issue as `xlsx` — it is in runtime dependencies but only needed for one-time data import operations.
- Impact: Unnecessary on production.
- Migration plan: Move to `devDependencies` or a separate scripts package.

## Missing Critical Features

**No password management endpoint:**
- Problem: There is no `POST /api/users/:id/change-password` endpoint. Users cannot change their own passwords through the application.
- Blocks: Secure onboarding of new users (they are stuck on the seeded default `refugios123` if `010_app_users_password_hash.sql` ran before passwords were set).

**No update endpoint for existing sales or expenses:**
- Problem: `PATCH` or `PUT` endpoints are missing for `sales` and `expenses`. Only `POST` (create) and `DELETE` exist.
- Files: `apps/refugios-mvp/src/routes/sales.js`, `apps/refugios-mvp/src/routes/expenses.js`
- Blocks: Correcting an amount or category on an existing entry requires delete + recreate, which loses the audit trail.

**No update endpoint for existing reservations (full edit):**
- Problem: Only `PATCH /:id/stage` (lead stage) and `PATCH /:id/release` exist. There is no general `PATCH /:id` to update dates, amounts, guest count, or notes on an existing reservation.
- Files: `apps/refugios-mvp/src/routes/reservations.js`
- Blocks: Correcting a booking error requires delete + recreate, which also deletes associated sales records.

## Test Coverage Gaps

**No test suite exists:**
- What's not tested: All business logic — availability checks, occupancy conflict detection, auto-sale creation on reservation, JWT expiry handling, role-based access, migration runner.
- Files: No `tests/` directory. `package.json` defines `"test": "node --test tests/*.test.mjs"` but the directory does not exist.
- Risk: Regressions in the availability logic (overlapping reservations, cabin conflicts) or auth middleware would reach production undetected.
- Priority: High — especially for `POST /api/reservations` availability checks and `requireAuth` middleware.

---

*Concerns audit: 2026-03-16*
