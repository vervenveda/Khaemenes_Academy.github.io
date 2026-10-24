# Academy Evidence Authority — Security Pre-Audit
Date: 2026-10-23
Mode: Source read-only for existing student records; no private evidence accesses or permission changes.

## Confirmed inspected sources
- `assets/khaemenes-family-registry.js` v1.3.2
- `teacher-admin/index.html`
- `family/index.html`
- `index.html`
- `Khaemenes_High.github.io/index.html` (cross-repository reference)

## Findings
1. **Identity selector is not authentication.** Family Registry stores active family, adult and learner IDs in browser localStorage. `setActive` changes selection and dispatches a browser event.
2. **Grants are client-side.** `grantAdultAccess` stores grants in a local registry. `revokeAdultAccess` marks a grant revoked, and `canAdult` checks stored status and permission strings.
3. **No authenticated session proof found in the inspected registry.** No token verification, `fetch` to a private authorization service, or remote session claims are present in that file.
4. **No protected evidence-serving endpoint established by this audit.** The inspected teacher administration page has no authenticated `fetch` access for evidence; no server-side revoke enforcement has been demonstrated.
5. **Shared-device risk remains.** An active profile ID or local grant cannot authorize reading another learner's work. Restoring a client-side backup cannot certify the restorer.
6. **Cross-origin caution.** Local storage is origin-scoped; academy.githublike and canonical domain aliases need real browser isolation tests. No assumptions of shared authenticated state.
7. **Safe default.** Do not attach private portfolios, teacher review or export/restore controls to local `canAdult` checks alone. Preserve existing offline journals without silently sharing them.

## Necessary storage-boundary contract before activation
- Server validates authenticated session and derives actor ID from server-side context, never from request-supplied adult or learner IDs.
- For every private read/list/restore/export/review action: check current grant for actor, learner, requested action and resource scope.
- Revocations invalidate future requests; repeat tests with the same still-valid session after grant removal.
- Server checks evidence's canonical learner ID against authorized scope. A forged learner ID or swapped profile does not change access.
- Restore requires explicit learner match, non-destructive conflict resolution, and audit; a learner can never impersonate a teacher reviewer.
- Two fictional learners and two adults: test access before grant, after grant, immediately after revocation, after profile switching, after page reload, and during malformed/restored records.
- No live learner records used as test fixtures.

## Verification status
- Repository source traced: YES
- Browser-local grant and revocation functions confirmed: YES
- Authenticated server session found: NOT IN INSPECTED SOURCES
- Protected evidence service identified: NOT YET
- Revocation tested against protected evidence storage: NO
- Two-learner end-to-end security certification: NO

**Release gate: deny private evidence sharing and teacher review until an authenticated protected service passes the tests above.**
