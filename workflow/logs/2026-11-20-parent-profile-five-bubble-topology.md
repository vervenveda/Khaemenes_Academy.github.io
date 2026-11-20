# Parent Profile · Five-Bubble Topology Audit
Date: 2026-11-20
Repository: vervenveda/Khaemenes_Academy.github.io
Scope: family/profile/, family/progress/, shared family permission and learning modules
Mode: source-level hardening and synthetic read-only tests; authenticated family browser acceptance pending.

## Canonical feature graph
Parent Portal (family/index.html) → Parent Profile (family/profile/index.html)
- Official VNV: canonical 333 ticker, autopopulating ticker, header/hamburger, translator, lower-left class tools, lower-right ecosystem tools
- Parent profile hero and eight controls (assets/khaemenes-family-parent-profile-hero.js)
- Daily Family Reports (verified Grade 09 data only)
- My Learners (Family Registry is sole identity / permission owner)
- Schedules & Progress (Academy Learning Continuation is read-only grade/progress owner)
- Full Class Grades (family/progress/parent-progress.js)
- Family identity, records, adult access and enrollment links (all continue to Parent Portal)
- Appearance editor authority remains preexisting KhaemenesFamilyParentLookStudio and the existing browser-local fallback.

## Five changes
1. Per-learner access: separate learner.view, progress.view and education.manage. Cards and click handlers recheck present Family Registry permissions. Student Profile links inside Family Learning modal withheld unless learner.view is explicit. No new access or login authority.
2. One Parent Profile presentation owner: move two page inline CSS blocks + hero's injected style template into one dedicated assets/khaemenes-parent-profile-page.css. Preserve canonical shared parent CSS. Keep existing eight-button rail; reduce redundant nav row to one Parent Portal breadcrumb; ensure official VNV header remains sole chrome owner.
3. Eight-subject class report across Grades 09–12. Parent Progress uses existing 8-course IDs, no filled-in marks. Separately groups actual quiz, test, midterm, and final scores; embedded panel includes direct full-report link. Previously truncated source snapshots no longer silently truncated to eight.
4. Daily reports: existing khaemenes-grade09-daily-parent-report-v1 is verified only for Grade 09. Explicitly mark other learner grades as having no connected daily report publisher, without fabricating dates or scores. No schema changes.
5. Official lower-left VNV class tools reused through a Parent Profile-specific config, with canonical translator moved into its Language panel; existing lower-right ecosystem toolbar remains a singleton.

## Regression and remaining holds
- `node tests/parent-profile-topology-five-bubbles.test.mjs` — PASS on review branch via GitHub Actions `Parent Profile Five-Bubble Topology`.
- Source/synthetic test: correct eight parent tools; no repeated inline CSS; CSS owner hierarchy; explicit learner.view and separate progress.view; Grade 9–12 eight subject slots; scored quizzes/midterms/finals (earned/possible only); canonical VNV script counts; legitimate portal anchors.
- Live browser HOLD: per-adult revocation in an authenticated account, tablet scroll/toolbar positioning, early/late script timing, keyboard dialog focus return, and student record publication require actual user-device testing.
- Account Cloud/STOS T03 remains uncommissioned; browser records are not synchronized. No family registry, grade/mastery, assessment, or student store was modified by these repository changes.

## Release
Source branch: fix/2026-11-20-parent-profile-five-bubbles
Release to main is subject to Academy repository permission; do not state deployed until authorized merge is verified.
