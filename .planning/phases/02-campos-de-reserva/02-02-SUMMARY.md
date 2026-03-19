# Phase 2 — Plan 02-02 Summary (Wave 1)

**Date:** 2026-03-16  
**Result:** Completed

## What changed
- Added migration `apps/refugios-mvp/db/migrations/020_reservation_commercial_fields.sql`:
  - Adds reservation columns: `nightly_rate`, `nights`, `cleaning_supplement`, `season_type`, `reservation_document_type`.
  - Replaces `reservations.source` CHECK to allow `booking/airbnb/web/direct/other`.
  - Backfills legacy `phone/walkin` → `direct`.

## How to verify
- Start local DB: `cd apps/refugios-mvp && docker compose -f docker-compose.dev.yml up -d db`
- Apply: `cd apps/refugios-mvp && DATABASE_URL='postgresql://refugios:refugios_dev@localhost:5433/refugios' npm run db:migrate`
- Spot check constraints via SQL (optional): query `pg_constraint` for `reservations_source_new_check`.

