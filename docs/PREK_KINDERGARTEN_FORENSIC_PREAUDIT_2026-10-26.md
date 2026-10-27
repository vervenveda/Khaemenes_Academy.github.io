# Khaemenes Academy — Pre-K → Kindergarten Forensic Pre-Audit
Date: 2026-10-26
Branch: main only
Scope: Pre-K campus, Kindergarten campus, Family Registry handoff, teaching depth, assessments, graduation, mentor context, profiles, printables, routes, CI, and privacy.
Classification: SOURCE-AUDITED / CI-EVIDENCE-REVIEWED. The current production site has NOT passed a fresh end-to-end live-browser certification in this audit.

## Canonical repositories and boundaries
- Pre-K: `vervenveda/Khaemenes_Preschool.github.io` (public Crechè home, catalog, graduation, learner profile).
- Kindergarten: `vervenveda/Khaemenes_KinderGarden.github.io` (36 units/180 daily lessons, formative tools, learner-scoped formal mastery).
- Family Registry and central Mentor: `vervenveda/Khaemenes_Academy.github.io`.
- Public campus URL casing: `https://vervenveda.com/Khaemenes_KinderGarden.github.io/` (preserve existing established route).
- Canonical academic identity: Family Registry; canonical mentoring: Archaemenes; navigation: NAIB; Kindergarten formal mastery authority: existing learner-scoped mastery-gates engine. These must not be replaced.
- No runtime files, stylesheet, lesson, assessment, or learner record were modified by this audit.

## Positive source and CI evidence
1. Pre-K guest activities are intentionally open; formal personalized mentoring requires linked Academy learner identity. The graduation certificate is explicitly a participation keepsake, NOT proof of readiness or formal mastery.
2. Kindergarten has all 36 numbered lesson-unit route files, 36 formal content pages, weekly assessment gate aliases, local tools, profiles, and a separate guardian-release form requiring seven acknowledgments.
3. Kindergarten mastery requires >=80% performance with explicitly satisfied essential criteria and adult affirmation; unowned legacy percentages cannot unlock. Later units have daily evidence gates. Official readiness requires 36/36 weekly passes, midterm, final, and portfolio.
4. The existing Pre-K -> Kindergarten single-learner journey test checks preserving one learner ID, a separate Kindergarten release, sibling isolation, and graduation continuity. Its celebration/graduation path uses an explicit fictional/mocked mastery authority fixture; it is not production credential verification.
5. Latest successful public CI check evidence on 2026-10-24 (UTC):
   - Preschool catalog smoke: https://github.com/vervenveda/Khaemenes_Preschool.github.io/actions/runs/40046712450
   - Preschool source regression: https://github.com/vervenveda/Khaemenes_Preschool.github.io/actions/runs/40046712362
   - Preschool profile/browser: https://github.com/vervenveda/Khaemenes_Preschool.github.io/actions/runs/40044862235
   - Kindergarten regression: https://github.com/vervenveda/Khaemenes_KinderGarden.github.io/actions/runs/40046956189
   - Pre-K -> Kindergarten journey: https://github.com/vervenveda/Khaemenes_KinderGarden.github.io/actions/runs/40046956199
   - Kindergarten formal gate: https://github.com/vervenveda/Khaemenes_KinderGarden.github.io/actions/runs/40046708681
   - Kindergarten graduation browser: https://github.com/vervenveda/Khaemenes_KinderGarden.github.io/actions/runs/40044903174
   - Kindergarten Pages deployment: https://github.com/vervenveda/Khaemenes_KinderGarden.github.io/actions/runs/40046956593

## Five bubbles in the current source — NOT fixed by this audit

### Bubble 1 — Pre-K linked-family vs optional-local-profile mismatch (high priority)
`index.html` uses `effectiveLearnerId() = activeAcademyLearner()?.learnerId || profile?.learnerId`, but `learnerKey()` for favorites, visits and preference ownership depends only on `profile?.learnerId`. `syncMentorContext` stamps the Academy learnerId while copying `favorites` and `visited` drawn from the separate optional profile. Switching the Academy active child without switching the optional Pre-K profile risks associating one child's favorites/visit summary with another learner. Preserve both data stores; join only after exact matching IDs, otherwise present a clear learner-specific fallback, never silently migrate.

### Bubble 2 — Pre-K shared home-dashboard activity and daily completion records (high priority)
`index.html` stores `khaemenes_preschool_visit_log_v1` and `khaemenes_preschool_observations_v1` as shared arrays with event entries lacking learnerId. `khaemenes_preschool_progress_v1` stores completed activities by calendar date, not learner, while the plan itself carries a learnerId. Children using the same browser on the same day can inherit home-dashboard activity/mentor-plan completion from another child. The separate `preschool-learner-storage.js` scopes nonsystem app keys, but explicitly treats `khaemenes_*` as system keys, so it does not solve these keys. A versioned, non-destructive, per-learner envelope and opt-in/clearly isolated guest mode is needed; keep legacy records quarantined until owner confirmation.

### Bubble 3 — Pre-K derived mentor context persists on an identity mismatch (medium)
`index.html` `syncMentorContext` returns without clearing the prior `khaemenes_preschool_mentor_context_v1` when no learnerId is available and can use a local-profile fallback. This permits a stale cache to remain in same-origin localStorage; central Academy Mentor currently checks learner IDs when reading context, which mitigates unauthorized use, but the publisher should also clear outdated *derived* context on logout/switch and never overwrite with an unconfirmed profile. Do NOT delete academic evidence or guest play records.

### Bubble 4 — Kindergarten daily evidence vs weekly 80% instructional wording drift (medium)
Existing `assets/khaemenes-kinder-mastery-gates.js` allows later daily lessons on earlier completed daily evidence; the >=80% threshold is assessed on the weekly observed rubric. Some campus copy says a current lesson's own mastery check must reach 80% to open the *next lesson*. Clarify daily-completion vs formal weekly mastery without changing the gate. The formal-gate header comment describes Weeks 5–25 as strict daily sequences, while the actual `DAILY_SEQUENCE_UNITS` set covers Weeks 5–36; explain the adult-affirmed capstone extension explicitly. Correct copy/documentation only after a comparison of exact lesson UX.

### Bubble 5 — STOS-bound direct-route certification and complete 36-week pedagogical review remain open (release-critical)
Mastery gate and experience files reference `/stos/khaemenes/.../` absolute paths. Historical audit `FORENSIC_REMEDIATION_LOG_2026-10-22.md` identifies live STOS route readiness as uncommissioned without a configured deployment probe. Successful GitHub Pages publication and intercepted Playwright regression routes do not alone prove all production STOS routes work. Separately, `KINDER_FRESH_FORENSIC_AUDIT_2026-10-23.md` records the 36-week seven-dimension depth review as unfinished, especially Weeks 1–4 and 31–36. These must be certified rather than assumed to be broken or complete.

## Acceptance plan — preserve what works
- Stage A: Non-destructive Pre-K family-linked identity, favorites, visits, observations, daily-plan and reload regression for **two fictional children plus a guest**, including local legacy-record migration without cross-ownership.
- Stage B: Pre-K graduation mini-games and keepsake -> *existing* child enrollment change -> seven-acknowledgment Kindergarten guardian release, revocation, and same-ID reload.
- Stage C: Kindergarten Week 01 five-day observed learning -> completed evidence -> weekly rubric at 79%, then 80% without essential criteria, then authorized qualified >=80% pass -> next week; check early- and late-week policy as actually authored.
- Stage D: Midterm/final/portfolio scope, provisional graduation certificate, export/print, keyboard-only, screen reader, 255px viewport, reduced motion, storage quota and cross-tab switching.
- Stage E: Verify deployed production route responses for required STOS endpoints and canonical Pages URLs without artificial route interception. Complete seven-dimension day-by-day review of all 180 Kindergarten lessons (the report does not claim this has been performed).

## Status
Audit record committed only; no student-facing repairs and no curriculum changes authorized or performed here.
