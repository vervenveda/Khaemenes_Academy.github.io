# 2026-11-20 — Family Portal Account Center five-bubble forensic audit

**Scope:** Academy Core Family Portal `family/index.html`, Parent Profile, learner identity, course/record handoffs, Account Cloud read-only status. **No family/student data, ID values, grades, T03 or 333 Network integration modified.**

## Verified topology
- The **active** Family Portal Account Center is the consolidated purpose accordion, nested existing Family Administration, current `family/index.html` local family roster, dynamic Parent Profile panel script `khaemenes-family-parent-learning-panels-v1.js`, read-only parent-progress and existing account status.
- `assets/khaemenes-family-account-center-v1.js` is a separate **dormant legacy modal source**; the current Family Portal does **not** load it or instantiate its matching modal. Do not re-enable it or introduce a second Family Account Center owner. It was not deleted in this pass.
- Deep link fragments `#parent-daily-reports`, `#parent-learner-panel` and `#family-progress` are injected at runtime by the Parent Profile learning panels script, which also opens the targeted `<details>` on initial load and hashchange. They are **not broken** merely because absent from static Parent Profile markup.
- Family Portal itself opens the nested `family-account-prepare` and `family-admin-details` to reveal dynamic administration anchors and records tools.
- Local family records are continuity data, **not authenticated guardian authorization or Account Cloud sign-in**.

## Five prioritized bubbles
1. **Existing family discovery and Account ID stability — source guarded.** When active family selection is absent but local families exist, current Family Portal offers `Choose Your Existing Family`; it does not create a new family or assign a new Account ID. The existing registry preserves `prior.accountId` when an existing learner is updated. No actual founder account IDs were accessed; exact cross-device ID and parent authority remain unverified.
2. **Grade 09 learner card continuity — source guarded.** Family Portal verifies local family-to-learner membership before switching its active local context and routes Grade 09 through the canonical High School student profile. The URL does not contain a private Account ID. Local selection is not proof of guardianship.
3. **Parent Profile panel ownership and navigation — source guarded.** The current three dynamic details sections (Daily Reports / My Learners / Schedules & Progress) are a single owner. Preserve them; do not reactivate the dormant Account Center modal or manufacture duplicate dialog HTML.
4. **Parent progress confidentiality and cloud-status truthfulness — source guarded; server HOLD.** Parent grade view rechecks `progress.view` through local Family Registry per learner. Its records are browser-local, not a certified transcript or verified cloud result. Account connection status retains `serverVerified:false` and disabled Account Client. Actual server-side authorization and native T03 commissioning remain HOLD.
5. **Course next-step URL integrity — concrete code repair.** `family/index.html` previously navigated to a URL taken from course-sourced `data-open-next` with no destination validation, after a local progress permission check. It now uses `verifiedLearningDestination()`: HTTPS, exact `vervenveda.com` host, approved Academy/KlasaiPeer repository paths only, no embedded credentials or alternate ports, then existing `chooseLocalLearner(...,{requireProgress:true})`. No course next-step data or saved progress was rewritten. Out-of-scope/external URLs do not navigate. This is a **browser navigation safety filter**, not a substitute for server-side URL or content authorization.

## Regression repairs
- New `tests/family-account-center-five-bubble-audit.test.mjs`, five cases including synthetic unsafe URLs; `.github/workflows/family-account-center-five-bubble-audit.yml` keeps future source changes checked.
- Existing `tests/family-connection-readiness.test.cjs` was stale (old `Prepare My Family` text removed in new design), causing a CI failure after modifying `family/index.html`. Updated the *tests*, not the current interface, to verify current `Account Connection`, provisional sign-in statements, existing family restoration, and backup safety. Verified re-run [Family Connection Preparation #44863376691](https://github.com/vervenveda/Khaemenes_Academy.github.io/actions/runs/44863376691) **success** on exact SHA `a89887e385402687b08903da7151eec76652f3d2`.
- Initial new suite failed because an assertion incorrectly expected escaped HTML quotation marks in an embedded JavaScript string. The source author uses ordinary `id="..."` attributes. Corrected only the test source, not the working dynamic panel implementation.

## Runtime acceptance held
No live family profile was accessed, no Mac/tablet account IDs were compared, no student assessments were uploaded, and no Account Cloud authenticated session or native T03 readback was available. Source guards cannot certify cross-device continuity.

**Next checks:** parent-family selection on the original device; Grade 09 student profile navigation and latest course snapshot; independent authenticated guardian/learner session and off-controller Account Cloud readback when commissioned. Preserve original learner/Account IDs and all grade evidence.
