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

The public Academy remains a static learner-facing application. It may render sign-in forms, request sessions, and consume display-safe account context, but it must never store or expose:

- plaintext passwords or passcodes;
- password hashes;
- recovery secrets;
- verification codes;
- access/refresh tokens;
- session identifiers;
- private signing keys;
- private anti-abuse signals.

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

Recommended first sign-in surface:

- username: confirmed Khaemenes Student ID;
- secret: password/passphrase;
- session: protected server-issued HttpOnly cookie;
- recovery: authorized family adult reset flow.

A Student ID is an identifier, not a secret.

## Cross-device continuity contract

After authentication, the Account Service resolves the signed-in student to the canonical internal `learnerId`.

The public client then receives only display/routing-safe context, for example:

```json
{
  "authenticated": true,
  "accountType": "student",
  "familyId": "fam_...",
  "learnerId": "learner_...",
  "institutionalId": "KA-...",
  "permissions": ["learner.view", "progress.view"],
  "placement": {
    "stage": "high",
    "grade": "09"
  }
}
```

The `learnerId` becomes the continuity key used to recover learner-scoped course state across devices. The public browser must not treat the returned permissions object as authority for protected operations; server authorization remains authoritative.

## Compatibility migration

The existing browser-local Family Registry remains available during migration.

On first authenticated conversion:

1. authenticate or verify the authorized adult/family account;
2. locate the existing local learner record;
3. preserve the existing internal `learnerId` whenever possible;
4. confirm or explicitly migrate the provisional Institutional ID;
5. attach protected persistence to that canonical learner identity;
6. preserve local academic/course evidence until server synchronization is verified;
7. never silently discard or regenerate learner identity.

If local and protected records conflict, the application must surface a reconciliation state rather than overwriting either side silently.

## Password requirements

The protected service should follow current NIST and OWASP guidance:

- long passphrases permitted;
- no arbitrary composition rules;
- compromised-password blocklist where available;
- modern password hashing, preferably Argon2id;
- unique salt per credential;
- optional pepper stored only in protected secret management;
- no plaintext or reversible password storage.

## Parent-managed student credential flow

Parent/guardian operations:

- create initial student credential;
- issue/reset a temporary student password;
- require student credential change after temporary-password use where appropriate;
- revoke all student sessions;
- view non-secret account status and device/session metadata;
- never reveal the current student password.

## Academic firewall

Account-management actions must never silently alter:

- grades;
- mastery;
- assessment evidence;
- course completion;
- placement;
- certificates;
- transcripts.

Authentication proves who is signed in. Academic systems remain authoritative for learning evidence.

## Phase v1 protected endpoints

Initial backend implementation should provide equivalent protected operations for:

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

Exact private backend topology, storage engines, rate-limit thresholds, signing keys, recovery internals, and anti-abuse rules must not be published in this repository.

## Phase v1 release gate

Do not enable protected account mode for public students until all are verified:

- HTTPS-only transport;
- password hashing and credential isolation;
- secure HttpOnly session cookies;
- CSRF protection appropriate to the session model;
- login/reset rate limiting;
- non-enumerating authentication and recovery errors;
- parent authorization isolation across at least two test families;
- student isolation across at least two test learners;
- logout and all-session revocation;
- cross-device learnerId restoration;
- cross-device Pre-Algebra continuity restoration;
- no auth/session secrets in localStorage/sessionStorage;
- audit logging with secret redaction;
- rollback/recovery evidence.

## Next phase

After Phase v1 passes the release gate, add protected Family Account file/document storage scoped by `familyId` and `learnerId`, with explicit sharing permissions and the same human/academic authority boundaries.
