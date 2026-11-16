# 2026-11-16 · Parent Portal and Parent Profile Button Response
- Repository: `vervenveda/Khaemenes_Academy.github.io`
- Date: 2026-11-16 · America/New_York
- Type: audit · repair · follow-up
- Status: code changes committed; live browser verification HOLD

## Report and routing
User observed Family/Parent Portal and Parent Profile controls requiring three or four taps. The separate `vervenveda/KhaemenesAcademy_Home.github.io` front door links to this full Academy's `family/` page. The Home repository has no independent parent profile.

## Source evidence
- `family/index.html` called `render()` synchronously in response to `khaemenes-family-changed`. `chooseLocalLearner()` calls registry `setActive()`, which dispatches that event synchronously; rendering replaces `#familyApp` and handlers during click processing.
- The selection of active learner originally used `$("[data-active]").forEach` rather than `$$`; with multiple learners, this first-selector function does not return an iterable.
- Parent Hero mounting previously required two sections to be immediately adjacent, which was brittle when other modules inserted content.
- Parent Profile “Schedule” and “Class Progress” targeted the same section; “Edit Profile” only edited local presentation.

## Committed repairs
- `c29751a1f9dd97909efa7000fe471bf53091d4e1`: defer/coalesce registry-related renders and correctly bind all active-learner buttons.
- `d51150c6a9da3a5bf2e2bf1a2d883bbc4a453af8`: relax profile mounting adjacency, clarify profile tool labels, explain destinations, improve link labels, and fall back to existing local editor if universal editor fails.

## Validation and holds
- Source JavaScript syntax checked for both edited files: PASS.
- Actual single-tap desktop/tablet operation: NOT RUN.
- Authenticated parent permissions, family backup/restore, responsive layering, and deployed page acceptance: HOLD.
- No learner records, family data, academic grades, account permissions, STOS bindings, or local storage were modified.

## Next
Run single-tap checks for family account selection, student profile links, profile editor, family backups and enrollment; then conduct a centered VNV/KA design and mobile layout pass. Do not claim the symptom is resolved until device testing succeeds.
