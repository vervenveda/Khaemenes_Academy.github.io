# 2026-11-16 · Parent Profile Family Hierarchy and Portal Boundaries

- Repository: `vervenveda/Khaemenes_Academy.github.io`
- Date/timezone: 2026-11-16 · America/New_York
- Type: parent UX audit · section organization · presentation repair
- Status: committed and static syntax checked; live browser acceptance HOLD.

## User decisions
1. To Do Today · Daily Family Reports belongs directly below the standalone Parent Profile photo hero. It should be collapsed by default, expandable with one click.
2. The succeeding learner/progress overview requires improved title hierarchy, organization, contrast, and crisp light-cream card surfaces.
3. Family information and connectivity must be visible from Parent Profile, but the two administrative two-column card rows before the charcoal Parent Action Center section remain on the Parent Portal. The charcoal section and everything below it remain on the Portal.
4. Do not duplicate credential, registration, adult invitation or course authority logic; link to existing controls.

## Changes and provenance
| Commit | Path | Change |
| --- | --- | --- |
| `79ae179d39ab251a1d1f6186c61ee305ab303b55` | `assets/khaemenes-family-parent-learning-panels-v1.js` | Order three independent expandable panels: To Do Today, My Learners, Schedules & Progress; add clear eyebrow, title and subtitle |
| `b2a13d4aa2bad71b2b131cea47efb788d3b7ff8e` | `family/profile/index.html` | Position learning panels directly after photo hero, move profile status to account section, add family summary/connectivity/cards, improve cream contrast and typography |
| `856853252dbd954dbb0465c924fbc70f9a38c53b` | `family/index.html` | Add anchor on existing Adults & Family Access card; lighten administrative card surfaces without replacing dark sections |
| `3e555bb23eed5f89fee51d8e527c086803b1d15d` | `family/profile/index.html` | Point Adult Access card at actual administrative control in Parent Portal |

## Preserved functionality
- All family/student identifiers and stored records unchanged, no new schema or migration.
- Profile panel `progress.view` permission checks preserved; daily reports remain read-only.
- Adult invitation workflows, Family Records/Backup Vault, other administrative cards and Parent Action Center remain in Family Portal.
- No claim of authenticated sign-in, active STOS or cloud backup, or email sending.
- The panels default to collapsed on a fresh view; deep-link hashes or existing open panels during re-render can intentionally reopen them.

## Static checks and remaining holds
- Re-fetch committed files; parse inline JavaScript and parent panels module: pending final check.
- Confirm exact three-panel order, retained administrative sections, and new anchors: pending final check.
- First-tap mobile/tablet, screen rotation, real parent roles and browser persistence: NOT RUN.
- Live production page screenshots and all click pathways: HOLD.
