# 2026-11-20 · Student passcodes and cross-device account access
- Repository: vervenveda/Khaemenes_Academy.github.io
- Date/timezone: 2026-11-20 · America/New_York
- Type: audit · decision · follow-up
- Branch: main
- State: DOCUMENTED PLAN / IMPLEMENTATION HOLD

## Conversation summary and decisions
The Academy founder asked to recover and document the previously planned student-selected passcode for Student Profile creation, allowing learners to resume the **same account across authorized devices**. Earlier planning recorded a five-digit student PIN, a ten-digit parent/guardian code, and a four-digit recovery code. The founder noted that digit counts might differ; therefore **all lengths are provisional, not confirmed product requirements**. Do not silently impose or activate them.

The selected passcode should be created as part of student profile onboarding, but must **not** be collected by a local-only browser enrollment form. Verified, credential-backed sign-in belongs to the protected credential authority, with authorized sessions and Account Cloud continuity independent of a particular device. Siblings retain separate learner identities and credentials. A student PIN does not confer guardian permissions.

## Evidence and audit findings
| ID | Affected paths / source | Observed evidence | Priority | Status |
| --- | --- | --- | --- | --- |
| PASS-01 | Prior Academy credential design discussion (reported 2026-11-09) | Student-selected 5-digit code; parent/guardian 10-digit code; recovery 4-digit code documented in discussion, subject to re-verification | High | HISTORICAL PLAN |
| PASS-02 | Founder follow-up 2026-11-20 | Number of digits might be different; final lengths not approved | High | OPEN |
| PASS-03 | `assets/khaemenes-family-registry.js` | Current family/adult/learner continuity is browser-local; local active selection is expressly not authentication | Critical | SOURCE VERIFIED |
| PASS-04 | `assets/khaemenes-terminal03-readiness.js` | T03 readiness adapter declares `LIVE=false`; no production cross-device account sync established by this adapter | Critical | SOURCE VERIFIED / HOLD |
| PASS-05 | `KhaemenesAcademy/Account-Cloud.github.io/contracts/ACCOUNT_CLOUD_PROTOCOL_V2.md` | Account Cloud preserves learner identity but must not store credentials, password hashes or recovery secrets; protected authentication is separate | Critical | SOURCE VERIFIED |
| PASS-06 | `KhaemenesAcademy/Account-Cloud.github.io/docs/CROSS_DEVICE_ACCEPTANCE_GATE.md` | Requires Mac/tablet identity continuity, protection against stale writes, session safety, and reset/unlock tests before production admission | Critical | CHECKLIST PRESENT; LIVE PASS UNVERIFIED |
| PASS-07 | `family/enroll/index.html` | Provisional enrollment and privacy acknowledgments exist, with modal UI committed 2026-11-20 in commit `f0bbf36f9e8fcb947101bcc5ec0966aae615a903`; this does not create protected credentials | High | SOURCE COMMITTED / BROWSER QA UNVERIFIED |

## Intended account credential flow
1. Create or locate a distinct learner identity using the authorized enrollment pathway.
2. When protected sign-in is commissioned, allow learner to choose a PIN/passcode via the credential authority's secured interface (length and eligibility to be finalized).
3. Never write passcodes, password hashes, recovery codes, or equivalent secrets into `localStorage`, `sessionStorage`, GitHub, family backups, student exports, or general Account Cloud record fields.
4. On another device, use protected credential verification plus any necessary guardian/age-appropriate safeguards to establish an opaque server-authorized session.
5. Resolve the **existing** canonical `learnerId` and family associations; never create a new learner simply because a new device is used.
6. Enforce per-learner and per-device permissions server-side; student credentials cannot unlock adult administration.
7. Implement rate limiting, lockout/recovery safeguards, secure credential reset, revocation, and auditable events without logging secrets.
8. Support authorized guardian-assisted reset without treating a short recovery PIN alone as proof of identity.

## Tests
| Command or scenario | Environment | Result | Evidence |
| --- | --- | --- | --- |
| Inspect Academy family registry and T03 readiness | GitHub main source | REVIEWED | Local-only identity, live transport not commissioned |
| Inspect private Account Cloud contracts | GitHub main source | REVIEWED | Credential/session/storage authority split documented |
| Cross-device PIN sign-in on Mac and tablet | Production | NOT RUN | No verified live credential service in this audit |
| Five/ten/four-digit policy enforcement | Credential authority | NOT RUN | Exact code lengths still provisional |
| Guardian reset and student isolation | Protected integration | NOT RUN | Pending synthetic acceptance |
| Browser UI for student passcode creation | Academy enrollment | NOT RUN | Not implemented by this log |

## Repairs, upgrades, Codex changes
| Change | Files | Commit or PR | Verification |
| --- | --- | --- | --- |
| Record credential and cross-device plan; preserve HOLD | This workflow log and workflow index | See repository history | Documentation only |
| Credential form or native authority | None | None | NO PRODUCTION CHANGE |

## Open items
- [ ] Locate the authoritative credential specifications and any previous synthetic PIN tests; reconcile whether student code has 5 digits or another length.
- [ ] Confirm rules for parent/guardian credentials and recovery; a 4-digit recovery code must not be a standalone account takeover factor.
- [ ] Design Student Profile PIN selection and confirmation **only after** the approved protected credential interface exists.
- [ ] Define independent-minor and facilitator/group access without falsely granting guardian privileges.
- [ ] Verify cross-device identity continuity using synthetic families and learners on Mac and tablet.
- [ ] Check rate-limiting, lockout, stolen-device revocation, password/PIN reset, recovery, no secret leakage, and permissions.
- [ ] Complete STOS T03 commissioning and Account Cloud acceptance gates before real learner synchronization.
- [ ] Perform browser and workflow regression tests before activating an account-creation interface.

## Safety and closure
This is a planning and evidence log, **not** a declaration that passcode-based sign-in has been implemented or passed workload tests. Do not use short PINs as the sole internet-facing authentication factor without a specifically approved hardened model. Protect minors' personal information, enrollment authorization, existing assessment evidence, course-owned mastery, and the current Academy registry. No real credentials or learner records were included.

## Family Learning Center source update — 2026-11-20
- `family/index.html` now contains a single `academyFamilyCredentialReadiness` information section in the Account Connection area, with the provisional 10/5/4-digit plan, learner-specific security separation, and an explicit NOT ACTIVE notice.
- Commit: `1c7916f0260a0d090dc3843c5d323280eca50d2c`.
- Scope: presentation and explanatory text only; no PIN fields, no credential creation, no family registry or academic state modifications.
- Verification: source commit completed; interactive browser and production authentication tests NOT RUN. T03 commissioning and cross-device sign-in remain HOLD.

## Credential change and email notice requirement — 2026-11-20
- Founder requirement: Parent/guardian, administrator and student can request a passcode change whenever eligible by supplying their current passcode and verified registered account email, then entering/confirming a new passcode; after successful rotation send a security-notice email to previously verified registered contact(s). No credential should appear in the notice.
- For a student with no verified individual email, route notification through an authorized verified guardian where appropriate. Independent-minor pathways require a separate privacy-preserving contact policy; never invent guardianship.
- Require authenticated secure session and server-side current-code check, verified email match, role-scoped Klik authorization, additional admin step-up security, rate limiting, session revocation and independent recovery. An email address alone does not prove ownership.
- Keep credential verification/rotation within OHMIC or commissioned credential authority. Account Cloud stores only non-secret continuity/audit/notice metadata, never PINs or reset tokens. Outbound email uses protected server queue and retries; do not claim delivery before it is confirmed.
- Private source contract: `KhaemenesAcademy/Account-Cloud.github.io/contracts/CREDENTIAL_CHANGE_AND_NOTICE_V1.md`, commit `e34b3ba3ee0a32ac210d626f274fb6e52af7ec30`.
- Family-page informational section: `family/index.html`, commit `6466eee90dc0e97d905e3cd0e23595239ca312b5`. No passcode inputs, endpoint or live email delivery activated.
- Tests: Source-level confirmation pending; synthetic auth, email queue, Mac/tablet, privilege isolation, lockout, notification failures and T03 commissioning all NOT RUN / HOLD.
