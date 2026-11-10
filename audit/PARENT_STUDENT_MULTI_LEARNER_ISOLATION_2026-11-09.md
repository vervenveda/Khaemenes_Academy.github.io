# Parent → Student Profile Multi-Learner Isolation Audit
**Date:** 2026-11-09
**Repository:** `vervenveda/Khaemenes_Academy.github.io`
**Branch:** `hardening/parent-student-schedule-mirror-2026-11-09`
**Status:** Review only. No production or STOS change.

## Source finding
The Academy family registry uses one origin-wide `khaemenes_active_learner_v1` pointer and `setActive` writes local family/adult/learner pointers separately. It explicitly says selection is not authentication. Parent navigation used this pointer before opening learner profiles, course pages and older Parent Action Center shortcuts.

School Profile observations from connected repos:
- Preschool, Kindergarten and Elementary student profiles resolve the current learner using the active local Family Registry selection; all three also offer same-family learner switching.
- High School Grade 09 reads Academy profile context from its course entry contract.
- Middle 06–08 has confirmed grade landing pages but not yet a verified canonical, authenticated parent-specific learner profile.
- Parent-side browser selection cannot independently prevent edits to student work inside destination courses. Cross-repository server-authorized read-only mode is an outstanding security requirement.

## Work staged
1. `assets/khaemenes-parent-learner-navigation-guard-v1.js` rechecks linked family, adult membership, the exact learner ID, and `progress.view` before changing the active pointer.
2. It re-reads the stored family/adult/learner selection after `setActive`, and revalidates current family permissions; navigation is denied when selection is inconsistent or storage fails.
3. `family/index.html` routes Student Profile, course, Next Step and active-learner actions through this guard rather than updating the active learner indiscriminately.
4. Replaced a generic student-portal shortcut with an **Open Selected Student Profile** link that is only rendered for the authorized selected learner.
5. `assets/khaemenes-parent-action-center.js` now uses the same selection guard for Active Learner, Next Step and mentor actions; its generic Student Portal shortcut goes to the Family Portal's learner-specific schedule chooser.
6. `tests/parent-learner-navigation-guard.test.cjs` adds synthetic checks for authorized child, sibling permission denial, other-family rejection, failed storage writes, mismatched read-back, and Action Center parity.

## Authority boundaries
- **Not an authentication or impersonation system**: the browser-local registry can be changed outside this UI. An authenticated STOS T03 family/learner session and backend ACL are required for real account security.
- **Not cross-device persistence**: no new storage service, sync endpoint or backend authority was activated.
- **Not a protected read-only mode**: opening the ordinary student destination may expose editable controls. Individual school/course applications need a purpose-built authorized `parent-view` contract enforced at the record write boundary, not merely in CSS or query parameters.
- No student data was read, exported, moved, deleted or added to Git.

## Verification
JavaScript syntax checks of modified parent controls passed. Isolated synthetic navigation accepted a permitted learner, rejected an unauthorized sibling and rejected another-family ID, with no write for denied selections. The full Node and browser suites remain unexecuted.

## Remaining work
- Audit and harden destination profile selection and course mutations across Preschool, Kindergarten, Elementary, Middle and High School; parental observer sessions must not silently become learner editor sessions.
- Resolve older unscoped course storage and per-device learner ownership under authenticated T03.
- Run real multi-sibling family tests, cross-tab race tests and offline navigation tests before production merge.
