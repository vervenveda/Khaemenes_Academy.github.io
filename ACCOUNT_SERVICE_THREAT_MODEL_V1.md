# Khaemenes Academy Account Service Threat Model v1

## Scope

This threat model covers the future protected Account Service that will authenticate adults, students, and scholars and connect those authenticated accounts to the existing Academy Family Registry, Student Portal, course records, and Higher Learning bridge.

It intentionally does not expose private fraud thresholds, credentials, backend topology, infrastructure addresses, secret material, or security-rule internals.

## Assets to protect

Highest-value assets include:

- adult account identity and verified recovery channels;
- learner identity and Institutional ID mappings;
- family membership and learner-access permissions;
- authentication credentials and authenticator bindings;
- session secrets;
- recovery tokens and verification codes;
- protected academic records;
- transcript/certificate issuance records;
- security and audit history.

Academic evidence, grades, mastery, and placement are separate from account-risk state and must remain protected from silent mutation by the authentication/anti-abuse layer.

## Trust boundaries

```text
Public browser / static Academy UI
          |
          | HTTPS only
          v
Protected Account Service
          |
          +-- authentication / sessions
          +-- authorization / family permissions
          +-- ID reservation / account mapping
          +-- verification / recovery
          +-- anti-abuse / review
          +-- audit logging
          |
          v
Protected persistent storage / secret management
```

The browser is untrusted. Client-provided role, family, learner, placement, permission, verification, and account-state claims must never be accepted as authorization proof.

## Threats and required controls

### Credential stuffing / password guessing

Controls:

- server-side throttling by account and network risk context;
- breached/common-password blocklist at password creation/change;
- generic authentication failures;
- optional step-up/MFA for higher-risk adult operations;
- security-event logging without logging submitted passwords.

### Account enumeration

Controls:

- generic responses for login, enrollment lookup, verification, and recovery;
- similar observable response behavior for existing and non-existing accounts;
- do not expose whether an email, phone, Student ID, or Scholar ID is registered.

### Session theft / fixation

Controls:

- server-generated opaque session identifiers;
- Secure + HttpOnly cookies;
- SameSite policy appropriate to the flow;
- session rotation after authentication and privilege change;
- inactivity and overall expiration;
- invalidation on logout and credential reset;
- no session identifiers, access tokens, or refresh tokens in localStorage/sessionStorage.

### CSRF

Controls:

- SameSite cookie policy;
- server-side CSRF defense for authenticated state-changing browser requests;
- origin/referer validation where appropriate as defense in depth;
- never use GET for sensitive state changes.

### XSS impact

Controls:

- no authentication tokens in Web Storage;
- strict output encoding and DOM-safe rendering;
- Content Security Policy appropriate to deployed application architecture;
- minimize third-party script execution on authenticated account surfaces.

### Broken access control / IDOR

Controls:

- authorize every protected object request server-side;
- never infer access from possession of learnerId, familyId, Student ID, or URL;
- test cross-family and cross-learner isolation explicitly;
- educator/administrator permissions require separate protected grants.

### Fake-family / automated learner creation

Controls:

- verified adult contact before normal learner issuance;
- account/device/network creation velocity controls;
- bot resistance;
- review state for unusual volume;
- no permanent household-size ceiling;
- no academic penalty when account creation is held for review.

### Recovery takeover

Controls:

- verified side-channel recovery;
- single-use expiring cryptographically random tokens/codes;
- strict attempt limits;
- non-enumerating request response;
- session invalidation after successful reset;
- security notification after recovery-channel or password changes.

### Institutional ID collision / spoofing

Controls:

- protected service is final authority for global ID reservation;
- database-level uniqueness constraint;
- provisional client IDs may be confirmed or explicitly migrated;
- Student/Scholar ID is never accepted as proof of authentication or authorization.

### Insider / administrative misuse

Controls:

- least privilege;
- stronger authentication for administrative functions;
- immutable/auditable security events where practical;
- sensitive operations require explicit actor identity and reason/context;
- no shared administrative credentials.

### Sensitive-data leakage

Controls:

- data minimization;
- do not collect unnecessary child email, phone, legal name, or birth date for course access;
- encrypt sensitive protected data at rest where appropriate;
- keep keys/secrets in managed secret storage;
- redact secrets and sensitive payloads from logs;
- defined retention/deletion policy.

## Public-client invariant

The public browser may receive display-safe session context, but it must never receive or persist:

- password hashes;
- session secrets readable by JavaScript;
- refresh tokens;
- OTP secrets/codes after verification;
- password reset tokens;
- private fraud scores/rules;
- server credentials;
- signing/encryption keys.

## Abuse-state firewall

Account states such as `review`, `creation-held`, `recovery-required`, or `contact-unverified` may restrict protected account operations. They must not modify grade, mastery, assessment evidence, course completion, formal placement, or mentor conclusions.

## Minimum pre-production security tests

1. Cross-family access attempt is rejected.
2. Cross-learner access attempt is rejected.
3. Student cannot invoke parent/guardian operations.
4. Parent without learner permission cannot access that learner's protected record.
5. Changed client-side role/permission values do not increase server authorization.
6. Login responses do not disclose account existence.
7. Recovery responses do not disclose account existence.
8. Login and recovery rate limits activate under automated attempts.
9. Reset tokens expire, are single-use, and are invalid after successful reset.
10. Logout invalidates the session server-side.
11. Password reset invalidates existing sessions according to policy.
12. Session cookie is Secure, HttpOnly, narrowly scoped, and uses an intentional SameSite policy.
13. No auth/session token is written to localStorage/sessionStorage.
14. CSRF attempts against authenticated state-changing operations fail.
15. Institutional ID uniqueness is enforced server-side.
16. Secrets are absent from application logs and public repository history.
17. Backups can be restored without exposing credentials or weakening authorization.
18. Security incident procedure can revoke sessions/credentials and preserve academic records independently.
