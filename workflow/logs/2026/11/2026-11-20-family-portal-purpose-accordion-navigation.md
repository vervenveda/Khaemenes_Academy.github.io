# 2026-11-20 · Family Portal purpose-based charcoal accordions
- Repository: vervenveda/Khaemenes_Academy.github.io
- Date/timezone: 2026-11-20 · America/New_York
- Type: audit · UI refactor · verification · follow-up
- Branch: main
- Source commit: `bdc4d14cdb6304b17b1b83cd82847823b1ddd716`
- State: COMMITTED / STATIC SOURCE VERIFIED / LIVE BROWSER QA HOLD

## Goal and scope
Replace crowded and duplicated Family Portal button navigation with four focused full-width charcoal `details/summary` accordion bars using Cinzel headings, cream text, 16px body/button text, 7px corners. Groups: Profile Design; Enrollment; Personal Information; Student Records. Keep existing identity, grade, mastery, recovery, family backup and Account Cloud ownership unchanged.

## Audit evidence
- Before: five hero-action buttons, twelve quick-directory cards, separate four-card Records and Reports grid, separate four-card Parent Involvement grid, plus protected family administration and Account Connection controls.
- After: one 4-group purpose directory with 22 anchored feature destinations; removed the duplicate hero button row, former quick-directory navigation, and duplicate records/support navigation grids.
- `family/index.html`: retained `family-admin-details`, `family-records-controls`, `family-adult-access`, `academyFamilyCredentialReadiness`, family registry script, and `renderFamily(f)` logic.
- `khaemenesParentActionCenter` is an asset-mounted dynamic component rather than an inline HTML element in source; its link destination is preserved; runtime visibility requires browser test.
- Navigation contract that opens nested Account Connection/Family Administration on internal hash links remains in place.
- Academic Continuum and the existing official ticker/header/toolbar/footer remain in source.

## Four sections
1. **Profile Design**: Parent Profile, My Learners, Adult Scholar.
2. **Enrollment**: Family & Learner Enrollment, Grade/Placement, Student Entry, Higher Learning, Academy Tour.
3. **Personal Information**: Family Connectivity, Passcodes & Account Security, Adults & Permissions, Manage Family & Records.
4. **Student Records**: To Do Today, Course Progress, Class Progress & Grades, Family Backups, Transcripts, Diplomas, Homeschool Compass, Parent Action Center, Family Support Plan, Archaemenes.

## Checks
| Check | Result |
| --- | --- |
| Four named accordion groups in new source | PASS (source count 4) |
| Single purpose directory, no former twelve-card directory | PASS (source check) |
| Redundant records/support grids removed | PASS (source check) |
| Registry / family rendering functions retained | PASS (source check) |
| Family administration and security notice IDs | PASS (source count 1 each) |
| Links through dynamic modules and anchors in live browser | NOT RUN |
| Screen sizes, keyboard and assistive technology acceptance | NOT RUN |
| GitHub Actions / Pages deployment checks | NOT VERIFIED |
| Family data or credentials mutated | NO |

## Open items
- [ ] Live browser click test for each of 22 feature links, including dynamically generated Family Records, Parent Action Center and Support Plan anchors.
- [ ] Check keyboard navigation, focus behavior, mobile/landscape layout, RTL/translation, and accordion contrast.
- [ ] Verify top tickers, VNV header, hamburger, bottom toolbars and footer after deployment.
- [ ] Confirm hash navigation opens nested admin panels reliably for new and existing families.
- [ ] Preserve any future non-duplicative services and avoid a new conflicting universal chrome layer.

## Safety
Presentation/navigation changes only. No account sign-in, stored family/learner data, passcode, grade or assessment authority, Account Cloud T03 commissioning, or credential migration changed. A source commit is not a live workflow PASS.
