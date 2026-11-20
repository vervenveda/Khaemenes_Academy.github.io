# VNV Family Storage OS — Phase 1 (2026-11-20)

**SYNTHETIC / READ-ONLY. NOT COMMISSIONED.**

This is an additive module inside the existing Vervenveda Academy repository, not a second identity authority. Existing `khaemenes-family-registry.js`, grade pages and chrome remain unchanged.

- `core/retention-policy.mjs`: a deterministic *dry-run* cleanup planner for **explicitly allowlisted, reproducible, expired disposable** data only. 80%/90%/100% thresholds are proposals. The module does not call localStorage, delete, fetch, or write.
- `tests/retention-policy.test.mjs`: 15 synthetic unit checks. Run with an external test Node executable, e.g. `node family-cloud/tests/retention-policy.test.mjs`. Node is NOT an STOS runtime dependency.
- Protected records (family IDs, students, transcripts, course ZIPs, game saves, resource bookmarks, portfolios), unsynced work, uncertain commits, and incomplete assessment submissions are **never** in the disposable allowlist.
- No browser data, external storage, Account Cloud, STOS, T01/T03, or actual archive was accessed or changed.
- Future phases: inventory-only adapter (without reading private values into telemetry); protected reconciliation interface; tested authenticated upstream native service and durable encrypted receipt; recovery. Existing Account Cloud remains canonical identity authority; STOS protected storage remains sole durable backend.

**Do not wire automatic deletion until the separately reviewed authorization, retention policy, readback and recovery acceptance gates pass.**
