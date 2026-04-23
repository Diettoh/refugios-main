---
phase: "05"
plan: "01"
subsystem: reservations/billing
tags: [bug-fix, debt-status, migration, abonos]
dependency_graph:
  requires: []
  provides: [correct-debt-status-for-zero-total, clean-migration-abonos-2026]
  affects: [GET /api/reservations, reservations list UI, abono tracking]
tech_stack:
  added: []
  patterns: [SQL CASE guard, numbered SQL migration]
key_files:
  created:
    - apps/refugios-mvp/db/migrations/038_cleanup_wrong_migration_abonos.sql
  modified:
    - apps/refugios-mvp/src/routes/reservations.js
decisions:
  - "Add AND r.total_amount > 0 guard to paid branch — a reservation with 0 total and 0 paid must not be 'paid'"
  - "Migration 038 uses safety guards (category + description LIKE) so it is a safe no-op if IDs are already gone"
metrics:
  duration: "40s"
  completed: "2026-04-23"
  tasks_completed: 2
  files_modified: 2
---

# Phase 05 Plan 01: Fix Debt Status and Remove Wrong Migration Abonos Summary

Fixed two backend bugs in the abonos/debt tracking system: added `AND r.total_amount > 0` guard to both `debt_status` CASE expressions in reservations.js, and created migration 038 to delete 3 incorrect migration abonos from 2026 reservations.

## What Was Built

### Task 1 — Fixed debt_status CASE expression for total_amount = 0

**File:** `apps/refugios-mvp/src/routes/reservations.js`

Both places where `debt_status` is computed now include the `AND r.total_amount > 0` guard on the `'paid'` branch:

```sql
CASE
  WHEN COALESCE(sales_totals.paid_amount, 0) >= r.total_amount AND r.total_amount > 0 THEN 'paid'
  WHEN COALESCE(sales_totals.paid_amount, 0) > 0 THEN 'partial'
  ELSE 'pending'
END
```

Place 1 (line 222): filter WHERE clause used when `?debt_status=` query param is sent.
Place 2 (line 241): SELECT column in `runQuery` used for all GET /api/reservations responses.

Grep confirmation (exactly 2 occurrences):
```
222:           WHEN COALESCE(sales_totals.paid_amount, 0) >= r.total_amount AND r.total_amount > 0 THEN 'paid'
241:             WHEN COALESCE(sales_totals.paid_amount, 0) >= r.total_amount AND r.total_amount > 0 THEN 'paid'
```

**Commit:** `ebba8a9`

### Task 2 — Migration 038 to delete incorrect migration abonos

**File:** `apps/refugios-mvp/db/migrations/038_cleanup_wrong_migration_abonos.sql`

Targets exactly 3 sale IDs accidentally created by the "Migrar pago" button on future 2026 reservations:

- ID 1970 — reservation #2191, Eric Bartel
- ID 2025 — reservation #2196, Ana Paula Vera
- ID 2037 — reservation #2197, Eric Schlor

DELETE includes category and description safety guards — idempotent if records are already gone.
Migration mode: `data` — runs exactly once via migrate.mjs.

**Commit:** `b3687ed`

## Verification

- `grep -c "AND r.total_amount > 0" apps/refugios-mvp/src/routes/reservations.js` returns **2** ✓
- Migration 038 file exists with DELETE targeting ids 1970, 2025, 2037 and safety guards ✓
- No other logic changed in reservations.js beyond the two CASE expressions ✓

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `apps/refugios-mvp/src/routes/reservations.js` — modified (2 CASE expressions fixed)
- `apps/refugios-mvp/db/migrations/038_cleanup_wrong_migration_abonos.sql` — created (14 lines)
- Commits `ebba8a9` and `b3687ed` confirmed in git log
