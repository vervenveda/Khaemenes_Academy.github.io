# 2026-11-18 · Academy Home → Full Academy source handoff

- **Repository:** `vervenveda/Khaemenes_Academy.github.io`
- **Types:** audit · decision · follow-up
- **Mode:** Read-only application inspection; this workflow entry is documentation only
- **Status:** Source audit completed; production/browser/cloud commissioning HOLD

## Verified baseline
- Public Full Academy main branch: 267 Git-tree entries, non-truncated.
- `index.html` blob SHA: `60eda8fe05a9282ee5d29f09060045c06b8825b8`.
- Independent front door: `KhaemenesAcademy/KhaemenesAcademy.github.io` (private), `index.html` blob SHA `3ddfbdd9ea86ef60a7854cf1708f8119341517a8`.
- Existing full Academy source documentation: `FRONT_DOOR_PROTOCOL_V2.md`, `FRONT_DOOR_PHASE_STATUS.md`, `TERMINAL03_ACADEMY_READINESS.md`.
- Existing anonymous public route probe: `scripts/verify-public-academy-routes.mjs` and `.github/workflows/academy-public-delivery-verification.yml`.

## Source-of-truth decisions
- Full Academy owns account, family, student, adult, teacher, mentor, placement, local-first continuation and authorization-adjacent UI behavior.
- Academy Home remains an independent public-facing lightweight doorway and does not own a parallel registry.
- VNV shared assets own canonical tickers, header/menu and ecosystem toolbar.
- Course engines own grades/mastery; STOS owns native terminal authority only after separate verified commissioning.
- The two home index implementations have different canonical URLs, module roots and global-standard loaders. Do not overwrite one with the other.

## Source findings
1. `assets/academy-core-global-standard-v1.js` dynamically loads and mounts VNV chrome, while `index.html` separately includes VNV scripts. Consolidate only after regression checks for exactly one rendered instance.
2. The core standard runtime enforces font size through DOM scans and a MutationObserver; migrate the 16px typography floor into stable CSS and check load/performance.
3. `assets/khaemenes-account-connection-status.js` explicitly labels learner records LOCAL and reports `serverVerified:false`. Preserve this fail-closed communication until real authentication proof.
4. `assets/khaemenes-terminal03-readiness.js` declares `LIVE=false`, transport unconfigured and no STOS writes. `buildEnvelope()` repeats the `adapterVersion` key in one object; harmless in current JavaScript but should be tidied under a reviewable maintenance patch.
5. `assets/khaemenes-front-door-router.js` routes Grades 09–12 to profile entry points and does not grant NAIB grade/placement/mastery authority. Existing static/fictional learner tests inspect this behavior, but do not prove cross-origin/browser persistence.
6. `scripts/verify-public-academy-routes.mjs` probes anonymous HTTP delivery including the separate Academy Home URL; it cannot prove dynamic navigation, accessibility, account security or cross-device continuity.
7. `TERMINAL03_ACADEMY_READINESS.md` documents Terminal 03 HOLD, not commissioned; no migration/cutover authorized.

## Next recommended implementation order
1. Verify real deployed Home URL and publishing artifact; do not modify STOS Pages pipeline during this step.
2. Create a route/dependency matrix for all four Academy doorways, including safe unavailable-state behavior.
3. Consolidate ticker/header/toolbar mounting on each repo with isolated tests; preserve origin differences.
4. Apply source CSS readability, symmetry, mobile landscape and keyboard controls; rendered-browser validation required.
5. Add end-to-end anonymous/public and authenticated-fictional tests without touching real learner data.
6. Record checksums, feature-owner map, tests and rollback before any contemplated STOS triangulation.

## Safe-state assertion
This documentation does not change executable assets, accounts, learner records, curriculum, hosting, DNS, custom-domain ownership, STOS services, or the Terminal 03 commissioning state.
