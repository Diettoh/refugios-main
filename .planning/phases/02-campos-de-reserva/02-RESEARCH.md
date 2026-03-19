# Phase 2: Campos de Reserva - Research

**Researched:** 2026-03-16
**Domain:** PostgreSQL schema migration + Express route extension + Vanilla JS form fields
**Confidence:** HIGH (all findings verified directly from codebase)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| RES-03 | El dueño puede registrar un suplemento de limpieza por reserva (monto adicional al precio de estadía) | New nullable NUMERIC(12,2) column `cleaning_supplement` on `reservations`; new number input in form; persisted via extended INSERT/PATCH |
| RES-04 | El dueño puede registrar la fuente de una reserva (booking.com / directo / otro) | Existing `source` column has wrong CHECK constraint values; migration must DROP old constraint and ADD new one with `booking` / `direct` / `other`; existing `source` select must be replaced |
| RES-05 | El dueño puede clasificar una reserva por tipo de temporada (Alta / Baja / Temporada / Permanente) | New nullable TEXT column `season_type` with CHECK constraint; new select in form |
| RES-06 | El dueño puede indicar el tipo de documento emitido por una reserva (boleta / factura / booking / ninguno) | New nullable TEXT column `document_type` on `reservations` (NOT to be confused with the `documents` table); new select in form |
</phase_requirements>

---

## Summary

Phase 2 adds four commercial fields to existing reservations: `cleaning_supplement` (NUMERIC), `source` (TEXT enum), `season_type` (TEXT enum), and `reservation_document_type` (TEXT enum). All four are absent from the `reservations` table today — confirmed by scanning all 19 applied migrations (except `source`, which exists but needs its allowed vocabulary updated).

The most important discovery is that `source` is already a column on `reservations` but its CHECK constraint only allows `('web', 'airbnb', 'booking', 'phone', 'walkin', 'other')`. The commercial reference (cotización `COT-2026-CV-AVA-003`) requires explicit channels: Booking, Airbnb, Web propia, Directa, Otros. The migration must replace the constraint to allow `('booking', 'airbnb', 'web', 'direct', 'other')` and backfill legacy values (`phone`, `walkin`) to `direct`.

The `documents` table already has a `document_type` column, but Phase 2 adds a different `document_type` column directly on `reservations` (to capture which document was issued for a booking without requiring a linked document record). This naming collision requires care: the new column on `reservations` must be clearly named and the planner must not confuse it with the existing `documents.document_type`.

There is no general `PATCH /:id` endpoint for reservations. Success Criterion 5 ("visible when viewing or editing a reservation") requires a new endpoint or the planner must limit scope to create-time persistence + read display. Given that the CONCERNS.md already flags this as a missing feature, Phase 2 should add a general `PATCH /api/reservations/:id` as part of the plan — the four new fields need to be editable.

**Primary recommendation:** Use migration 020 with `IF NOT EXISTS` guards for new columns. Rename `source` constraint update via DROP CONSTRAINT + ADD CONSTRAINT. Add `PATCH /api/reservations/:id` for full edit support. Add 4 form fields to `index.html` and extend `bindReservationForm()` in `main.js`.

---

## Standard Stack

### Core (already in place — no new dependencies needed)
| Component | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| PostgreSQL (via `pg`) | 8.13.1 | Column additions + constraint changes | All via migration SQL |
| Express Router | 4.22.1 | New `PATCH /:id` endpoint | Follows existing pattern |
| Vanilla JS | ES2020 | Form fields + display chips | No bundler, direct DOM manipulation |
| Node.js `--test` | built-in (Node >= 20) | Test runner | `tests/*.test.mjs` pattern already defined in package.json |

### No New Dependencies
Phase 2 is pure schema + route + form work. Zero new npm packages required.

---

## Architecture Patterns

### Existing Reservations Table Schema (as of migration 019)

Columns confirmed present on `reservations`:
```
id                SERIAL PRIMARY KEY
guest_id          INT NOT NULL REFERENCES guests(id)
source            TEXT NOT NULL CHECK (source IN ('web','airbnb','booking','phone','walkin','other'))
payment_method    TEXT NOT NULL CHECK (...)
status            TEXT NOT NULL DEFAULT 'confirmed'
lead_stage        TEXT DEFAULT 'lead_new'             -- added migration 004
check_in          DATE NOT NULL
check_out         DATE NOT NULL
check_in_time     TEXT                                -- added migration 004
checkout_time     TEXT                                -- added migration 004
follow_up_at      TIMESTAMPTZ                         -- added migration 004
guests_count      INT NOT NULL DEFAULT 1
total_amount      NUMERIC(12,2) NOT NULL
notes             TEXT
cabin_id          INT REFERENCES cabins(id)           -- added migration 007
created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

**Phase 1 columns NOT YET in DB** (route accepts them but INSERT does not write them):
- `nightly_rate` — not added to reservations table yet (only exists on `cabins`)
- `nights` (manual override) — not persisted anywhere

Phase 2 depends on Phase 1 being deployed first (the INSERT must include Phase 1 columns before Phase 2 columns are added).

### Columns Phase 2 Must Add (migration 020)

```sql
-- RES-03: Cleaning supplement
ALTER TABLE reservations ADD COLUMN cleaning_supplement NUMERIC(12,2);

-- RES-04: Booking source (replaces old source semantics)
-- Step 1: DROP old CHECK constraint
-- Step 2: ADD new CHECK constraint with new vocabulary
-- Step 3: Backfill existing rows

-- RES-05: Season type
ALTER TABLE reservations ADD COLUMN season_type TEXT
  CHECK (season_type IN ('alta', 'baja', 'temporada', 'permanente'));

-- RES-06: Document type on reservation
ALTER TABLE reservations ADD COLUMN reservation_document_type TEXT
  CHECK (reservation_document_type IN ('boleta', 'factura', 'booking', 'ninguno'));
```

### Critical Finding: `source` CHECK Constraint Conflict

The existing `source` column has a constraint incompatible with Phase 2 requirements:

| Current DB values | Phase 2 required values |
|------------------|------------------------|
| `web`, `airbnb`, `booking`, `phone`, `walkin`, `other` | `booking`, `airbnb`, `web`, `direct`, `other` |

Migration 020 must:
1. Identify existing CHECK constraint name (use `pg_constraint` catalog or use DO block)
2. DROP the old constraint by name
3. Backfill: `UPDATE reservations SET source = 'direct' WHERE source IN ('phone', 'walkin')`
4. ADD new constraint `CHECK (source IN ('booking', 'airbnb', 'web', 'direct', 'other'))`

**Frontend must also update `sourceLabels` and the `<select name="source">` options.**

### Pattern: Adding Nullable Column with Guard (established pattern)

```sql
-- Source: migration 007_cabin_pricing_and_assignment.sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'reservations'
      AND column_name = 'cleaning_supplement'
  ) THEN
    ALTER TABLE reservations ADD COLUMN cleaning_supplement NUMERIC(12,2);
  END IF;
END $$;
```

### Pattern: PostgreSQL CHECK Constraint Replacement

```sql
-- Drop old constraint (need actual constraint name from pg_constraint)
DO $$
DECLARE
  v_constraint_name TEXT;
BEGIN
  SELECT conname INTO v_constraint_name
  FROM pg_constraint
  WHERE conrelid = 'reservations'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%source%';

  IF v_constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE reservations DROP CONSTRAINT ' || quote_ident(v_constraint_name);
  END IF;
END $$;

-- Add new constraint
ALTER TABLE reservations
  ADD CONSTRAINT reservations_source_check
  CHECK (source IN ('booking', 'direct', 'other'));
```

### Pattern: Backend Route Handler (existing style)

```javascript
// Source: apps/refugios-mvp/src/routes/reservations.js
// All new fields follow the same destructuring + optional pattern:
const {
  cleaning_supplement = null,   // RES-03
  booking_source = null,        // wait -- this is 'source' column, see below
  season_type = null,           // RES-05
  reservation_document_type = null  // RES-06
} = req.body;
```

Note: `source` keeps its column name. Its value vocabulary changes, not its name.

### Pattern: INSERT extension

Current INSERT at line 288 of reservations.js:
```javascript
`INSERT INTO reservations (guest_id, cabin_id, source, payment_method, status, lead_stage, check_in, check_out, check_in_time, checkout_time, follow_up_at, guests_count, total_amount, notes)
 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
 RETURNING *`
```

Must be extended to include (after Phase 1 adds `nightly_rate` and `nights`):
- `cleaning_supplement` ($N)
- `season_type` ($N+1)
- `reservation_document_type` ($N+2)

(The `source` column is already in the INSERT — only its allowed values change.)

### Pattern: New `PATCH /api/reservations/:id` Endpoint

CONCERNS.md explicitly flags the absence of a general PATCH as a missing critical feature. Phase 2 must add it because Success Criterion 5 requires fields to be visible "when viewing or editing a reservation". The edit path requires a PATCH endpoint.

Pattern from existing `PATCH /:id/stage` for reference:
```javascript
router.patch("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id invalido" });
  }
  // Destructure updatable fields from req.body
  // Build SET clause dynamically or with explicit allowed fields
  // UPDATE reservations SET ... WHERE id = $1 RETURNING *
});
```

### Pattern: Frontend Form Field (existing HTML pattern)

```html
<!-- Source: apps/refugios-mvp/public/index.html, reservation-form section -->
<div class="form-row">
  <label class="form-field">
    <span>Label text</span>
    <select name="field_name">
      <option value="">Seleccionar</option>
      <option value="val1">Display 1</option>
    </select>
  </label>
  <label class="form-field">
    <span>Numeric label</span>
    <input type="number" name="field_name" min="0" inputmode="numeric" />
  </label>
</div>
```

### Pattern: Frontend Display Chip (existing render pattern)

```javascript
// Source: apps/refugios-mvp/public/main.js line 1228
// Adding chips for new fields follows the same pattern:
${row.cleaning_supplement ? chip(`Limpieza ${money.format(row.cleaning_supplement)}`) : ""}
${row.season_type ? chip(seasonLabels[row.season_type] || row.season_type) : ""}
${row.reservation_document_type ? chip(docLabels[row.reservation_document_type] || row.reservation_document_type) : ""}
```

New label maps needed in main.js:
```javascript
const seasonLabels = {
  alta: "Alta",
  baja: "Baja",
  temporada: "Temporada",
  permanente: "Permanente"
};
const reservationDocLabels = {
  boleta: "Boleta",
  factura: "Factura",
  booking: "Booking",
  ninguno: "Ninguno"
};
```

### Pattern: `normalize()` / `toPayload()` in Frontend

The form uses `normalize(toPayload(form))` at line 1601. The `normalize()` function (line 321-327) casts known numeric keys:
```javascript
for (const key of ["guest_id", "reservation_id", "sale_id", "guests_count", "cabin_id", "nights"]) {
  // cast to int
}
for (const key of ["amount", "total_amount", "nightly_rate"]) {
  // cast to float
}
```

`cleaning_supplement` must be added to the numeric cast list. `season_type` and `reservation_document_type` are strings and need no special handling.

### Recommended Migration File Name

Next migration: `020_reservation_commercial_fields.sql`

Following the established naming convention: sequential 3-digit prefix + underscore + descriptive snake_case name.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CHECK constraint replacement | Custom SQL | PostgreSQL `pg_constraint` catalog DO-block pattern (shown above) | Constraint name may differ between dev and prod; catalog query is reliable |
| Form validation for enum dropdowns | Custom JS validator | HTML `required` attribute + server-side CHECK constraint | Double validation already in place for `source` and `payment_method` |
| Displaying new fields in reservation list | New render function | Extend existing `renderList` callback with additional `chip()` calls | Single render path; no duplicate DOM logic |

---

## Common Pitfalls

### Pitfall 1: Constraint Name Unknown at Migration Time
**What goes wrong:** `ALTER TABLE reservations DROP CONSTRAINT reservations_source_check` fails because PostgreSQL auto-generated the constraint name as something else (e.g., `reservations_source_check1`).
**Why it happens:** When a CHECK constraint is added without an explicit name in the initial CREATE TABLE, Postgres generates an internal name.
**How to avoid:** Use the `pg_constraint` catalog query pattern (shown in Architecture Patterns) to discover the name dynamically, then DROP by discovered name.
**Warning signs:** Migration fails with "constraint not found" in logs.

### Pitfall 2: Existing Rows Violate New `source` Constraint
**What goes wrong:** After dropping the old constraint and before backfilling, or if backfill is in wrong order, the new ADD CONSTRAINT fails on existing rows.
**Why it happens:** Existing rows have values like `'web'`, `'airbnb'`, `'phone'`, `'walkin'` that are not in `('booking', 'direct', 'other')`.
**How to avoid:** Always backfill BEFORE adding the new constraint. Migration order: DROP old → UPDATE rows → ADD new constraint.
**Warning signs:** Migration fails with "violates check constraint" on the ADD CONSTRAINT line.

### Pitfall 3: Column Name Collision — `document_type`
**What goes wrong:** Developer adds column named `document_type` to `reservations`, conflicting conceptually with `documents.document_type` and potentially confusing future queries.
**Why it happens:** The requirements say "document type issued for a reservation" which sounds identical to the `documents` table's field.
**How to avoid:** Name the column `reservation_document_type` on the `reservations` table to distinguish it from the `documents` table's `document_type`.
**Warning signs:** JOIN queries that pull both tables become ambiguous.

### Pitfall 4: `nightly_rate` / `nights` Not Yet in DB
**What goes wrong:** Migration 020 is written assuming Phase 1 columns exist, but Phase 1 was never fully deployed. The INSERT in the route still doesn't write `nightly_rate` or `nights` to any reservations column.
**Why it happens:** Phase 1 added route logic but not the migration to add these columns to the table.
**How to avoid:** Phase 1 must be completed (migration + INSERT update) before Phase 2 migration runs. The planner must include a dependency gate.
**Warning signs:** Phase 2 migration runs but Phase 1 columns are absent; query fails on `column nightly_rate does not exist`.

### Pitfall 5: Monolithic `main.js` Global Variable Collision
**What goes wrong:** Adding new label maps (`seasonLabels`, `reservationDocLabels`) at the wrong scope pollutes the global namespace, conflicting with existing variables.
**Why it happens:** `main.js` is 2849 lines with all variables in one file scope.
**How to avoid:** Define new label maps at the top of the file alongside existing `sourceLabels` and `paymentLabels` (lines 12-19). Follow same `const labels = { ... }` pattern.
**Warning signs:** New labels silently return `undefined` if defined inside a function scope that doesn't execute before render.

### Pitfall 6: `PATCH /api/reservations/:id` Route Ordering
**What goes wrong:** Express matches `/:id/stage` or `/:id/release` before `/:id` if routes are defined in wrong order.
**Why it happens:** Express routes are matched in definition order. A `PATCH /:id` defined before `PATCH /:id/stage` would match stage requests.
**How to avoid:** Define `PATCH /:id/stage` and `PATCH /:id/release` BEFORE `PATCH /:id` in the router file, so specific paths are matched first.
**Warning signs:** Stage/release endpoints return wrong error messages or update wrong fields.

---

## Code Examples

### Current Source Options in Form (to be replaced)
```html
<!-- Source: apps/refugios-mvp/public/index.html line 762-770 -->
<select name="source" required>
  <option value="">Seleccionar</option>
  <option value="web">Web</option>
  <option value="airbnb">Airbnb</option>
  <option value="booking">Booking</option>
  <option value="phone">Teléfono</option>
  <option value="walkin">Mostrador</option>
  <option value="other">Otro</option>
</select>
```

Replacement for Phase 2:
```html
<select name="source" required>
  <option value="">Seleccionar</option>
  <option value="booking">Booking.com</option>
  <option value="direct">Directo</option>
  <option value="other">Otro</option>
</select>
```

### Current INSERT Statement (reference baseline)
```javascript
// Source: apps/refugios-mvp/src/routes/reservations.js line 288
`INSERT INTO reservations (guest_id, cabin_id, source, payment_method, status, lead_stage,
  check_in, check_out, check_in_time, checkout_time, follow_up_at, guests_count, total_amount, notes)
 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
 RETURNING *`
```

### Reservation Card Render (reference for adding new chips)
```javascript
// Source: apps/refugios-mvp/public/main.js line 1222-1240
renderList("reservations-list", reservationsForView, (row) => `<li class="record-item">
  <div class="record-main">
    <span class="record-title">${row.guest_name}</span>
    <span class="record-id">#${row.id}</span>
  </div>
  <div class="record-meta">
    ${chip(`Canal ${sourceLabels[row.source] || row.source}`)}
    ${chip(`Llega ${formatDate(row.check_in)}...`)}
    ...
  </div>
```

### `normalize()` cast function (reference for extending)
```javascript
// Source: apps/refugios-mvp/public/main.js line 321-327
for (const key of ["guest_id", "reservation_id", "sale_id", "guests_count", "cabin_id", "nights"]) {
  if (key in payload) payload[key] = parseInt(payload[key], 10) || 0;
}
for (const key of ["amount", "total_amount", "nightly_rate"]) {
  if (key in payload) payload[key] = parseFloat(payload[key]) || 0;
}
```

---

## State of the Art

| Old Approach | Current Approach | Impact for Phase 2 |
|--------------|------------------|--------------------|
| `source` has 6 values (web/airbnb/booking/phone/walkin/other) | Will have 3 values (booking/direct/other) | Constraint must be replaced; existing rows backfilled |
| No general PATCH for reservations | Will have `PATCH /:id` after Phase 2 | Enables edit workflow for all fields |
| No commercial fields on reservations | Will have cleaning_supplement, season_type, reservation_document_type | Phase 3 (MIG-02) can populate these during historical import |

---

## Open Questions

1. **Should `source` backfill be opinionated or conservative?**
   - What we know: Current prod data has `'web'`, `'airbnb'`, `'booking'`, `'phone'`, `'walkin'`, `'other'`
   - What's unclear: German has not specified how to reclassify old `'airbnb'` or `'web'` reservations
   - Recommendation: Map `'booking'` and `'airbnb'` → `'booking'`; `'walkin'` and `'web'` → `'direct'`; `'phone'` and `'other'` → `'other'`. Document the mapping in migration comments. LOW business risk since historical data will be replaced in Phase 3.

2. **Should `PATCH /:id` allow updating ALL reservation fields or only the 4 new ones?**
   - What we know: CONCERNS.md flags the absence of general edit as a critical missing feature
   - What's unclear: Scope creep risk — a full edit endpoint touches dates, cabin, amounts (conflict checks needed)
   - Recommendation: Implement full edit PATCH with the same conflict checks as POST. The effort is equivalent whether we allow 4 fields or all fields, and Phase 3 import will need it anyway.

3. **Column name for RES-06: `document_type` or `reservation_document_type`?**
   - What we know: `documents.document_type` already exists; naming conflict is real
   - What's unclear: German has not specified a name
   - Recommendation: Use `reservation_document_type` in the DB column name. Use "Tipo doc." as the UI label. This avoids JOIN ambiguity.

---

## Validation Architecture

> `workflow.nyquist_validation` is `true` in `.planning/config.json` — section is required.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node.js built-in `node:test` (Node >= 20) |
| Config file | None — test command is `node --test tests/*.test.mjs` |
| Quick run command | `node --test tests/reservations.test.mjs` |
| Full suite command | `cd apps/refugios-mvp && node --test tests/*.test.mjs` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RES-03 | `cleaning_supplement` is saved and returned by POST /api/reservations | unit/integration | `node --test tests/reservations.test.mjs` | Wave 0 |
| RES-04 | `source` accepts `booking`/`direct`/`other`; rejects old values like `'web'` | unit/integration | `node --test tests/reservations.test.mjs` | Wave 0 |
| RES-05 | `season_type` accepts `alta`/`baja`/`temporada`/`permanente`; rejects invalid | unit/integration | `node --test tests/reservations.test.mjs` | Wave 0 |
| RES-06 | `reservation_document_type` accepts `boleta`/`factura`/`booking`/`ninguno` | unit/integration | `node --test tests/reservations.test.mjs` | Wave 0 |
| All | `PATCH /api/reservations/:id` updates any combination of the 4 fields | unit/integration | `node --test tests/reservations.test.mjs` | Wave 0 |

**Note:** All tests are manual-only if no test DB is available. The built-in `node:test` runner with `supertest` (or direct function tests against the route handler) would be the approach. Given CONCERNS.md states "No test suite exists", Wave 0 must create the test file and infrastructure from scratch.

### Sampling Rate
- **Per task commit:** `node --test tests/reservations.test.mjs`
- **Per wave merge:** `cd apps/refugios-mvp && node --test tests/*.test.mjs`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `apps/refugios-mvp/tests/reservations.test.mjs` — covers RES-03 through RES-06 and PATCH endpoint
- [ ] `apps/refugios-mvp/tests/helpers/db.mjs` — test DB setup/teardown (or mock `query()`)
- [ ] Framework install: none needed (built-in `node:test`), but `supertest` may be needed for HTTP-level tests: `npm install --save-dev supertest`

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection — `apps/refugios-mvp/db/migrations/001_init.sql` through `019_*.sql` (all migrations read)
- Direct codebase inspection — `apps/refugios-mvp/src/routes/reservations.js` (complete file read)
- Direct codebase inspection — `apps/refugios-mvp/public/index.html` (reservation form section read)
- Direct codebase inspection — `apps/refugios-mvp/public/main.js` (form binding, render, normalize patterns read)
- `.planning/codebase/ARCHITECTURE.md`, `STACK.md`, `CONCERNS.md` (project analysis docs)

### Secondary (MEDIUM confidence)
- PostgreSQL documentation pattern for CHECK constraint replacement via `pg_constraint` catalog — standard PostgreSQL DDL

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all technologies already in use; no new dependencies
- Architecture: HIGH — all patterns verified directly from existing codebase files
- Pitfalls: HIGH — constraint conflict and missing endpoint confirmed by direct code inspection
- Migration numbering: HIGH — confirmed 019 is last applied; 020 is next

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable codebase; only invalidated by Phase 1 deployment changing the INSERT statement)
