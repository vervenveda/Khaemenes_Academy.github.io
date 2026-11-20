# Academy Core → Account Cloud: parent–student continuity interface audit
**Date:** 2026-11-20 · **Mode:** read-only forensic audit; integration HOLD.

## Source topology inspected
- `family/enroll/index.html`: four-step provisional guardian/learner enrollment; calls `KhaemenesFamilyRegistry`, `khaemenes-institutional-id.js` and the local router. Explicitly says enrollment is local and unverified; does not take passwords or verified contacts.
- `assets/khaemenes-family-registry.js`: browser `localStorage` family/adult/learner registry and active selectors; `createFamilyIntake`, `registerLearner`, `canAdult`, `setActive`; local duplicate detection and write-readback present. These IDs, selections and permissions are **not** authenticated or globally authoritative.
- `family/index.html` and `family/profile/index.html`: guardian-selected profiles, local backup, progress access and readiness notices; cloud sign-in explicitly uncommissioned.
- `student/index.html`, `student/profile.html`: learner selection, class continuation and local pinning. Student privacy lock explicitly inactive until protected credentials exist.
- `family/progress/parent-progress.js` and `family/enroll/family-progress-export-v1.js`: local per-learner progression and provisional exports; unverified grades must not turn into a transcript.
- `assets/khaemenes-account-client.js`: separate disabled HTTPS/cookie client, exposing `configure`, `session`, `logout`, `status`; no actual live server configured.
- `assets/khaemenes-account-connection-status.js` and `family/ACCOUNT-CONTINUITY-READINESS.md`: explicitly local-only connection status and pending server authentication.

## Five gates to close (not all confirmed defects)
1. **Authority separation — verified HOLD.** Browser Family Registry `canAdult` is only local UX permission; protected reads/mutations require Wend session and Klik/Avouch authorization under the private Account Cloud contract. Never convert local selection to a server credential.
2. **Enrollment reconciliation — verified HOLD.** Provisional family/learner and institutional IDs are created locally. Server-issued stable identity, duplicate prevention across devices, verified parent claim and recordVersion/baseVersion reconciliation remain unverified.
3. **Client route compatibility — confirmed interface mismatch to reconcile before enabling.** Academy Core browser client uses relative `session` and POST `logout` calls. Account Cloud v2 lists target `GET /v1/account/session` and `DELETE /v1/account/session`. No verified mapping or adapter is currently evidenced. Do **not** rewrite the live client before confirming the commissioned router.
4. **Assessment and portfolio provenance — verified HOLD.** Parent progress and CSV are local, provisional and uncategorically *not* certified transcripts. Account Cloud must mirror only confirmed course-owned evidence, preserve grades/scores and stale/conflict markers, and never issue a mastery decision.
5. **Cross-device persistence and recovery — verified HOLD.** `localStorage` spans only this browser profile/origin; no authenticated durable STOS T03 exchange, audit receipt, idempotent migration, full course ZIP restore or Mac/tablet acceptance demonstrated.

## Academy-only integration staging
- Owner-facing public routes: `family/enroll/`, `family/profile/`, `family/progress/`, `student/`, `student/profile.html`.
- **Source contracts**: keep VNV `SOURCE_PROVENANCE_REVIEW` caller independent; it does not move learner data.
- **Protected service owner**: private `KhaemenesAcademy/Account-Cloud.github.io` + commissioned STOS T03; no second browser account database.
- **Admission prerequisites**: independently authenticated adult, learner-scoped grants, institutional ID reservation and conflict checks, receipt durability, status fail-closed, verified second-device continuity, privacy-safe audit, and explicit operator acceptance.
- Network/333/other VNV repos excluded from this Academy-only scope.
- Until native service proven, preserve the existing local-only UX and export; never auto-upload, prompt for passwords on public Pages, or claim registration succeeded in Account Cloud.

## Evidence/limitations
Direct source files inspected on the connected VNV GitHub account, not a live browser session. The statement that cloud connection is unavailable is also explicit in checked-in user-visible status and readiness documentation. No modifications to current pages, records, runtime configuration, T03 or other service terminals.

## Next recommended non-destructive verification
Establish a strict **route compatibility matrix** between Academy Core's disabled client and Account Cloud's v2 contract, with synthetic negative tests. Do not enable network requests or migrate family records until the independently commissioned native adapter exists.
