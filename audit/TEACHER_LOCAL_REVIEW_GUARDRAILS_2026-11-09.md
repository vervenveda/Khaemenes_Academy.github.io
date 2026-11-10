# Teacher public evidence queue — local advisory guardrails

Date: 2026-11-09
Target: `teacher-admin/index.html`
Scope: public educational-advisory interface only. No official grade, mastery, learner placement, account authority, or STOS changes.

## Three fixes

1. Public queue now states that local review notes are not authenticated teacher decisions. Controls are labeled **Mark Locally Reviewed** / **Return to Open Review**.
2. All Resolve/Reopen mutations check whether browser storage persisted the value, and visibly report failure. No claim of success when storage fails.
3. Each successful local review action appends an `unverified-browser-local-advisory` history entry. Reopening preserves the most recent legacy resolution note before clearing its active display. Existing record fields and storage key remain compatible; no migrations or deletion were performed.

## Evidence boundary

- Queue key remains `khaemenes.evidence-review-holds.v1`.
- An export includes `classification: unverified-browser-local-advisory-not-official-academic-records`.
- No server authentication is introduced or claimed.
- Existing `KhaemenesArchaemenesAdvisor.recordTeacherDecision` explicitly returns `false`, and is unchanged.
- The 30-entry `localReviewHistory` cap limits browser record growth; this is a bounded **local history**, not a durable official audit log.

## Tests performed

Synthetic execution in an isolated JavaScript mock environment (no learner records):
- All three inline scripts pass JavaScript compilation.
- Reopening a legacy resolved test record preserves its old note in local history.
- A subsequent local review action appends another entry and keeps the classification unverified.
- The local history is rendered in an expandable section.
- Simulated storage-quota failure reports an error without claiming persistence or changing the stored record.

Outstanding: real browser functional testing across reloads, exports, and small-screen layouts; full repository regression suite; independent course assessment authority audit.

Do not merge without review and browser testing.
