# Khaemenes Academy Family Account Persistence — Phase v1

## Goal

Move Academy identity and learning continuity from browser-local storage toward a protected Family Account service without breaking the existing local-first Family Registry.

The first production milestone is intentionally narrow:

1. family account sign-in;
2. student sign-in with Student ID + password/passphrase;
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

## Student sign-in contract

- username: confirmed Khaemenes Student ID;
- secret: password/passphrase;
- session: protected server-issued HttpOnly cookie;
- recovery: authorized family adult reset flow.

A Student ID is an identifier, not a secret.

## Cross-device continuity contract

After authentication, the Account Service resolves the signed-in student to the canonical internal `learnerId` and returns only display/routing-safe context. The `learnerId` becomes the continuity key used to recover learner-scoped course state across devices. Server authorization remains authoritative for protected operations.

## Compatibility migration

The existing browser-local Family Registry remains available during migration. On first authenticated conversion, preserve the existing internal `learnerId` whenever possible, confirm or explicitly migrate the provisional Institutional ID, preserve local academic/course evidence until synchronization is verified, and never silently discard or regenerate learner identity.

If local and protected records conflict, surface a reconciliation state rather than overwriting either side silently.

## Parent-managed student credential flow

Parents/guardians may create an initial student credential, issue/reset a temporary password, require a credential change after temporary-password use where appropriate, revoke student sessions, and view non-secret account/session status. They may never retrieve the current password.

## Academic firewall

Account-management actions must never silently alter grades, mastery, assessment evidence, course completion, placement, certificates, or transcripts.

## Phase v1 protected endpoints

The initial backend should provide equivalent protected operations for:

```text
POST /v1/account/adult/login
POST /v1/account/student/login
POST /v1/account/logout
GET  /v1/account/session
POST /v1/account/student/credential
POST /v1/account/student/credential/reset
POST /v1/account/student/sessions/revoke
GET  /v1/account/learner/continuity
PUT  /v1/account/learner/continuity
```

Exact private backend topology, storage engines, rate-limit thresholds, signing keys, recovery internals, and anti-abuse rules must not be published here.

## Release gate

Do not enable protected account mode for public students until all are verified: HTTPS-only transport; modern password hashing; secure HttpOnly sessions; appropriate CSRF protection; login/reset rate limiting; non-enumerating errors; parent isolation across two test families; student isolation across two test learners; logout/session revocation; cross-device learnerId restoration; cross-device Pre-Algebra continuity restoration; no auth/session secrets in web storage; secret-redacted audit logging; and rollback/recovery evidence.

## Next phase

After Phase v1 passes the release gate, add protected Family Account file/document storage scoped by `familyId` and `learnerId`, with explicit sharing permissions and the same human/academic authority boundaries.
