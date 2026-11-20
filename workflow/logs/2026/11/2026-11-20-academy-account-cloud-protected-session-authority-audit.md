# 2026-11-20 — Academy ↔ Account Cloud v2 protected session authority verification

**Type:** forensic backend audit · targeted compatibility repair · synthetic regression
**Scope:** Academy Core disabled client and private Account Cloud contract only. No live authentication, native adapter or account data touched.

## Source evidence (read-only)
1. Academy Core `assets/khaemenes-account-client.js` version 1.0.1 already mapped `GET /v1/account/session` and `DELETE /v1/account/session` but projected a legacy `familyId` and `permissions` shape, unlike private Account Cloud `contracts/SESSION_VIEW_CONTRACT_V2.md`.
2. Private `KhaemenesAcademy/Account-Cloud.github.io/contracts/SESSION_VIEW_CONTRACT_V2.md` specifies a **display-only** `wend-v0.1` session view: `actorType`, `adultId`/`learnerId`, `familyIds[]`, `learnerIds[]`, `displayPermissions[]`, expiry, and `authorizationAuthority=false`. Browser roles/metadata never authorize actions.
3. Private `contracts/WEND_SESSION_BOUNDARY_V1.md` and `contracts/AUTHORITY_MODEL_V2.md`: Wend cookie boundary; Bunya/member authority; Klik policy; Avouch validation; commissioned STOS protected persistence. Independent server check required for each protected operation. Account Cloud does not own cookie/session secrets.
4. Private `assets/account-cloud-client.js`: `createHttpTransport` already uses those session routes, and has a separate **synthetic** transport/store. Static contract routes are not proof of an active HTTP handler.
5. Current inspected `artist1970/nextjs/server.mjs` Git blob `2cc161c64f21766092d05a09bfadab0047c00a12`: no `/v1/account/session` route or `/api/v1/ohmic/member-auth` handler in inspected root entrypoint. The prior Nov 18 verified source audit similarly identifies missing member-auth linkage in checked server source. No inference about uninspected/private deployed processes.
6. T03 protected service commissioning and cross-device authenticated adult/student tests remain HOLD.

## Source repair
- Existing Academy Core client bumped to version 1.0.2; `safeSession` now projects v2 display fields, ignores `role`, `roles`, `metadata` and legacy `permissions`, never grants authorization, and requires v2 session boundary and `authorizationAuthority=false` before displaying authenticated state. Sensitive secret-key detection retained.
- Configuration remains **disabled by default** with no service URL. Session projection is a display-only parsing rule, never authentication proof.
- Added five synthetic session-view tests and expanded the existing CI job. The source-only route matrix now records client v1.0.2 and explicitly `DISPLAY_PROJECTION_SOURCE_ALIGNED_RUNTIME_UNVERIFIED`.

## Required next protected gates
1. Independently verify commissioned upstream member-auth authority, Wend session issuance/expiry and server handler `GET /v1/account/session`, `DELETE /v1/account/session`.
2. Ensure logout invalidates the actual server session and cannot be undone by reusing old cookies.
3. Enforce per-learner guardian authorization through Klik/Avouch on **server**, never from `displayPermissions[]`.
4. Verify real CSRF/CORS/cookie origin safeguards, session fixation prevention and logout error handling.
5. Require T03 durable namespace/transaction/recovery and two-device evidence before enabling protected parent/student reads.

**Status:** source client shape improvement committed. CI result to be added only after the exact SHA runner finishes. No browser or production acceptance claimed.
