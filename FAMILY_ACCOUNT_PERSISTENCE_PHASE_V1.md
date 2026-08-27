# Khaemenes Academy Family Account Persistence — Phase v1

## Goal

Move Academy identity and learning continuity from browser-local storage toward a protected Family Account service without breaking the existing local-first Family Registry.

The first production milestone is intentionally narrow:

1. family account sign-in;
2. student sign-in with Student ID + password;
3. parent/guardian-managed student password reset;
4. cross-device restoration of canonical learner identity;
5. cross-device restoration of learner-scoped course continuity.

File storage, collaborative documents, and larger family-cloud features follow only after authentication and canonical learner continuity are proven.

## Existing public boundary

The public Academy remains a static learner-facing application. It may render sign-in forms, request sessions, and consume display-safe account context, but it must never store or expose plaintext passwords/passcodes, password hashes, recovery secrets, verification codes, access/refresh tokens, session identifiers, private signing keys, or private anti-abuse signals.

Authentication and persistence authority belong to the protected Account Service.

## Family account model

```text
Verified Adult Account
        ↓
    Family Account
        ↓
 ┌──────┼───────────┐
 ↓      ↓           ↓
Student Student  Adult Scholar
Account Account     Account
```

A parent/guardian may create or manage a student's sign-in credential, reset that credential, and revoke the student's active sessions. The parent must not be able to retrieve the student's existing password because passwords are never stored reversibly.

## Academy Family Account password policy

Khaemenes Academy Family Accounts follow the current protected `MemberRegistryVault` password contract. This is the Academy family/student credential policy unless deliberately revised through a later security review.

A password must:

- contain at least 12 characters;
- contain no more than 512 characters;
- use at least three of these four categories: lowercase letters, uppercase letters, numbers, symbols;
- not match a blocked common password;
- be processed only by the protected server-side password authority.

The current protected implementation derives password records with `scrypt`, a per-password random salt, and timing-safe verification. Public Academy clients must not reproduce password hashing or retain passwords after the authentication request completes.

## Student sign-in contract

- username: confirmed Khaemenes Student ID;
- secret: Academy password satisfying the Family Account password policy above;
- session: protected server-issued HttpOnly cookie;
- recovery: authorized family adult reset flow.

A Student ID is an identifier, not a secret.

## Enrollment numbering

Khaemenes Academy uses human-readable sequential enrollment numbers for administration while preserving non-sequential internal continuity identifiers.

```text
KA-FAM-001  founding family enrollment number
KA-STU-001  founding student enrollment number
```

The Academy maintains independent family, adult, and student sequences. Student numbers are Academy-wide and do not restart inside each family. Enrollment numbers are never recycled and are never authenticators.

Protected records retain immutable internal identifiers such as `familyId` and `learnerId` for authorization and continuity. A new enrollment number must not silently replace an existing internal identity.

## Cross-device continuity contract

After authentication, the Account Service resolves the signed-in student to the canonical internal `learnerId` and returns only display/routing-safe context. The `learnerId` becomes the continuity key used to recover learner-scoped course state across devices. Server authorization remains authoritative for protected operations.

## Compatibility migration

The existing browser-local Family Registry remains available during migration. On first authenticated conversion, preserve the existing internal `learnerId` whenever possible, confirm or explicitly migrate the provisional Institutional ID, preserve local academic/course evidence until synchronization is verified, and never silently discard or regenerate learner identity.

If local and protected records conflict, surface a reconciliation state rather than overwriting either side silently.

A family may deliberately choose to begin a new protected learner record instead of migrating old browser-local progress. In that case, leave the prior local record untouched as historical/local data unless the family explicitly chooses to remove it.

## Parent-managed student credential flow

Parents/guardians may create an initial student credential, issue/reset a temporary password, require a credential change after temporary-password use where appropriate, revoke student sessions, and view non-secret account/session status. They may never retrieve the current password.

## Homeschool compliance reporting foundation

Family and student reports must follow `HOMESCHOOL_COMPLIANCE_FRAMEWORK_V1.md`.

There is no single U.S. national homeschool rulebook that can be applied uniformly to every family. Khaemenes therefore uses a national academic record core plus a jurisdiction-specific state/territory compliance overlay based on authoritative current sources.

Protected Family Accounts should retain the family's jurisdiction, education path, academic year, ruleset ID/version, and ruleset review date. Generated compliance-support reports must preserve the ruleset version used when they were created.

A state-law requirement must never be guessed. If a requirement has not been verified against an authoritative source, the system must surface it as unknown/review-required rather than presenting an unsupported compliance claim.

Student-facing dashboards emphasize the learner's own academic record. Family dashboards may additionally show authorized compliance-support requirements, deadlines, portfolio/evaluation status, and recordkeeping tools. Academy admin may maintain ruleset provenance and aggregate enrollment information without exposing one family's records to another.

## Optional 333 Network account linking

Enrollment in Khaemenes Academy does not require enrollment in the 333 Network. The Family Account must remain fully usable as an Academy account on its own.

If a family separately chooses to enroll in the 333 Network, the protected infrastructure may explicitly link the family's Academy account to approved 333 identities and services, including the family's 333 number, email identity, and social account.

The linkage must be opt-in and server-authorized. It must not:

- copy or expose passwords between public clients;
- place authentication or session secrets in browser storage;
- silently create a 333 account for an Academy family;
- make 333 enrollment a condition of receiving Academy instruction;
- merge academic authority with communication/social authority;
- permit a 333 profile, number, email, or social account to change grades, mastery, placement, learner identity, jurisdiction, or homeschool compliance state;
- destroy the Academy Family Account or academic continuity if the family later unlinks from 333.

The intended relationship is an authenticated identity association, not a public-client credential handoff:

```text
Khaemenes Family Account
        │
        ├── Academy learner identity / progress / records
        │
        └── optional explicit link
                    │
                    ▼
              333 Network
              ├── number
              ├── email
              └── social account
```

## Academic firewall

Account-management actions and optional 333 linking must never silently alter grades, mastery, assessment evidence, course completion, placement, certificates, transcripts, jurisdiction, or compliance-support records.

## Phase v1 protected operations

The Academy public client should consume protected operations through the approved trusted gateway rather than inventing a second account authority. The existing OHMIC account authority and `MemberRegistryVault` are the current protected identity/session foundation under forensic review.

Phase v1 requires equivalent protected capabilities for:

```text
adult/family authentication
student authentication by Student ID + password
logout and session invalidation
current-session lookup
parent-managed student credential creation/reset
student session revocation
learner continuity read/write
optional 333 identity-link creation/status/revocation after Academy authentication is certified
```

Exact private backend topology, storage engines, rate-limit thresholds, signing keys, recovery internals, and anti-abuse rules must not be published here.

## Release gate

Do not enable protected account mode for public students until all are verified: HTTPS-only transport; current MemberRegistryVault password-policy enforcement; protected password derivation and verification; secure HttpOnly sessions; appropriate CSRF protection; login/reset rate limiting; non-enumerating errors; parent isolation across two test families; student isolation across two test learners; logout/session revocation; cross-device learnerId restoration; cross-device course continuity restoration; no auth/session secrets in web storage; secret-redacted audit logging; rollback/recovery evidence; jurisdiction-aware report metadata; ruleset version/date provenance; authoritative source links for any state-law requirement shown as verified; and visible failure for stale/unknown compliance requirements rather than unsupported assumptions.

Optional 333 linking has its own later gate and must not delay or weaken standalone Academy Family Account persistence.

## Next phase

After Phase v1 passes the release gate, add protected Family Account file/document storage scoped by `familyId` and `learnerId`, with explicit sharing permissions and the same human/academic authority boundaries. Expand Student Profile v2 and Family Profile v2 against the national academic record core and verified jurisdiction rulesets.
