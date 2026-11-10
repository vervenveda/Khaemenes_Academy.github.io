# Parent Portal Grade-Level Navigation Parity — Review Audit
Date: 2026-11-09
Branch: `hardening/parent-student-schedule-mirror-2026-11-09`
Status: **review only** — not merged, not deployed; no real learner records accessed.

## What was verified
Existing profile pages:
- Preschool: `Khaemenes_Preschool.github.io/student-profile/`
- Kindergarten: `Khaemenes_KinderGarden.github.io/student-profile/`
- Elementary (1–5): `Khaemenes_Elementary.github.io/student-profile/`
- Middle School: `Khaemenes_Middle.github.io/grades/grade-06/`, `grade-07/`, and `grade-08/` landing pages.
- Higher Learning uses a separately managed adult account; `Khaemenes_Academy.github.io/adult/` is the appropriate existing portal.
- High School 9–12 already has the eight-subject parent schedule mirror, but its course destinations still require server-side parent-view authorization.

## Work staged
- `assets/khaemenes-parent-learning-pathways-v1.js` exposes pure, stage-aware, verified links to existing school profiles/campuses for Pre-K through Grade 8.
- `family/index.html` renders these paths for parents with the local `progress.view` permission when the High School eight-slot schedule is inapplicable.
- Shared parent course action handler rechecks linked family membership and `progress.view` on click. It remains a normal navigation, **not** a protected read-only student impersonation session.
- `tests/parent-learning-pathways.test.cjs` covers seven representative grades, mismatched stage/grade, adult pathway exclusion, permission hooks and absence of browser writes or network I/O.

## Preservation and explicit limits
- No invented course enrollment, weekly timetable, grades or class progress; where no source snapshot exists, the portal says so.
- No learner data duplicated or moved; no changes to the actual grade-level websites.
- Opening a student profile or course is ordinary navigation and may expose editing controls if the destination doesn't enforce a true authenticated parent read-only role. That requires destination-grade hardening and T03 authenticated authority; parent-side links cannot independently enforce it.
- Higher Learning adult self-study is deliberately separate from the parent-to-child pathway.
- The Family Portal's current local registry is *not* server-authenticated access control.

## Verification performed
- Confirmed existing routes in connected GitHub source (Pre-K, KG, Elementary, Middle 6/7/8, Higher Learning adult).
- Source syntax check passed for the helper, parent inline JS, and synthetic test source.
- Isolated synthetic routing checks passed for 7 example grades, and for invalid placement and adult boundary.
- Full Node `--test`, browser interaction, offline catalog and actual cross-account permission tests still remain **unexecuted**.

## Next recommended bubbles
1. Pre-K and Kindergarten verify page-level profile links and parent-return buttons from an actual browser.
2. Elementary 1–5 audit student profile context handling on a multi-child family.
3. Middle 6–8 establish a dedicated Student Profile route if one exists before using grade landing pages as substitutes.
4. Grade-level course destinations require protected, authenticated parent-view mode; never treat local student selection as authorization.
5. Add optional centralized parent student-record export backed by verified origin inventories and, eventually, T03 durable receipts.
