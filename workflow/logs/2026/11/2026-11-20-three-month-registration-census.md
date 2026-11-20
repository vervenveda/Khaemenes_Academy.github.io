# 2026-11-20 · Three-month account registration census
- Date range: 2026-08-20 00:00 through 2026-11-20 23:59 (America/New_York)
- Repository: vervenveda/Khaemenes_Academy.github.io
- Type: read-only forensic audit · inventory · follow-up
- State: SOURCE AND TEST ASSET COMMITTED / LIVE LOCAL BROWSER CENSUS NOT RUN
- Test source commit: fa297a77fec158b1253a472b53c5be49751e45bd

## User request
Scan any family/adult/student registrations created within the last three months, including Ruby's fictional family and potential Ahja registration. Do not create, edit, merge, delete or migrate account records.

## Verified boundaries
- `assets/khaemenes-family-registry.js` version 1.3.2 stores `families`, `adults`, `learners` and last 300 local audit events in browser `localStorage` (origin/profile-scoped).
- Family/adult/learner creation timestamps are `createdAt`; audit event timestamp is `at`.
- Family enrollment may call `createFamilyIntake`; new learner paths call `registerLearner`. Browser registry identity is provisional, not verified sign-in.
- Github repository source and workflow search did not expose a canonical registration ledger for the requested period. A GitHub search with zero results is not evidence that no one enrolled.
- Account Cloud `docs/CROSS_DEVICE_ACCEPTANCE_GATE.md` remains unchecked; T03 and verified cross-device account persistence are not commissioned.
- Mac Archive Custodian local-only transcript and source explicitly do not establish cloud registration history.
- Source-level evidence does not supply a **system-wide total**. Browser-origin/profile registry and any authorized archive must be inspected separately; even one Mac's browser profile cannot certify all external visitors' local enrollments.

## Source asset
- `workflow/tests/registrations-90-day-readonly.js`: run after manually reading source in DevTools Console at `https://vervenveda.com/Khaemenes_Academy.github.io/family/` on the browser profile used for enrollment.
- Counts family/adult/student records created in the time range; groups by month; reports timestamps missing/invalid; summarizes local registration audit event actions; counts candidate Ruby families and linked student count, plus exact Ahja nickname matches.
- Does not print names, emails, identifiers, grades, protected data or any record values. Does not perform writes/network/downloads.
- Report is local only, may omit old records due to browser profile/origin differences, and has a max-300 audit event limit. A restore can carry historical `createdAt` values and does not represent a new registration.

## Evidence status
| Gate | Status |
| --- | --- |
| Registry implementation inspected | SOURCE VERIFIED |
| Registration ledger from live Account Cloud | NOT AVAILABLE/NOT COMMISSIONED |
| Repo search for Ruby/Ahja | No indexed matches; inconclusive |
| Read-only census source in repo | COMMITTED |
| Actual user's browser registry census | NOT RUN |
| Mac encrypted archive census | NOT RUN; no direct access |
| System-wide 3-month registration count | UNDETERMINED |

## Next actions
- [ ] Run `registrations-90-day-readonly.js` on the ORIGINAL browser profile and report its sanitized output.
- [ ] Check any older browser profiles/domains if local census incomplete; don't create duplicates.
- [ ] If verified authorized backups exist, inspect only metadata offline; do not upload records to GitHub.
- [ ] Reconcile duplicate candidates by canonical IDs locally and only after source-of-truth and protection review.
- [ ] Continue protected Account Cloud commission independently; never represent local census as server-wide intake.
