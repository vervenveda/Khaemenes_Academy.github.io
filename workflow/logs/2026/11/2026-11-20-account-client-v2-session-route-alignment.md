# 2026-11-20 — Academy Account Client v2 session/logout alignment

**Type:** source repair · contract reconciliation · CI regression
**Scope:** existing Academy Core client only; no new account client, no live server, no T03 publication.

## Source changes
- Updated `assets/khaemenes-account-client.js` version `1.0.0` → `1.0.1`.
- Session now invokes `GET /v1/account/session` instead of `GET session`.
- Logout now invokes `DELETE /v1/account/session`, with **no body**, instead of `POST logout`.
- Existing `credentials:"include"`, `cache:"no-store"`, `redirect:"error"`, HTTPS guard, and default `enabled:false` remain.
- No service base URL configured or live account/session route enabled; `configure({enabled:true, ...})` remains an explicit future-only API.
- Route inventory `workflow/inventories/2026-11-20-academy-core-account-cloud-route-matrix.json` now records **SOURCE_ALIGNED_RUNTIME_UNVERIFIED**, not runtime PASS.
- Existing five-source-boundary regression cases updated; added six mocked behavior tests verifying inert default, disabling, exact session GET, exact logout DELETE, HTTPS rejection, and fail-closed error.
- CI workflow runs both suites, with no private credentials.

## Important remaining HOLDs
- `KhaemenesAcademy/Account-Cloud.github.io/contracts/ACCOUNT_CLOUD_PROTOCOL_V2.md` provides *target route names only*, not a commissioned route handler. This change does not create a service, issue identities or authenticate anybody.
- Server-side session authorization, CSRF/session expiry, supported DELETE behavior, browser CORS/cookie policies, verified second-device recovery, learner/guardian permission scopes and native STOS T03 durability all remain unverified.
- Academy Family Registry, all parent/student pages, student progress/grade records, VNV gateway, and 333 Network cloud remain untouched.
- Next priority: verify the eventual trusted server-side route and authority contract once a protected service exists; do not activate client or route aliases prematurely.

## Acceptance
Synthetic CI run outcome is recorded in a later append-only addendum after verifying the exact commit SHA.
