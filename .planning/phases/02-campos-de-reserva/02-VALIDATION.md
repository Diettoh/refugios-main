---
phase: 2
slug: campos-de-reserva
status: completed
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-16
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js built-in `node:test` (Node >= 20) |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `cd apps/refugios-mvp && node tests/reservations.test.mjs` |
| **Full suite command** | `cd apps/refugios-mvp && node --test tests/*.test.mjs` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd apps/refugios-mvp && node tests/reservations.test.mjs`
- **After every plan wave:** Run `cd apps/refugios-mvp && node --test tests/*.test.mjs`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-migration | 01 | 0 | RES-03..06 | Wave 0 stub | `node --test tests/reservations.test.mjs` | ❌ W0 | ⬜ pending |
| 2-source-constraint | 01 | 1 | RES-04 | integration | `node --test tests/reservations.test.mjs` | ❌ W0 | ⬜ pending |
| 2-cleaning-supplement | 01 | 1 | RES-03 | integration | `node --test tests/reservations.test.mjs` | ❌ W0 | ⬜ pending |
| 2-season-type | 01 | 1 | RES-05 | integration | `node --test tests/reservations.test.mjs` | ❌ W0 | ⬜ pending |
| 2-document-type | 01 | 1 | RES-06 | integration | `node --test tests/reservations.test.mjs` | ❌ W0 | ⬜ pending |
| 2-patch-endpoint | 02 | 2 | RES-03..06 | integration | `node --test tests/reservations.test.mjs` | ❌ W0 | ⬜ pending |
| 2-frontend-fields | 03 | 3 | RES-03..06 | manual | manual — see below | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `apps/refugios-mvp/tests/reservations.test.mjs` — stubs for RES-03, RES-04, RES-05, RES-06, PATCH endpoint
- [ ] `apps/refugios-mvp/tests/helpers/db.mjs` — mock `query()` helper for unit-level tests
- [ ] `npm install --save-dev supertest` in `apps/refugios-mvp/` — HTTP-level route testing

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 4 new fields visible in reservation form UI | RES-03..06 | DOM interaction, no headless test setup | Open app, create reservation, verify all 4 fields present and saveable |
| Fields visible in reservation detail/edit view | RES-03..06 | Visual verification | Open existing reservation, verify fields display correctly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
