# 2026-11-18 · Dual Front Desk button parity and Student Profile render guard

- **Repositories inspected:** `KhaemenesAcademy/KhaemenesAcademy.github.io`, `vervenveda/Khaemenes_Academy.github.io`
- **Status:** Static parity verified; render re-entry guard committed to Full Academy; browser acceptance HOLD.

## Front desk static inventory
- Both `index.html` sources have 45 original `<a>` anchors and 4 original `<button>` elements in the source snapshot.
- All visible static anchor labels appear in the same order. Campus and ecosystem destinations match exactly.
- Each Full Academy local service link (`./student/`, `./family/`, `./adult/`, `./teacher-admin/`, `./offline/index.html`) is represented on Academy Home by an absolute `https://vervenveda.com/Khaemenes_Academy.github.io/` URL pointing to the same logical route.
- HTML files are intentionally not identical: canonical URL, integration script locations, Home-only dynamic navigation handling and core chrome loader differ.
- Dynamic/script-created menu and toolbar controls were not covered by this 45-anchor source count. All actual clicks and rendered parity require browser tests.
- Anonymous public HTTP delivery probe exists at `scripts/verify-public-academy-routes.mjs`; its results were not executed or certified during this GitHub source session.

## Student Profile investigation
- Full Academy `student/profile.html` loads shared profile model, continuation and UI modules.
- UI `render()` calls `syncContinuationEvidence()`, which may persist changed evidence and synchronously emit `khaemenes-student-profile-changed`. UI listens to that same event and re-renders. This forms a re-entry path without a prior guard.
- **Repair:** Added `rendering` re-entry guard and `try/finally` release around UI render in `assets/khaemenes-student-profile-ui-v2.js`. It prevents nested render while preserving the underlying evidence update and dispatch.
- **Regression:** Added `tests/student-profile-ui-render-guard.test.mjs` source checks for the guard, reset, and synchronization ownership. Test execution/green CI status not yet independently confirmed.
- The page also directly mounts VNV ticker/header/toolbar while its deferred `academy-core-global-standard-v1.js` attempts mounting. Potential redundant chrome DOM observer activity requires live browser profiling.
- No evidence currently proves the user's reported continuous loading is fully fixed. CSS-only failure is not confirmed.

## Safety / scope
No change to learner ID, grades, placement, mastery, evidence schema, stored profile records, STOS, account cloud, domains, or enrollment rules. Existing profile state remains untouched. The new render guard affects UI scheduling only.

## Browser acceptance pending
Check no console errors, stable render count, populated vs guest profile, keyboard navigation, portrait and landscape, one instance each VNV chrome element, and no ongoing loader. Use fictional learner test identities only.
