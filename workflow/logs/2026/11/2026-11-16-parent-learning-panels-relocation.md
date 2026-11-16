# 2026-11-16 · Parent Learning Panels Relocated

- Repository: `vervenveda/Khaemenes_Academy.github.io`
- Timezone: America/New_York
- Type: source audit · UX relocation · repair
- Status: code committed, static syntax checked; live browser acceptance HOLD

## Decision
The Parent Portal is a front desk / family administration hub. Learner cards, Schedules & Progress, and To Do Today · Daily Family Reports belong under **three individually expandable cards** on the separate Parent Profile landing page.

## Changes
| Commit | Path | Description |
| --- | --- | --- |
| `424e6fdfeb4681f8ab16bee9f1983ba16c441548` | `assets/khaemenes-family-parent-learning-panels-v1.js` | New read-only learner/progress/daily report presentation on profile using existing registry and continuation data; only explicit learner selection calls existing setActive |
| `40474be44ab9096fc6beed109d6c23ac9b5f20df` | `family/profile/index.html` | Three expandable cards, cream surfaces, loading module, appropriate anchors |
| `4d898a294645117a20dae15b23f59ef65e85b2b9` | `family/index.html` | Remove the three large embedded sections, add compact profile links and redirect progress navigation |
| `3698db30d2ba732410d6060eeb0aef596f15086d` | `assets/khaemenes-family-parent-profile-hero.js` | Update tool routes to expandable cards and open panels on navigation |
| `1bac7bcb5c857b2fcf34eba4e7f455c9d554c4c1` | `family/index.html` | Correct active-learner selector `$` to `$$` helper, binding all buttons |

## Data and permissions
No data schema migration, storage purge, learner deletion, grade/assessment mutation, or authenticated account change. Progress and daily reports are read-only and scoped to existing `progress.view` family permissions. The new panels do not claim cross-device sync, actual class schedule times, authenticated identity, official transcript, or email backup. Other Family Portal tools, including family record backup, adult access, invitations, and enrollment, remain on the portal.

## Verification
- GitHub committed files fetched and JavaScript parsed: PASS, source-level only.
- Confirm three source section headings removed from Family Portal page: PASS.
- Confirm new Parent Profile panel mount point and dedicated module exist: PASS.
- Production first-click, Safari/Chrome/Opera tablet, dialogs, history and permissions: NOT RUN.
- Confirm layout, visuals, and every parent/student route in deployed browser: HOLD.

## Follow-up
Carry out synthetic multi-learner tests and responsive screenshot acceptance; verify permission denial and grade-09 daily report display. Keep the parent photo hero and profile appearance keys unchanged.
