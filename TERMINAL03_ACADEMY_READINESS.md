# Khaemenes Academy · Terminal 03 Readiness

Status: **PRIMARY ACADEMY TERMINAL / HOLD / NOT COMMISSIONED FROM THIS REPOSITORY**

Terminal 03 is the primary and only terminal designation for Khaemenes Academy.

Terminal 04 has no Khaemenes Academy authority and is reserved for separate future delegation outside this Academy repository.

This public repository contains only a bounded readiness contract. It does **not** activate Terminal 03, commission STOS, create a network transport, or move Academy account data into STOS storage.

## Live Academy protection

The Academy remains fully usable while Terminal 03 is prepared:

- public learning remains available;
- current student, family, teacher, Adult Scholar, mentor, and curriculum routes remain unchanged;
- family, learner, and Adult Scholar profiles remain Academy-owned;
- learner continuation and mastery remain course-owned;
- Archaemenes remains advisory and does not award mastery;
- parent summaries remain read-only;
- local-first browser continuity continues where supported.

No public-repository readiness file grants terminal authority or changes live learner state.

## Terminal 03 readiness contract

Files:

```text
assets/khaemenes-terminal03-readiness.js
shared-integration/terminal-03-academy-readiness.json
```

The adapter reports:

```text
terminalId: 03
academyTerminalPrimary: true
academyTerminalExclusive: true
live: false
commissioned: false
transport: unconfigured
canTransmit: false
canActivate: false
networkIO: false
stosStorageWrites: false
academyStorageSeparate: true
```

The adapter can build a bounded Academy continuity envelope only when explicitly called by page code. It does not transmit the envelope.

The envelope excludes passwords, email addresses, private learner reflections, child conversations, assessment responses, answer keys, raw browser storage, STOS secrets, and network endpoints.

## Authority boundary

Terminal 03 is the Academy terminal designation, but this repository does not commission it.

The following remain unchanged until a separate STOS commissioning process explicitly proves otherwise:

- Academy account/profile authority;
- course mastery authority;
- learner placement authority;
- family permissions;
- curriculum routing;
- live classroom behavior.

Terminal 04 is not an Academy fallback, secondary terminal, or migration target.

## Required cutover gates

Terminal 03 remains on HOLD until all of the following are true:

1. The current GitHub Academy repository is crossover-certified.
2. The exact certified repository tree is migrated into STOS.
3. GitHub ↔ STOS tree parity is proven.
4. Protected authenticated transport is configured outside the public repository.
5. Academy account storage and STOS storage boundaries are explicitly certified.
6. Family and learner permissions are revalidated at handoff.
7. Academy regression workflows are green.
8. A rollback path is verified.

## Regression protection

Workflow:

```text
.github/workflows/academy-parent-terminal03-readiness.yml
```

Test:

```text
tests/parent-terminal03-readiness.test.mjs
```

The regression contract protects the current parent/family boundaries, privacy exclusions, non-commissioned state, storage separation, and the exclusive Academy → Terminal03 designation.
