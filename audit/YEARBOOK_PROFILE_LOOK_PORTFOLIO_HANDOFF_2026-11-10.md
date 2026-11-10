# Yearbook, Universal Profile Look and Portfolio — Family Isolation Handoff
Date: November 10, 2026
Status: Review branches only; no live deployment, learner record migration or STOS operation.

## Review branches
- Academy shared components: `vervenveda/Khaemenes_Academy.github.io`, `hardening/parent-student-schedule-mirror-2026-11-09`
- High School components: `vervenveda/Khaemenes_High.github.io`, `hardening/high-profile-family-context-2026-11-09`

## Five identified improvements
1. **High School universal-look adapter family identity:** `assets/khaemenes-high-school-look-adapter.js` now requires the selected active family, the learner's family and `family.learnerIds` membership to match, in addition to its existing stage, grade and StudentProfileV2 identity checks.
2. **Universal look editor open-dialog context:** `assets/khaemenes-universal-profile-look-editor.js` now closes an open dialog if its captured owner no longer matches the current validated adapter identity on Family Registry, pageshow or cross-tab storage events. File/image revision increments invalidate pending operations, and Save additionally requires an open dialog.
3. **Yearbook profile-image opt-in and picker:** `assets/khaemenes-yearbook-profile-images.js` now validates linked family membership even when helper globals supply a learner ID. Both the photo-picker dialog and embedded Yearbook iframe modal close when the learner changes; registered listeners are removed on close. The iframe returns to `about:blank` on closing.
4. **Achievements and Dreams portfolio:** `grades/shared/student-achievements-dreams.js` (High School branch) requires `activeForGrade(grade)` for both initial record ownership and subsequent access. The Grade 09 exception based on presence of two local IDs alone is eliminated.
5. **Upper-grade Yearbook doorway:** `grades/shared/upper-grade-yearbook-dialog.js` (High School branch) requires validated Grade 10–12 learner context when opening, closes if it changes, and unloads its iframe after closing.

## Test scope
- New Academy tests: `tests/shared-look-yearbook-family-guard.test.cjs`
- New High School tests: `grades/tests/high-portfolio-yearbook-family-guard.test.cjs`
- Source syntax validation passed for the 5 edited JavaScript files plus the 2 authored regression files.
- Tests are **authored but Node test runner and interactive browser tests have not executed**.
- No real images, learner records, indexedDB stores or other private student contents were accessed in this work.

## Explicit boundaries and remaining gates
- Client-side learner pointers are not authenticated authorization. STOS T03 must verify adult/learner identity, family relationships, permitted read views, photo ownership and record writes at the protected authority.
- A photo's presence in a shared Yearbook IndexedDB does not prove its original learner ownership; this bridge only manages explicit learner-scoped opt-in references. A future migration must inventory provenance and conflicts without silently claiming orphaned images.
- Background visual, portfolio and Yearbook are distinct data stores/origins; preserving them for migration requires verified source inventory and a durable T03 receipt.
- The independently mounted Yearbook application may provide its own editor actions; these frontend dialog close guards do not enforce permissions inside the iframe. Audit the Yearbook application's own record mutation paths before claiming parent observer security.
- Test two synthetic sibling accounts, multi-tab switches during asynchronous image processing, delayed indexing, modal closure and reopening, and Grade 09/10/11/12 profile parity.
- Do not merge or deploy these branches until tests and rollback evidence are complete. Protect Terminal T01 and do not activate Terminal T03 from frontend work.
