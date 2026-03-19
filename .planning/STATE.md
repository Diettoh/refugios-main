# State: Refugios AvA

**Project:** Refugios AvA — Plataforma de Administración
**Client:** German (AvA)
**Deploy:** https://refugios.onrender.com
**Stack:** Node.js/Express + PostgreSQL + Vanilla JS SPA
**Initialized:** 2026-03-16

---

## Project Reference

**Core Value:** El dueño tiene visibilidad completa de su negocio — ocupación, ingresos y utilidad — desde un solo lugar, sin depender de Excel.

**Milestone Goal:** Replace Excel as sole source of truth — all 2025/2026 historical data migrated, reservation fields complete, dashboard with calendar and metrics live.

---

## Current Position

**Active Phase:** Phase 4 — Dashboard Completo
**Active Plan:** UI alignment to client PDFs
**Status:** In progress (UI v0.9.6 deployed · RESERVAS 2026 reconciled)

**Progress Bar:**
```
Phase 1 [          ] 0%   Release — Tarifa y Noches
Phase 2 [==========] 100% Campos de Reserva
Phase 3 [===       ] 30%  Migracion Historica
Phase 4 [===       ] 30%  Dashboard Completo
Phase 5 [          ] 0%   Utilidad Neta
```

**Overall:** 1/5 phases complete

---

## Accumulated Context

### Latest Verified State (Prod)

- **Deploy URL:** https://refugios.onrender.com
- **UI version:** `v0.9.6`
- **Ventas AvA 2026 (PDF):** reconciled by key (34/34 rows present in prod; no missing/extra keys)
- **RESERVAS 2026 (PDF):** reconciled by day-occupancy (311 entries PDF == 311 entries prod; 0 missing/0 extra)

Notes:
- RESERVAS 2026 import is based on PDF `NOMBRE X#` entries; **cabin_id is unknown in the PDF** and is imported as `NULL` (requires later mapping if needed).
- Ventas AvA 2026 currently mixes `TOTAL` vs `UTILIDAD` semantics across rows; pending client validation to normalize.

### Key Decisions Made

| Decision | Rationale | Date |
|----------|-----------|------|
| No base prices per cabin | Owner wants manual rate entry per reservation; every reservation starts at $0 | Pre-existing |
| Abonos deferred to v2 | Requires workflow clarification with German before model design | 2026-03-16 |
| Utilidad formula must be confirmed before Phase 5 | Excel shows TOTAL vs UTILIDAD delta; unclear if Booking commission, fixed costs, or both | 2026-03-16 |
| Migration via script (not UI) | 2 years of data; manual entry is not viable | Pre-existing |
| Vanilla JS frontend — no bundler | Maintain consistency with existing SPA; avoid massive refactor | Pre-existing |

### Pending Decisions (blockers)

| Decision | Owner | Blocks |
|----------|-------|--------|
| Utilidad neta formula | German (client) | Phase 5 cannot start |
| Abonos workflow (how German tracks partial payments today) | German (client) | v2 milestone |
| Monto oficial en Ventas (TOTAL vs UTILIDAD) | German (client) | Correct monthly totals + Phase 5 semantics |

### Known Blockers

- **Phase 5 is blocked** until German confirms the utilidad neta formula in writing. Do not start Phase 5 plans.
- **Ventas semantics is blocked** until German confirms whether the dashboard/report should reflect TOTAL or UTILIDAD as the canonical amount.

### Tech Debt Acknowledged (from CONCERNS.md)

High-priority items to keep in mind (not in scope for this milestone unless explicitly added):
- Default password `refugios123` in production users (security)
- CORS fully open — no origin restriction
- No rate limiting on `/api/auth/login`
- No general `PATCH /:id` for reservations (only stage and release patches exist)
- Monolithic `public/main.js` (2849 lines) — any UI change requires care

### Architecture Notes

- All new DB columns must go through numbered migrations in `apps/refugios-mvp/db/migrations/`
- Next migration number: 022 (migrations 001-021 applied)
- Import scripts live in `apps/refugios-mvp/scripts/` (staging extractors + migration generators)

---

## Performance Metrics

| Metric | Value | Updated |
|--------|-------|---------|
| Requirements mapped | 12/12 | 2026-03-16 |
| Phases defined | 5 | 2026-03-16 |
| Phases complete | 1/5 | 2026-03-16 |
| Plans created | 4 | 2026-03-16 |
| Plans complete | 4 | 2026-03-16 |

---

## Session Continuity

**Last session:** 2026-03-17 — UI `v0.9.6` deployed; RESERVAS 2026 imported and reconciled; prod cleaned of non-client test data.

**Next action:** Import RESERVAS 2025 + align Ventas amount semantics after client validation (TOTAL vs UTILIDAD). Keep Phase 5 blocked until formula is confirmed in writing.

**Context for next session:**
- Roadmap has 5 phases. Phase 1 is trivially small (commit uncommitted tarifa + noches changes and deploy).
- Phase 5 is blocked on German's confirmation of the utilidad formula — flag this at plan time.
- Migration scripts exist; RESERVAS 2026 is now importable/reconciled; RESERVAS 2025 is pending.
- Cabin IDs in frontend are hardcoded 1-4 — flag when building DASH-02 calendar.

---

*State initialized: 2026-03-16*
*Last updated: 2026-03-17*
