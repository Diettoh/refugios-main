# Phase 2 — Plan 02-04 Summary (Wave 3)

**Date:** 2026-03-16  
**Result:** Completed (needs human UI check)

## What changed
- UI form fields (reservations):
  - `apps/refugios-mvp/public/index.html` adds `cleaning_supplement`, `season_type`, `reservation_document_type`.
  - Updated channel select options to match Phase 2 catalog (includes `direct` and removes legacy `phone/walkin`).
- UI behavior:
  - `apps/refugios-mvp/public/main.js` sends the new fields on reservation create.
  - Reservation cards render chips for Limpieza / Temporada / Doc when present.
  - `UI_VERSION` bumped to `0.9.2`.
- Docs:
  - `apps/refugios-mvp/README.md` documents `UI v0.9.2`.

## Manual verification checklist
- Open the panel, create a reservation with all 3 new fields and confirm they appear in the reservation list chips.
- Create with Canal=Directo/Web/Airbnb/Booking and confirm it saves.

