# Kindergarten Daily Adventure × Family Portal — Integration Audit
Date: 2026-11-09
Status: Review-branch only; no merge, release or real learner record changes.

## Ownership
- Family Hub: `family/index.html` on `upgrade/kindergarten-family-daily-plan-2026-11-09`
- Parent interface: `assets/khaemenes-kindergarten-parent-daily-panel.js`
- Shared local plan: `assets/khaemenes-kindergarten-family-daily-plan.js`
- Kindergarten Student Profile: `vervenveda/Khaemenes_KinderGarden.github.io` on `upgrade/kindergarten-profile-readiness-2026-11-09`, `student-profile/index.html`
- Child-facing panel: `assets/khaemenes-kinder-daily-adventure.js`

## Contract
- Parent sees an age-appropriate selection of **eight authored daily activities**. A locally selected adult with `education.manage` permission may select 1–5 activities for the active Kindergarten learner.
- Child sees the 1–5 chosen activities in a playful five-star daily checklist. Child can toggle participation; stars do not count toward coursework, assessments or graduation.
- Activity choices and check-ins are scoped by selected learner ID under `khaemenes.kindergarten.family.daily.v1:<learnerId>` in same-origin browser-local storage.
- Day counters reset by local calendar date; previous daily check-ins remain at most 14 dates in the local record and cannot be backdated through the API.
- The **actual** formal lesson link comes from the existing Kindergarten Today / curriculum continuation; the daily plan does not write `khaemenes_kindergarten_mastery_receipts_v1`, formal daily evidence, grades or placement.
- Parent-to-student sharing is **same browser and origin only**. Cross-device synchronization is not implemented.
- Family Registry local selection and an `education.manage` permission check protect ordinary UI flows but are **not real authentication**; technically capable browser users can alter local storage. Do not treat the panel as a secure guardian authorization system. T03 Account Cloud commissioning is still required for protected controls.

## Tests
- 24 synthetic assertions passed for valid/invalid activity selection, local adult permission, sibling isolation, grade exclusion, same-day check-ins, no backdating and no mastery key writes.
- Kindergarten profile source regression passes with all 17 existing controls preserved, the new student panel, parent doorway, script load order and inline JavaScript syntax.
- Family Portal and Kindergarten source checks confirm script load order and no source-level syntax errors.
- **Not yet tested in live browser:** photo/yearbook popup, tablet spacing, parent-to-child changes through actual family registry UI, refresh/sibling-switch behaviors and real curriculum lesson launch.

## Suggested further stages
1. Browser regression using fictional learners and an authorized test adult on the same origin.
2. Parent-friendly options for notifications, daily routine display and portfolio encouragement.
3. Real authenticated parent controls after protected account authority comes online; do not replace with pretend passcodes.
4. Extend rewards to student-owned portfolio celebration, never to mastery writes.
