# 2026-11-20 · Optional Student Profile privacy lock
- Repository: vervenveda/Khaemenes_Academy.github.io
- Branch: main
- Type: security UX · decision · partial implementation
- Source commit: `4db6f749f709453ab4f57601e402948321fa4639`
- State: OPTIONAL LOCK UI COMMITTED / REAL AUTHORIZATION AND UNLOCK HOLD

## Request
Student may optionally enable a protective code for their personal profile, lock or unlock the profile, and later turn the feature off. Preserve public learning access, learner continuity, course progression, and account security. Earlier tentative student 5-digit, guardian 10-digit, recovery 4-digit lengths are unfinalized.

## Source findings
- The Academy entry `student/index.html` selects/opens an existing learner but is not the protected credential authority.
- The actual Academy legacy portfolio page `student/profile.html` contains `#profileStudio` owned by `assets/khaemenes-student-profile-ui-v2.js`.
- `assets/khaemenes-student-profile-v2.js` explicitly does not authenticate anyone; it stores some learner-authored preferences locally.
- Grade-specific student profile routes may live in distinct school repositories. This change covers **only the Academy's `student/profile.html`**, not each grade's dedicated profile page.

## Change
A single `#academyStudentProfilePrivacyLock` section was added to Academy `student/profile.html` with three clearly unavailable controls: Enable Profile Lock, Unlock My Profile and Turn Off Profile Lock; explanation of authorized future behavior, privacy boundaries and relationship to verified sign-in. All controls remain disabled; the page does not collect/store PINs or pretend that a local overlay authenticates the learner.

## Required protected design
1. Optional preference bound to canonical learnerId, not browser-only identity.
2. When authenticated, enable/disable after verified re-authentication and authorization.
3. Lock hides personal profile workspace but **must** also restrict protected data at server and never serve as the sole protection; free public lessons stay available.
4. Unlock via OHMIC commissioned credential check, Wend/Bunya session, Klik/Avouch policy, rate limiting and sensitive-session protection.
5. Student can turn lock off subject to account/recovery rules; authorized guardian assistance only through protected verified permissions.
6. Credential changes trigger verified contact security notices per `KhaemenesAcademy/Account-Cloud.github.io/contracts/CREDENTIAL_CHANGE_AND_NOTICE_V1.md`; email has no secret.
7. Never store PINs/hashes/recovery credentials in localStorage, sessionStorage, profile JSON, GitHub or account cloud generic sync.

## Checks
| Check | Result |
| --- | --- |
| Academy portfolio page updated in GitHub | COMMITTED |
| `#academyStudentProfilePrivacyLock` one section | Static source verification pending |
| Existing `#profileStudio` unchanged | Static source verification pending |
| Actual lock/unlock authorization | NOT IMPLEMENTED / HOLD |
| T03 protected sessions + Mac/tablet acceptance | NOT RUN |
| Grade-specific student profile parity | NOT AUDITED HERE |
| Visual/keyboard/mobile live browser QA | NOT RUN |

## Next steps
- [ ] Commission and test protected learner credential/session authority before enabling the buttons.
- [ ] Define locked/unlocked policy behavior, learner/guardian rules and whether a profile lock persists across devices.
- [ ] Audit grade-specific student profile owners for the appropriate single shared feature integration; avoid duplicate global scripts.
- [ ] Verify dynamic portfolio mount and acceptance in browser, including mobile/tablet landscape.
- [ ] Keep Academic engines, grades, mastery and family permissions unchanged.

## Safety
This source change is not a working secure lock. Local-only PIN/overlay mechanisms would be easily bypassable and should not be marketed as profile protection. No passwords or learner personal information were collected.
