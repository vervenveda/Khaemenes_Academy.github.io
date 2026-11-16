# 2026-11-16 · Full Academy, Academy Home and Front-Door Boundaries

- **Repository:** `vervenveda/Khaemenes_Academy.github.io`
- **Types:** source audit · architecture · workflow synchronization
- **Status:** Inspection and documentation committed; no application changes, STOS write or custom-domain cutover.

## Confirmed source inspection

This is the **full Academy application repository**, not the standalone `KhaemenesAcademy/KhaemenesAcademy.github.io` front door. The source currently includes `academy/`, `adult/`, `family/`, `student/`, `teacher-admin/`, `assets/`, `offline/`, `shared-integration/`, `tests/`, `tools/`, `diagnostics/` and an existing `workflow/` archive.

The main `index.html` includes 48 static links, four button declarations and approximately 40 KB of HTML. It references local Academy integration modules, learning continuation, personalization, account readiness, the universal toolbar and external VNV tickers.

Academy Home (`vervenveda/KhaemenesAcademy_Home.github.io`) exposes a similar visitor experience but currently references core Academy modules through published absolute URLs. Keep the differences intentional until tested.

## Architecture decision

- Full Academy: application features, progress, assessments, learner-facing integrations and canonical module provenance.
- Academy Home: dedicated landing/entry workstream; maintain its own log and never silently override its interface.
- Academy front door: lightweight entry, no duplicate learner databases or assessment engines.
- STOS: future native sovereign endpoint. **No commissioning, bridge activation, profile migration, cloud synchronization or elevated authorization is implied here.**

## Acceptance criteria for future triangulation

- [ ] Written source-of-truth table per asset and data class.
- [ ] Stable source Git SHA and independent content digest.
- [ ] Offline, identity, learner privacy, adult permissions, authorization and denial tests.
- [ ] Dry-run differential report with conflict handling and no unintended modifications.
- [ ] Separate explicit approval before STOS writes or domain changes.
- [ ] Known-good rollback with archived hashes and validation evidence.

## Current work boundary

This audit adds only dated workflow documentation. It does not infer that STOS T03 is commissioned or that any current personal browser storage is a validated cloud.

Cross-reference the full VNV archive at `vervenveda/vervenveda.github.io/workflow/` and the Academy Home archive in its own repository.
