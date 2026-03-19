# Phase 2 — Plan 02-03 Summary (Wave 2)

**Date:** 2026-03-16  
**Result:** Completed

## What changed
- Backend:
  - `apps/refugios-mvp/src/routes/reservations.js` now persists `nightly_rate`, `nights`, `cleaning_supplement`, `season_type`, `reservation_document_type` on POST.
  - Added `PATCH /api/reservations/:id` for full reservation edits (includes Phase 1 + Phase 2 fields).
- Tests:
  - `apps/refugios-mvp/tests/reservations.test.mjs` now runs real integration tests using `supertest`.

## How to verify
- Ensure DB up + migrated, then run:
  - `cd apps/refugios-mvp && DATABASE_URL='postgresql://refugios:refugios_dev@localhost:5433/refugios' npm test`

