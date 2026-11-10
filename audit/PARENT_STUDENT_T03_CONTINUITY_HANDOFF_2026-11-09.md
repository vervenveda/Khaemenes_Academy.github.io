# Parent ↔ Student ↔ STOS T03 Continuity — Implementation Handoff
Date: 2026-11-09
State: **PREPARE_ONLY / NOT LIVE**; staged on `hardening/parent-student-schedule-mirror-2026-11-09`.

## Goal
Use the same family, learner, course and record identity across Parent Portal, Student Profile, student schedule, and the authorized Academy Account Cloud on STOS Terminal T03. Once an authenticated T03 session and durable backend exist, future learning events can be synchronized through one protected account authority without requiring every family to export files manually.

**Historical browser-only data cannot be recovered centrally without at least one authorized transfer from each original device/browser/origin.** The planned first transfer may eventually use a secure in-app migration instead of a manual download, but only after ownership verification and testing. Do not delete legacy data during migration.

## Implemented in review branch
1. Parent schedule mirror: `assets/khaemenes-parent-schedule-mirror-v1.js`; available slots, actual published progress, permission-checked visit buttons, and Student Profile links on `family/index.html`.
2. Shared preparation contract: `assets/khaemenes-t03-continuity-contract-v1.js`.
3. Synthetic checks: `tests/parent-schedule-mirror.test.cjs` and `tests/t03-continuity-contract.test.cjs`.

The preparation contract is pure: it accepts source *descriptors* only, checks family/learner equality, HTTPS source origin, record type, source key and provenance, and returns a bounded data-free intent. It carries no student content, passwords, exports, grades, encrypted archives or bearer credentials.

## Proposed future authority boundary

Browser:
- Can create offline drafts and mutation intents under the selected learner's local context.
- Must retain original evidence and an outbox until a server-verified durable receipt is acknowledged.
- Must not regard browser-selected adult role as authenticated authorization; no impersonation.
- Must not self-certify academic mastery, erase records, overwrite another learner, or forge receipts.

Protected T03 Account Cloud:
- Authenticates adults and learners, applies family/learner ACL and adult permissions.
- Resolves source ownership and collisions; unknown legacy PE records remain quarantined.
- Accepts idempotent versioned changes through a single recoverable record + audit + mutation-receipt transaction.
- Returns signed/authenticated durable receipts bound to account, learner, mutation, record digest and generation.
- Supports read-after-write, cross-device read, version conflicts, recovery and explicit deletion policy.
- Promotes verified academic evidence only according to course/teacher authority, independently of browser self-scores.

Parent Portal:
- Reads the same learner's schedule, profile, next course, daily reports and authorized academic summaries using the shared identity.
- Receives read-only access via authenticated adult permissions; actual protected course views must enforce it.
- Can request a full authorized family/student archive through T03 only when source coverage and privacy controls are verified.

## Required rollout sequence
1. Retain all browser-local records. Inventory course producers, storage origins, source revisions and learner provenance.
2. Finish protected T03 repository binding, identity divergence resolution, authenticated account/session endpoints, and atomic record+audit+receipt storage. Protect Terminal T01.
3. Implement a single account-continuity transport and offline outbox with non-destructive retries and idempotency. Stage with wholly synthetic learners.
4. Test 2-device synchronization, offline edits, disconnections, concurrent parent/learner access, conflict resolution, permissions and restore.
5. Pilot consented learner migration from original browsers; verify record coverage and reversible fallback before promoting live.
6. Keep user-readable report export as an optional safety net even when automatic continuity is active.

## Non-negotiable holds
`LIVE=false`, `TRANSPORT=unconfigured` in the existing Terminal03 readiness adapter are preserved. The new JS module has no network or browser-storage I/O, cannot upload, and never accepts a receipt as authenticated solely from its shape. Do not wire it as a live account service until the protected backend team verifies commissioning.

## Current verification
New module and synthetic test sources are committed; source syntax and isolated synthetic runtime inspection can be performed through GitHub connection. Full Node/browser tests, backend transaction recovery, authenticated server receipts and live synchronization have **not** been completed. No learner records were read, exported, uploaded or changed by this contract.
