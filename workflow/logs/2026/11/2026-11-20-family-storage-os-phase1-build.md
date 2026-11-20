# Family Storage OS — Phase 1 Implementation (2026-11-20)

Status: SOURCE COMMITTED, PURE-LOGIC SYNTHETIC CHECKS 15/15 PASS, INDEPENDENT NODE/REAL-BROWSER REGRESSION PENDING, LIVE PERSISTENCE HOLD.

## Scope
After the 40-repository Vervenveda account inventory, user authorized building a shared Family Storage OS in the existing `vervenveda/Khaemenes_Academy.github.io` repository. This first phase builds an isolated VNV-style demonstrator and a pure retention policy module; **no existing family profile or course page was modified**.

## Additive files
- `family-cloud/core/retention-policy.mjs`: pure dry-run candidate planner; no storage access, fetch, deletion, dynamic native runtime or credentials. Only allowlisted expired reconstructible cache types can be considered; authoritative/pending/protected/unsynced entries are excluded.
- `family-cloud/tests/retention-policy.test.mjs`: independent runnable 15-case Node test suite; not yet executed from the actual committed files under Node, pending separate test checkout or Mac run.
- `family-cloud/index.html`: standalone synthetic-only accessible interface with VNV charcoal/cream, 7px corners, responsive 2-column design and simulated pressure slider. All example records fictitious; module never reads browser storage.
- `family-cloud/README.md`: isolation, known limitations and future gates.

## Test evidence
Pure policy function executed in the development JS environment with **15 of 15** PASS (under threshold, at threshold, protect lessons/family/pending, exclude unexpired, capacity hold, no deletion, duplicate IDs, unknown kind, unsynced, protected, authoritative, bad quota, 90% policy). This is **not** an independent run of the committed Node test suite and **not** a real browser runtime smoke test.

## Security and continuity
Permanent protected records (family accounts, learner profiles, assessments, bookmarks, game saves, transcripts, family portfolios) and unsynced work cannot be automatically evicted. No automatic deletion is implemented. No Account Cloud backend is connected; no actual encryption, cloud preservation, receipt, T01 authority verification, T03 commissioning or cross-device sync claimed. 80/90/100 quota thresholds are prototype values only.

## Next gates
1. Execute `node family-cloud/tests/retention-policy.test.mjs` in a clean checked-out repo or owner Mac; inspect browser prototype.
2. Add safe record taxonomy/metadata-only interoperability contract for the existing Academy family registry and High School source readers; preserve Pearl family local storage unchanged.
3. Verify authenticated T01 -> Account Cloud native service and durable encrypted STOS backend with fully synthetic families and two devices.
4. Only after authorization, receipt and recovery tests consider staging account linkage and explicitly approved cleanup execution.

NO real student/family values opened; no live STOS or existing Academy landing page modified.
