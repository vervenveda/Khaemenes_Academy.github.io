# Academy Family Intake — Security and Persistence Acceptance Contract

**Status:** Design and test contract only. No live account authority is commissioned by this document.  
**Scope:** Public Family Enrollment, family registry, learner placement, account connection status, and authenticated account handoff.  
**Safety:** Keep existing local records intact. No production credential material or private terminal implementation belongs in this public repository.

## Enrollment types and truthfulness

| State | Permitted outcome | Must not claim |
| --- | --- | --- |
| Visitor | Explore public learning without registration | Enrolled student |
| Local profile (legacy) | Continue existing device-local learning, clearly labeled | Verified identity, cloud persistence |
| Pending intake | Save a recoverable, *non-authoritative* draft if clearly labeled | Completed family/student enrollment |
| Guardian verified | Adult authentication, contact control, and required parental consent evidenced by the authorized service | Proof of legal guardianship based on an email code alone |
| Student enrolled | Authorized learner/family association with durable, readback-verified receipt | Enrollment based only on client-created IDs |
| Beta/test | Isolated test data, explicitly excluded from official reporting | Official enrollment or academic transcript |

An unreachable account authority MUST leave requests pending or unavailable, not silently fall back to official local enrollment. Public educational content remains freely available.

## Intake fields, scoped by need

**Adult / family:** Preferred family display name; adult name suitable for official communications (support legal mononyms); preferred name; parent/guardian/caregiver/educator role; contact email under verified control; optional phone; country or region needed for age/consent policy; language/accessibility preference. Do not expose contact details publicly.

**Learner:** Name suitable for education records, chosen display name, age-eligibility information (collect exact birth date only if justified), educational stage and requested grade, prior grade, enrollment track (full pathway, supplemental, beta), guardian relationship, optional accessibility support request collected through a protected channel.

**Academic enrollment:** Original placement evidence and its source, grade selection, mathematics readiness/placement, course choices, electives, schedule, and prior credits if relevant. Never assume placement from a nickname; never discard previously earned results without explicit authorized correction.

**Consent:** Versioned privacy notice; guardian identity and permission assertions reviewed by server; consent method, time, scope and withdrawal mechanism. Under-13 processing must follow applicable child-privacy requirements. Minimize child data and do not require public profile creation.

**Credentials:** Passwords, passkeys, authentication factors, tokens, account recovery secrets, and verification codes must never be stored in browser localStorage, exported family JSON, or public GitHub. Authentication and recovery belong to a protected service.

## Server-authoritative transaction

1. Begin an authenticated adult enrollment request; rate limit and protect against automated abuse without denying reasonable access.
2. Verify contact control, adult authorization and age-appropriate consent through approved workflows.
3. Check for an existing account/family/learner using authorized records, with manual review for ambiguous matches; never merge solely by name, email string or grade.
4. Create or associate the family and learner within the appropriate family storage boundary using an idempotency key.
5. Persist family, relationships, scoped permissions, learner, placement provenance, and audit event as one durable transaction or a recoverable staged transaction with explicit finalization.
6. Independently read back the committed data and generate an authenticated receipt including scope, record version, timestamp and non-secret reference.
7. Display **Enrolled** only when the authoritative service confirms success. Failed/unavailable operations remain pending or fail closed.
8. Reopen from a separate authorized session/device and verify the same account and learner-scoped records; test logout, revocation, conflict recovery, and isolation.

## Immediate code-hardening requirements

- **Fail on storage write failure:** `assets/khaemenes-family-registry.js` currently ignores `writeJSON` return values in `save`. A write failure must not produce successful enrollment feedback.
- **Separate provisional IDs:** `assets/khaemenes-institutional-id.js` generates provisional IDs locally; they are references, not authenticated enrollment or proof of personhood.
- **No public flag activation:** `assets/khaemenes-account-client.js` defaults to disabled; its session/logout interface does not implement intake submission, academic persistence, or cloud readback.
- **Keep handoff honest:** Terminal 03 browser readiness currently reports no live transport or commissioning. No browser-side flag establishes authority.
- **Do not invoke destructive restore as deduplication:** Family backup/restore can replace previously stored members. Treat historical imports as a separate protected migration.
- **Protect historical accounts:** Never delete, reset or merge a local family simply because a person agrees to restart lessons.

## Tests required before launch

- Empty/one-word/fictitious display values cannot by themselves generate an **official enrolled** status. Legitimate mononyms remain supported.
- A repeated submit with the same idempotency key returns the same authoritative result; duplicate accounts are not created.
- Simulated quota denial, storage corruption, network outage, dropped confirmation and server restart do not report success.
- Guardian without learner permission cannot access learner record; sibling and unrelated-family record isolation tested.
- Enrollment retains grade placement, assessment provenance, elective choices, and academic records independently of profile decoration.
- Full-intake keyboard/mobile accessibility and understandable validation errors pass.
- Returning student loads the same authenticated account after device/browser restart, verified against durable server state.

**Release gate:** This file is planning-only. The existing site remains local-profile only until a protected storage service passes the above tests. Never declare persistent account enrollment from an unverified public UI.
