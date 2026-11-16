# 2026-11-16 · Minimal Parent Portal Front Desk and Feature Directory

- Repository: `vervenveda/Khaemenes_Academy.github.io`
- Type: visual topology audit · navigation repair · family UX
- State: changes committed and static syntax checked; deployed browser acceptance HOLD

## Decision
The Parent Portal should be a minimal family front desk, not a duplicate Parent Profile. Its formerly odd five-card quick-links grid is expanded to 12 deliberate destinations arranged in balanced rows. Content already located in the Parent Profile appears as a concise deep link rather than an additional full-length module in the portal.

## Changes
1. `9b9a8ec8160977b37568c7a52d52f09d749d716f` — replace the five-card grid with twelve useful direct destinations and reduce the hero to four links. Condense Account Continuity's inactive sign-in/card display into one status strip and expandable preparation notes. Keep `data-academy-account-status` for the existing live-status owner. Wrap `#familyStatus` and `#familyApp` in a collapsed-by-default family-admin details panel, with existing admin/backup/invite/learner controls unchanged.
2. `5da45cc8a5ffcbcf0e4b6f5e5d2910e9a0e2962d` — add centered, responsive 4 × 3 quick card styling (3 columns on medium, 2 on small, 1 narrow), neutral borders, cream surfaces and concise expandable account/administration layouts.
3. `66756e08e5201793f752b18b8b4c1882ff38c51e` — update the page's versioned shared stylesheet URL.
4. `721da70955736ea61af6acb11599ad80d829110b` — make deep links automatically open the administration drawer before scrolling, including the dynamically mounted Parent Action Center and Family Support Plan.

## Directory destinations
My Parent Profile; My Learners; To Do Today; Course Progress; Family Backups; Family Connectivity; Adult Access; Transcripts; Parent Actions; Support Plan; Homeschool Compass; Adult Scholar.

## Unchanged sections
Preserved the existing Records & Reports, Parent Involvement, Academic Continuum and footer sections. Did not retire any family backup, restore, invite, enrollment or learning-record owner modules. The account-cloud controls shown before were disabled placeholders; no sign-in capability was removed.

## Safety and acceptance
- No family/learner records, passwords, permissions, profile photos, grades, course mastery, localStorage schema, STOS bindings, or account credentials changed.
- First-click navigation, permission-gated controls, parent backups, native mobile layout, header/ticker visual duplication, and verified live deployment: NOT RUN.
- Static route inventory, content checks and inline JavaScript syntax: pass after final verification.
- Visual design follows the user's parent-specific canonical cream/charcoal with gold accents only.
