# Parent Portal ↔ Student Schedule & Profile — Engineering Audit

**Date:** 2026-11-09  
**Repository:** `vervenveda/Khaemenes_Academy.github.io`  
**Branch:** `hardening/parent-student-schedule-mirror-2026-11-09`  
**Deployment:** Review branch only. No live change or student-record migration.

## Requested behavior
An authorized adult should see a linked student's schedule from the Family Portal, reach the correct Student Profile, and visit course pages without repeatedly navigating the Academy directory. The parent must not become the learner or acquire the learner's academic write authority.

## Existing systems reused
- Family registry, family membership and `canAdult(adultId, learnerId, "progress.view")`.
- Family Portal's `learnerProfileDestination` routes for preschool, Kindergarten, Elementary, Middle and High School.
- Shared High School eight-subject plan (`KhaemenesHighEightClass.slots`).
- Published `KhaemenesLearningContinuation.readLearner` snapshots, when available.

## Staged frontend changes
- Added `assets/khaemenes-parent-schedule-mirror-v1.js`: read-only pure schedule mapping, High School grades 9–12; safe HTTPS link allowlist; progress shown only when valid/not stale.
- Family `Schedules & Progress` cards now show up to eight matched course slots in order, including the placeholders where grade-specific Mathematics/Foreign Language choices have not been reported.
- Course visit buttons are tied to an authorized learner context and check `progress.view` before navigation. Existing Student Profile links also require `progress.view` on click.
- Fixed brittle single-element selectors for Active Learner and parent course interactions.
- When no course continuation snapshots exist, a schedule still displays the eight known High School slots with `Not reported`, never zero.
- Other grade levels continue to route to their existing Student Profiles. A standardized non-High School schedule mirror is not part of this change.
- No grades, lesson completions, assessments, course enrollments or learner records are written by the new schedule module.

## Important security boundary
Existing Family Portal permissions and learner selections are currently browser-local. **They are not authenticated server-side authorization.** A parent course link moves into the ordinary course page; that destination may still offer student writing or submission controls. A safe parent-only *view mode* requires every destination Student Profile and course to enforce authenticated adult/learner permissions on a protected backend once T03 is ready. This staged UI does not claim to enforce cross-repository read-only behavior.

Course launch remains normal navigation, not an impersonation login. Existing local learner selection is preserved. Do not claim authenticated parent access or full cross-device synchronization.

## Verification performed
- Parsed Family Portal inline JS, the new mirror JS and Node test source for JavaScript syntax (all PASS).
- Confirmed the new module loads before Family Portal uses it.
- Confirmed permission-gated bindings on course/profile actions and multi-element selectors.
- Six Node regression test cases written: slot completeness, Maths/Foreign Language recognition, unreported-score honesty, URL allowlisting, permission hooks, and no write capability. Node test runner and full browser end-to-end tests **not yet executed**.

## Next gates
1. Verify schedule display/links in a real browser across Grade 9 and grades 10–12; ensure High School catalog is loaded before final render and that unlinked courses remain visibly unavailable.
2. Enforce authenticated parent read-only authorization on Student Profiles and course destinations before claiming safe student-equivalent access.
3. Extend subject-specific schedule mirrors to Pre-K, Kindergarten, Elementary, Middle and Higher Learning as appropriate.
4. Add an authorized Parent Portal Student Record Export Center separately, using verified original course evidence and encrypted backups.
5. Preserve T03 commissioning, family identity and existing student records unchanged.
