# Parent and Student Account Continuity — Readiness Contract

**State:** Design/readiness only. The public Family Learning Center does not authenticate users, send password resets, validate email ownership, or synchronize accounts across devices. No account server is connected. This document describes user-facing expectations and acceptance tests, not private service internals.

## Identity separation

- **Family identity:** Stable family record and relationships to adults and learners.
- **Parent/guardian account:** Separate credential-backed identity with verified contact method, scoped guardian roles, and recovery.
- **Student account:** Distinct age-appropriate credential-backed identity linked to an authorized family and learner record, with independent permissions.
- **Academic record authorities:** Course grades, tests, transcripts, portfolios, and assessments remain with their designated record owners.
- **Family or learner identifiers:** Existing internal identifiers may assist migration but are **not passwords**, account login proof, or secure authentication secrets. Do not publish raw IDs unnecessarily.
- **Account number:** Optional user-facing reference, assigned by the future authorized account service; should not substitute for an authenticated sign-in or be treated as secret.

## Planned account experience

1. A parent creates or securely claims an account and verifies the approved contact email.
2. The authorized service identifies the family and eligible learner relationships without creating a duplicate family.
3. Each permitted student has an individual login and age-appropriate experience. A family member never uses another member's account to impersonate them.
4. Access from a second device restores authorized family and learner context after secure authentication and synchronization.
5. First-device local records remain intact until a validated migration with explicit confirmation and recoverable backup is available.
6. An unavailable service reports **not connected** and provides existing local-only family workflows, rather than suggesting cloud changes succeeded.

## Data preservation and conflict handling

- No passwords, password hashes, recovery tokens, verification codes, or secret account keys belong in browser localStorage, exported family JSON, or public GitHub.
- Treat locally saved family records as local records until an authoritative migration verifies ownership and preserves provenance.
- Do not silently merge unrelated families or match solely by nickname, email string, or grade.
- Never overwrite a newer or conflicting course result with older family summary information.
- Do not claim synchronization succeeded without an authenticated, independently verified result.
- Clearly identify which data sets are synchronized; family profile backup alone may not cover course progress.
- Support signed-out behavior without exposing protected student records to subsequent users of the same device.

## Parent safeguards

- Profile decoration and grade placement must not reset academic evidence.
- Permanent deletion is separate from an ordinary grade change, profile editing, and reversible archive.
- Final Authorization Code: four-digit, short-lived, single-use deliberate confirmation **after** authentication and permission checks, not an account password.
- Backup completeness must be verified for the affected data scope before describing any export as comprehensive.
- Keep the final-action workflow disabled until separately verified authorization and durable outcome receipts are operational.

## Public readiness tests

- [ ] Page displays **LOCAL PROFILE / sync not verified** until actual authenticated service status exists.
- [ ] Parent sign-in, student sign-in and cloud sync buttons are disabled and honestly labeled.
- [ ] Existing family selection, registration, grade placement, progress and backup functions remain intact.
- [ ] Account readiness UI does not write family registry, credentials, or course records.
- [ ] A family record ID is never represented as a login password.
- [ ] Keyboard and responsive presentation pass real-browser testing.
- [ ] No private operational or STOS commissioning details are exposed publicly.

## Activation criteria (future, not yet satisfied)

- Authenticated adult and student accounts with safe recovery and appropriate child privacy protections.
- Independently verified account-to-family association and learner-scoped authorization.
- Verified persistence and second-device reconciliation without duplication or loss.
- Verified account logout/session invalidation and device change handling.
- Verified backup/restore behavior and course-level data ownership.
- Approved service integration and evidence-backed release testing.

**Do not enable account creation, passwords, or synchronization by changing public UI flags alone.**
