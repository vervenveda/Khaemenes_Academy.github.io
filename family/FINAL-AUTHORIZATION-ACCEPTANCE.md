# Family Final Authorization — Public Acceptance Criteria

Status: **PRE-COMMISSIONING / DISABLED**. This document describes parent-facing expected behavior only. It is not an operating manual, service API specification, security implementation, or indication that email verification is active.

## Purpose

A four-digit Final Authorization Code is a short-lived confirmation of a parent's deliberate **final decision about an irreversible action**. It is **not** a password, a login credential, or permission by itself. The parent must already be authenticated and authorized. Grade changes and ordinary profile editing remain separate from permanent deletion.

## Parent-facing acceptance requirements

1. Select a specific learner and see that learner's display name and the exact proposed action.
2. Differentiate changing grade, reversible archiving, removing a learner profile, and permanently erasing educational records.
3. Before any irreversible operation, display what would be affected and what would remain, without implying that a family profile backup includes separately managed coursework, grades, portfolios, or evidence.
4. Clearly show whether a **complete, restorable backup** covering the affected records has been independently confirmed. An unverified or incomplete backup must not be displayed as verified.
5. Offer a safe exit, grade-change alternative, and access to existing family backup tools.
6. When an approved account service becomes available, require a signed-in authorized adult and send a single-use four-digit code to the verified parent email for the specific proposed action. Codes expire after five minutes and cannot be reused.
7. Recheck authorization and the selected action when the code is submitted. A changed learner, action, session, or expired code must not authorize execution.
8. Display a clear success or failure outcome and an appropriate action receipt after a real, confirmed operation. Never show success merely because a request was submitted.
9. Never silently delete a learner's grades or other separately managed academic records when only profile removal was authorized.
10. Where a test learner is explicitly designated, provide appropriately scoped, clearly labeled test-only cleanup behavior after secure authorization; never assume a real learner is a test learner.

## Pre-commissioning acceptance tests

- [ ] Opening the safeguards dialog does **not** change any student record.
- [ ] The selected learner is correctly shown, using safe text rendering.
- [ ] The grade-management link still leads to the existing placement editor.
- [ ] The backup link still leads to the Family Records controls.
- [ ] Email delivery, code entry, code verification, and irreversible actions remain **disabled**.
- [ ] The dialog closes without changing student or family data.
- [ ] Keyboard focus, Escape, and small-screen presentation are verified in a real browser.
- [ ] No public document or page embeds service credentials, internal STOS implementation details, or privileged control surfaces.

## Post-commissioning acceptance tests (not yet executed)

- [ ] Authenticated parent and learner-scoped authorization enforced.
- [ ] Email delivered only to verified parent address.
- [ ] Code valid only for its single intended learner and action.
- [ ] Expiry, resend limits, incorrect attempts, and replay prevention tested.
- [ ] Backup completeness and record-scope warnings independently verified.
- [ ] Lost connection or unavailable service fails closed.
- [ ] No duplicate execution on retries or repeated submission.
- [ ] Receipt reflects verified outcome rather than assumed completion.
- [ ] No irreversible operation can execute while authorization service is unavailable.

**Deployment gate:** No code issuance or permanent learner removal may be enabled merely because the UI is present or because terminal construction has progressed. Service readiness and operational authorization must be independently established.
