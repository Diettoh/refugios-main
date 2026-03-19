# Testing Patterns

**Analysis Date:** 2026-03-16

## Test Framework

**Runner:**
- Node.js built-in test runner (`node:test`) — no third-party framework installed
- Test command: `node --test tests/*.test.mjs`
- Node.js >= 20 required (matches `engines` field in `package.json`)
- No test config file — runner invoked directly via CLI

**Assertion Library:**
- Node.js built-in `node:assert` (inferred from runner choice)

**Run Commands:**
```bash
npm test                  # Run all tests (tests/*.test.mjs)
node --check src/server.js && node --check src/app.js  # Syntax check only (npm run check)
```

## Test File Organization

**Location:**
- Separate `tests/` directory at `apps/refugios-mvp/tests/`
- Convention: `*.test.mjs` extension (ES Module scripts)

**Status:**
- The `tests/` directory does not currently exist — no test files are present
- The `package.json` `test` script (`node --test tests/*.test.mjs`) defines the intended convention but no tests have been written yet

**Naming:**
- Intended pattern: `{domain}.test.mjs` — e.g. `reservations.test.mjs`, `auth.test.mjs`

## Test Structure

**Suite Organization (intended pattern for Node test runner):**
```javascript
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

describe("reservations", () => {
  before(async () => {
    // setup
  });

  after(async () => {
    // teardown
  });

  it("should return 400 when required fields are missing", async () => {
    // ...
  });
});
```

**Syntax check script (npm run check):**
The only automated quality check currently in use runs `node --check` on key source files to detect syntax errors:
```
node --check src/server.js && node --check src/app.js && node --check src/routes/cabins.js && node --check scripts/migrate.mjs
```
This is defined in `apps/refugios-mvp/package.json` as `"check"`.

## Mocking

**Framework:** None configured — Node.js built-in `node:test` provides `mock` module

**What to Mock (recommendations for this codebase):**
- `src/db/client.js` `query()` function — critical for unit-testing routes without a live database
- `src/utils/trelloBridge.js` `notifyReservationCreatedToTrello()` — optional integration, must not require a running Trello bridge in tests
- `process.env` variables — set via environment before test invocation or via `mock.method`

**What NOT to Mock:**
- Validation helper functions (`isDateOnly`, `isTimeOnly`, `normalizeLeadStage`, etc.) — these are pure functions and should be tested directly
- Express Router wiring — prefer integration-style tests using `supertest`-equivalent patterns

## Fixtures and Factories

**Test Data:**
- No test factories exist yet
- Sample data CSVs are available at `apps/refugios-mvp/db/samples_reservations.csv` and `apps/refugios-mvp/db/samples_sales.csv` — could serve as fixture source

**Seed scripts (for manual testing and staging):**
- `scripts/seed.mjs` — populates demo data
- `scripts/migrate.mjs` — runs all migrations in `db/migrations/` sequentially
- These are not integrated into the test suite but can be run against a test database manually

## Coverage

**Requirements:** None enforced — no coverage tooling configured

**View Coverage:**
```bash
# Not configured. Node.js built-in test runner supports --experimental-test-coverage:
node --test --experimental-test-coverage tests/*.test.mjs
```

## Test Types

**Unit Tests:**
- Not present — intended scope: pure helper functions in route files
- Good candidates: `isDateOnly`, `isTimeOnly`, `isDateTimeValue`, `normalizeLeadStage`, `statusFromLeadStage`, `normalizeDocumentId`, `mapReservationEstado`, `csvEscape`, `buildCardDescription`

**Integration Tests:**
- Not present — intended scope: route handlers with mocked `query()`
- Good candidates: `POST /api/reservations` (complex validation + side effects), `PATCH /:id/stage`, `DELETE /:id` with FK cascade

**E2E Tests:**
- Not used

## Common Patterns

**Async Testing (Node test runner):**
```javascript
import { it } from "node:test";
import assert from "node:assert/strict";

it("validates check_in format", async () => {
  const result = isDateOnly("2026-03-16");
  assert.equal(result, true);
});

it("rejects invalid date", async () => {
  const result = isDateOnly("16/03/2026");
  assert.equal(result, false);
});
```

**Error Testing:**
```javascript
it("returns 400 when required fields are missing", async (t) => {
  // Mock query to avoid DB dependency
  t.mock.method(dbClient, "query", async () => ({ rows: [], rowCount: 0 }));

  const res = await makeRequest("POST", "/api/reservations", { body: {} });
  assert.equal(res.status, 400);
  assert.match(res.body.error, /requeridos/);
});
```

## Notes on Current State

- Tests are defined as the intent (`npm test`) but zero test files exist
- All quality checking is currently done via `npm run check` (syntax only) and manual testing against a live DB
- Before adding features, it is recommended to write unit tests for the validation helpers first — they are pure functions with no dependencies and represent the highest-value testing surface

---

*Testing analysis: 2026-03-16*
