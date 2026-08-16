# Khaemenes Academy Front Door Rollout Status

## Phase 1 — Canonical enrollment and placement

Status: implemented.

- Family Registry v1.1.0 supports exact grade placement from Pre-K through Grade 12.
- Grade determines canonical school stage.
- Legacy broad-stage learners remain intact until grade is explicitly supplied.
- Family Enrollment surface is available at `family/enroll/`.

## Phase 2 — Canonical Student Portal

Status: implemented.

- Student Portal is available at `student/`.
- Active learner is read from the Family Registry.
- Canonical learner context is loaded.
- Missing exact-grade placement is detected before normal continuation.
- Learner switching preserves separate learner identities.
- NAIB may recommend the route but cannot change placement, identity, grades, or mastery.

## Phase 3 — Shared school integration contract

Status: implemented at shared-infrastructure level.

- `assets/khaemenes-learner-context.js` defines the Academy learner context contract.
- `assets/khaemenes-family-school-bridge.js` detects stage/grade mismatches without forced redirects.
- School/course state can be namespaced by canonical `learnerId`.
- Source validation and browser diagnostics cover the shared contract.

## Phase 4 — Existing front-page wiring

Status: pending direct page integration.

Targets:

- Academy home Student Portal should prefer `/student/` for an enrolled learner.
- Family Hub should make `/family/enroll/` the canonical Add/Enroll Learner action.
- Existing manual campus browsing remains available as exploration, not learner identity selection.

## Phase 5 — Elementary integration

Status: next.

Goals:

- load the Academy Family Registry and learner-context adapter;
- treat the current Elementary local profile as legacy/academic preference data rather than identity authority;
- map Grade 01–05 entry to the canonical Academy grade;
- store Elementary-specific progress under canonical learner-scoped keys;
- preserve old data non-destructively during migration;
- add the shared school bridge with stage `elementary` and allowed grades `01,02,03,04,05`.

## Phase 6 — Kinder Garden integration

Status: queued.

- retain Crèche/Kinder compatibility data;
- make Academy learner identity canonical;
- preserve the existing 80% progression system;
- keep NAIB routing and Archaemenes mentoring separate from formal mastery authority.

## Phase 7 — Middle and High refinement

Status: partially integrated.

- both campuses already load the shared Family Registry and school bridge;
- next refinement is explicit grade declaration on each school surface and learner-scoped course progress migration.

## Phase 8 — Teacher Administration visibility

Status: queued.

- surface placement-health issues;
- distinguish learner identity/placement issues from evidence-review holds;
- keep Archaemenes advisory and formal Academy authority separate.

## Validation boundary

Source validators and static diagnostics verify contracts and invariants. Browser/mobile/runtime behavior remains unverified until exercised in an actual browser session.
