# Khaemenes Academy · Terminal 04 Readiness

Status: **DORMANT / NOT COMMISSIONED**

This repository now includes a public-safe readiness layer for the future Khaemenes Academy Terminal 04 connection. It does **not** activate a terminal, connect to STOS, create a network transport, or move Academy account data into STOS storage.

## Current Academy priorities

The Academy remains usable before Terminal 04 is live:

- public learning stays available;
- family, learner, and Adult Scholar profiles remain Academy-owned;
- learner continuation and mastery remain course-owned;
- Archaemenes remains advisory and does not award mastery;
- parent summaries remain read-only;
- local-first browser continuity continues to work where supported.

## Parent experience

The Family Portal now includes a **Parent Action Center** above the existing records/support layer.

It organizes existing Academy summaries into:

- **Needs attention** — corrections, stale continuation records, formal mastery gates, family-attention flags, assessment-next states, and due spaced review;
- **On track** — courses with a clear next step and no current family hold;
- **Celebrate** — completed course snapshots or recorded mastery at/above the course threshold.

Parents can open a **Weekly Family Brief** or export a sanitized JSON summary.

The parent layer never changes:

- grades;
- mastery;
- placement;
- learner identity;
- family permissions.

The weekly brief excludes private learner reflections, child conversations, assessment responses, and answer keys.

## Terminal 04 readiness contract

Files:

```text
assets/khaemenes-terminal04-readiness.js
shared-integration/terminal-04-academy-readiness.json
```

The adapter currently reports:

```text
terminalId: 04
live: false
commissioned: false
transport: unconfigured
canTransmit: false
canActivate: false
networkIO: false
stosStorageWrites: false
academyStorageSeparate: true
```

The adapter can build a bounded Academy continuity envelope **only when explicitly called by code on the page**. It does not transmit that envelope.

The envelope contains only bounded continuity information such as stable runtime family/learner IDs, placement summary, course continuation summary, mastery summary, stale-record state, and family-attention flags.

It excludes passwords, email addresses, private learner reflections, child conversations, assessment responses, answer keys, raw browser storage, STOS secrets, and network endpoints.

## Storage boundary

Khaemenes Academy account/profile continuity and STOS remain separate authorities.

Terminal 04 readiness does not write to any STOS namespace and does not relabel Academy browser storage as STOS storage.

Any future live integration must preserve that separation.

## Required cutover gates

Terminal 04 must remain dormant until all of the following are true:

1. Terminal 04 is separately commissioned.
2. Protected authenticated transport is configured outside the public repository.
3. Academy account storage remains separate from STOS storage.
4. Family and learner permissions are revalidated at handoff.
5. Academy regression workflows are green.
6. A rollback path has been verified.

## Regression protection

Workflow:

```text
.github/workflows/academy-parent-terminal04-readiness.yml
```

Test:

```text
tests/parent-terminal04-readiness.test.mjs
```

The regression test protects the parent read-only boundary, privacy exclusions, dormant Terminal 04 state, storage separation, portal coverage, and the canonical single Beta doorway in Teacher Administration.
