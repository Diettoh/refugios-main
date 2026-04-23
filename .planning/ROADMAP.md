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
- [ ] **Phase 3: Dashboard Completo** - Monthly metrics, occupancy calendar, and reservation history with filters
- [ ] **Phase 4: Utilidad Neta** - Net profit metric per month (pending formula validation with German)
- [ ] **Phase 5: Abonos** - Partial payments per reservation with balance tracking and debt status

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

### Phase 3: Dashboard Completo
**Goal**: The owner has full operational visibility — monthly metrics, a visual occupancy calendar, and a searchable reservation history — without opening any Excel file
**Depends on**: Phase 3 (historical data is in the database, making metrics meaningful)
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04
**Success Criteria** (what must be TRUE):
  1. Owner can see monthly metrics: total ingresos, noches vendidas split by Casa AvA vs Refugios, and occupancy rate (global and per unit) for any selected month
  2. Owner can view a monthly occupancy calendar showing which unit is occupied on each day, with the guest name and number of pax visible per cell
  3. Owner can navigate between months in the calendar without a full page reload
  4. Owner can view the complete history of past reservations filtered by date range and by unit (cabin)
  5. Migrated historical data (2025-2026) appears in all three views — metrics, calendar, and history
  6. Owner can select a global period (month/year) from the topbar; all modules (reservations, sales, calendar) immediately reflect that period without needing to re-filter each view individually
**Plans**: TBD

---

### Phase 4: Utilidad Neta
**Goal**: The owner can see net profit per month on the dashboard once the formula is agreed upon with German
**Depends on**: Phase 3 (dashboard is complete; this adds one metric to it)
**Requirements**: DASH-04
**Success Criteria** (what must be TRUE):
  1. Owner can see utilidad neta per month on the dashboard (ingresos cobrados minus platform discounts/commissions)
  2. The formula used matches what German confirmed — the calculation logic is documented in code comments
  3. Months with no commission/discount data show ingresos as the utilidad (zero-discount default), not a blank or error
**Plans**: TBD

**FLAG**: DASH-04 requires formula validation with German before implementation begins. The formula from the Excel (TOTAL vs UTILIDAD columns) may reflect Booking.com commissions, fixed costs, or both. Do NOT start Phase 4 plans until the formula is confirmed in writing.

---

### Phase 5: Abonos
**Goal**: El dueño puede registrar y gestionar pagos parciales por reserva; cada reserva muestra su saldo pendiente y estado de deuda
**Depends on**: Phase 1 (schema limpio en prod)
**Requirements**: PAY-01, PAY-02, PAY-03
**Success Criteria** (what must be TRUE):
  1. Al crear una reserva, se genera automáticamente una venta (`sales.category='lodging'`) vinculada
  2. El dueño puede registrar abonos desde la tarjeta de reserva (monto, fecha)
  3. El saldo pendiente (`total_amount - SUM(abonos)`) se muestra en la reserva
  4. El estado de deuda (`pending` / `partial` / `paid`) se refleja visualmente
  5. El dueño puede eliminar abonos con confirmación
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — Wave 1: backend fix (debt_status SQL) + data cleanup migration 038
- [ ] 05-02-PLAN.md — Wave 2: frontend fix (remove Migrar pago button) + human verification

---

### Phase 6: UX Polish — Ventas y Gastos
**Goal**: Las vistas de Ventas y Gastos muestran el período actual por defecto y tienen filtros claros
**Depends on**: Nothing (frontend-only UX fixes)
**Requirements**: UX-01, UX-02
**Success Criteria** (what must be TRUE):
  1. La vista Ventas abre por defecto en el mes actual (no en el año completo)
  2. La vista Gastos muestra por defecto el mes actual
  3. El admin puede cambiar el período manualmente sin fricción
**Plans**: 1 plan

Plans:
- [ ] 06-01-PLAN.md — Wave 1: Ventas default "month" + Gastos default current month (main.js only)

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Release — Tarifa y Noches | 0/? | Not started | - |
| 2. Campos de Reserva | 4/4 | Completed | 2026-03-16 |
| 3. Dashboard Completo | 0/? | Not started | - |
| 4. Utilidad Neta | 0/? | Blocked (fórmula pendiente) | - |
| 5. Abonos | 1/2 | In progress | - |
| 6. UX Polish — Ventas y Gastos | 0/1 | Planned | - |

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
| DASH-01 | Phase 3 | Monthly metrics with Casa AvA vs Refugios split |
| DASH-02 | Phase 3 | Visual occupancy calendar |
| DASH-03 | Phase 3 | Reservation history with filters |
| DASH-04 | Phase 3 | Global period selector in topbar — affects all views simultaneously |
| DASH-04 | Phase 4 | Blocked until formula confirmed with German |
| PAY-01 | Phase 5 | Auto-sales on reservation create — Plan 05-01 + 05-02 |
| PAY-02 | Phase 5 | Abonos registration from reservation card — Plan 05-01 + 05-02 |
| PAY-03 | Phase 5 | Debt status display — Plan 05-01 + 05-02 |
| UX-01 | Phase 6 | Ventas default period = current month — Plan 06-01 |
| UX-02 | Phase 6 | Gastos default month = current month — Plan 06-01 |

**Coverage:** 13/13 requirements mapped (100%) ✓

---

*Roadmap created: 2026-03-16*
*Last updated: 2026-04-23 — Phase 6 added (UX Polish ventas/gastos)*
