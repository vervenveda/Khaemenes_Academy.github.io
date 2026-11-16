# 2026-11-16 · Per-Learner Family Learning Popup Architecture

## Decision
The Kindergarten Family Daily Plan must no longer take permanent page space in the Parent Profile. Every registered student card should have a **Family Learning** control that opens its own learner-specific popup. Kindergarten learners receive the existing family activity-plan editor; other learner stages receive read-only continuation records and available daily reports. This is a presentation relocation, not student data migration.

## Source changes
| Commit | Path | Work |
| --- | --- | --- |
| `b299e8c944fa681f51ec5f33a717b0efb7cc69a0` | `assets/khaemenes-family-learner-dialog-v1.js` | Native dialog, keyboard/close focus behavior, family learner identity and adult access check, distinct kindergarten/non-kindergarten views |
| `a8316e80bbc968ae82e5a38ba7e961bf50818931` | `assets/khaemenes-family-parent-learning-panels-v1.js` | Family Learning button on each learner card and every progress card, including denied progress cards |
| `b54a1abf432522b71c5d6300613d4042fc208e56` | `family/profile/index.html` | Stop loading old permanent Kindergarten panel; load learner dialog |
| `a2932eb92bd5344e9f86b93a62b4b7ab4e587c3b` | learner dialog module | Add permission-scoped latest daily family report, if available |
| `10f41728abd8a38b7aa45dbca3279a4f2883a3f4` | learner dialog module | Correct date pattern for locally stored reports |
| `dc69727be85e4f8df0f02e80b357e1ed91b7b16c` | Parent Profile | Refresh versioned dialog script |

## Access and safeguarding
- The dialog validates the selected family, adult membership and exact selected learner ID on each opening. No cross-learner reads.
- Ordinary-course snapshots and daily reports are shown only with existing `progress.view` permission.
- Kindergarten activity choices use the original `KhaemenesKinderFamilyDailyPlan.state` and `configure` functions. A save requires the current learner to be active and the existing `education.manage` check. No new storage key or workaround permissions.
- Switching the active learner is an explicit action when required, not an automatic change simply from opening the dialog.
- The original Kindergarten API's browser-local storage remains unchanged; no grades, official mastery, attendance, family permissions, or T03/cloud authority changed.
- Native dialog and Escape/Close controls are used to avoid persistent overlays. The older panel code is retained but no longer loaded by Parent Profile.

## Testing / acceptance
- Source module JavaScript syntax: PASS.
- Parent Profile script loader no longer loads permanent Kindergarten panel: PASS.
- Buttons appear in both learner cards and course progress cards at source level: PASS.
- Multi-student browser privacy, native dialog focus, first-click, Android tablet, saved activity persistence and network behavior: NOT RUN.
- Production browser acceptance: HOLD.

## Follow-up
Use synthetic families with Kindergarten, grade-09, and restricted adult roles to check no cross-student leakage, modal open/close once per click, historical activity-plan preservation and correct single-learner records. Keep centered cream/charcoal and restrained gold design.
