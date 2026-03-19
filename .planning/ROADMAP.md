# Roadmap: Refugios AvA

**Project:** Refugios AvA — Plataforma de Administración
**Client:** German (AvA)
**Deploy:** https://refugios.onrender.com
**Milestone:** v0.10 → v1.0 (Excel replacement complete)
**Created:** 2026-03-16
**Granularity:** Standard (5-8 phases)

---

## Phases

- [ ] **Phase 1: Release — Tarifa y Noches** - Commit and release uncommitted rate/nights changes already in codebase
- [x] **Phase 2: Campos de Reserva** - Extend reservations with limpieza, fuente, temporada, and documento fields
- [ ] **Phase 3: Migración Histórica** - Import 2025 and 2026 historical data from PDFs into the database
- [ ] **Phase 4: Dashboard Completo** - Monthly metrics, occupancy calendar, and reservation history with filters
- [ ] **Phase 5: Utilidad Neta** - Net profit metric per month (pending formula validation with German)

---

## Phase Details

### Phase 1: Release — Tarifa y Noches
**Goal**: The uncommitted tarifa-per-night and manual-nights-override changes are live in production
**Depends on**: Nothing (brownfield — existing app already deployed)
**Requirements**: RES-01, RES-02
**Success Criteria** (what must be TRUE):
  1. Owner can enter a per-night rate when creating or editing a reservation; the field is visible in the form with $0 as default
  2. Owner can manually override the number of nights on a reservation, independent of the check-in/check-out date range
  3. Both fields are saved to the database and visible when reopening a reservation
  4. The commit is merged and deployed to https://refugios.onrender.com without breaking existing reservations
**Plans**: TBD

---

### Phase 2: Campos de Reserva
**Goal**: Reservations capture the four commercial fields the owner currently tracks in the Excel VENTAS sheet
**Depends on**: Phase 1 (reservation schema is clean and deployed)
**Requirements**: RES-03, RES-04, RES-05, RES-06
**Success Criteria** (what must be TRUE):
  1. Owner can enter a limpieza supplement amount (CLP) per reservation; it appears in reservation detail and is separate from the nightly rate
  2. Owner can select the booking source (booking.com / airbnb / web / directo / otro) on a reservation
  3. Owner can classify a reservation by season type (Alta / Baja / Temporada / Permanente)
  4. Owner can select the document type issued for a reservation (boleta / factura / booking / ninguno)
  5. All four fields are persisted in the database and visible when viewing or editing a reservation
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md — Wave 0: test scaffolding (supertest, mock db helper, test stubs)
- [x] 02-02-PLAN.md — Wave 1: PostgreSQL migration 020 (Phase 1 persistence + Phase 2 columns + source constraint + backfill)
- [x] 02-03-PLAN.md — Wave 2: backend route update (extend POST INSERT, add PATCH /:id, green tests)
- [x] 02-04-PLAN.md — Wave 3: frontend form fields + label maps + chip rendering + human verification

---

### Phase 3: Migración Historica
**Goal**: All 2025 and 2026 historical reservation and financial data from the PDFs is in the database and verifiable by the owner
**Depends on**: Phase 2 (reservation schema includes limpieza, fuente, temporada, documento — needed for MIG-02 import)
**Requirements**: MIG-01, MIG-02
**Success Criteria** (what must be TRUE):
  1. All reservations from RESERVAS 2025.pdf and RESERVAS 2026.pdf appear in the reservation list with correct cabin, guest name, pax, and dates
  2. Financial details from Ventas AvA 2026.pdf (precio/noche, noches, total estadia, suplemento limpieza, fuente, tipo documento) are linked to the matching 2026 reservations
  3. The owner can open any migrated reservation and see its data without errors
  4. No existing production reservations (created through the app) are duplicated or modified by the import scripts
**Plans**: TBD

---

### Phase 4: Dashboard Completo
**Goal**: The owner has full operational visibility — monthly metrics, a visual occupancy calendar, and a searchable reservation history — without opening any Excel file
**Depends on**: Phase 3 (historical data is in the database, making metrics meaningful)
**Requirements**: DASH-01, DASH-02, DASH-03
**Success Criteria** (what must be TRUE):
  1. Owner can see monthly metrics: total ingresos, noches vendidas split by Casa AvA vs Refugios, and occupancy rate (global and per unit) for any selected month
  2. Owner can view a monthly occupancy calendar showing which unit is occupied on each day, with the guest name and number of pax visible per cell
  3. Owner can navigate between months in the calendar without a full page reload
  4. Owner can view the complete history of past reservations filtered by date range and by unit (cabin)
  5. Migrated historical data (2025-2026) appears in all three views — metrics, calendar, and history
**Plans**: TBD

---

### Phase 5: Utilidad Neta
**Goal**: The owner can see net profit per month on the dashboard once the formula is agreed upon with German
**Depends on**: Phase 4 (dashboard is complete; this adds one metric to it)
**Requirements**: DASH-04
**Success Criteria** (what must be TRUE):
  1. Owner can see utilidad neta per month on the dashboard (ingresos cobrados minus platform discounts/commissions)
  2. The formula used matches what German confirmed — the calculation logic is documented in code comments
  3. Months with no commission/discount data show ingresos as the utilidad (zero-discount default), not a blank or error
**Plans**: TBD

**FLAG**: DASH-04 requires formula validation with German before implementation begins. The formula from the Excel (TOTAL vs UTILIDAD columns) may reflect Booking.com commissions, fixed costs, or both. Do NOT start Phase 5 plans until the formula is confirmed in writing.

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Release — Tarifa y Noches | 0/? | Not started | - |
| 2. Campos de Reserva | 4/4 | Completed | 2026-03-16 |
| 3. Migracion Historica | 0/? | Not started | - |
| 4. Dashboard Completo | 0/? | Not started | - |
| 5. Utilidad Neta | 0/? | Not started | - |

---

## Coverage

| Requirement | Phase | Notes |
|-------------|-------|-------|
| RES-01 | Phase 1 | Uncommitted — commit and deploy |
| RES-02 | Phase 1 | Uncommitted — commit and deploy |
| RES-03 | Phase 2 | New DB column + form field — Plan 02-02 (migration) + 02-03 (route) + 02-04 (UI) |
| RES-04 | Phase 2 | Source constraint replacement + backfill — Plan 02-02 + 02-03 + 02-04 |
| RES-05 | Phase 2 | New DB column + form field — Plan 02-02 + 02-03 + 02-04 |
| RES-06 | Phase 2 | New DB column + form field — Plan 02-02 + 02-03 + 02-04 |
| MIG-01 | Phase 3 | Adapt and run import-pdf-excel.mjs for RESERVAS PDFs |
| MIG-02 | Phase 3 | Adapt and run import for Ventas PDF; depends on Phase 2 schema |
| DASH-01 | Phase 4 | Monthly metrics with Casa AvA vs Refugios split |
| DASH-02 | Phase 4 | Visual occupancy calendar |
| DASH-03 | Phase 4 | Reservation history with filters |
| DASH-04 | Phase 5 | Blocked until formula confirmed with German |

**Coverage:** 12/12 requirements mapped (100%) ✓

---

*Roadmap created: 2026-03-16*
*Last updated: 2026-03-17 — UI v0.9.6 deployed; RESERVAS 2026 reconciled; pending decisions documented*
