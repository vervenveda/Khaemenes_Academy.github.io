# Khaemenes Academy Protected Account Service Protocol v1.1

## Purpose

The public Academy repositories remain learner-facing static applications. Real authentication, verified contact information, recovery, cross-device accounts, credential storage, session management, and anti-abuse controls belong only in a protected server-side Account Service.

This document defines the public contract and authority boundary without exposing private implementation details, secrets, fraud thresholds, or backend topology.

The protected service should be implemented against current NIST SP 800-63 guidance and OWASP authentication/session/password-storage guidance. Security-sensitive controls must be enforced server-side on a trusted system.

## Account hierarchy

```text
Verified Adult Account
        ↓
    Family Account
        ↓
 ┌──────┼───────────┐
 ↓      ↓           ↓
Student Student  Adult Scholar
 ID       ID       Scholar ID
 ↓        ↓           ↓
K–12     K–12    Higher Learning
```

An adult may be both a parent/guardian and a learner. The adult account and the adult scholar learner record remain linked but distinct.

## Parent / guardian enrollment

A protected adult account should support:

- full adult profile;
- verified email and/or phone;
- family membership;
- authorized creation of learner accounts;
- learner access permissions;
- student credential reset/recovery;
- family recovery and account-security controls.

The public static Family Registry is not secure authentication and must never claim otherwise.

## Student authentication

Recommended student sign-in contract:

- username: confirmed Student ID;
- secret: protected password/passphrase or another approved authenticator;
- younger learners: parent-managed credential recovery;
- older learners: age-appropriate recovery options may be added when policy permits.

A learner's last name should not be required as part of the authentication secret. Student IDs are identifiers and are not secret.

For centrally verified single-factor passwords, the service should follow current NIST password length and compromised-password blocklist guidance, permit long passphrases, avoid arbitrary composition rules, and never use security questions as a primary recovery mechanism.

## Adult scholar authentication

Adult scholars use the protected adult account and/or confirmed Scholar ID according to the Account Service authentication policy. Their guardian/family permissions must not automatically grant or merge academic identity.

## Verification states

The service should distinguish at least:

- unverified visitor;
- contact-verified adult;
- verified family account;
- learner creation permitted;
- additional verification required;
- creation temporarily held for review;
- institutional/educator roster authority where separately approved.

Exact verification methods, thresholds, scoring, fraud rules, and private risk signals must remain server-side.

## Authentication transport

- Credentials must only be submitted over HTTPS.
- Authentication endpoints must fail closed.
- Authentication responses must not reveal whether an account, email, phone number, or Student ID exists.
- Login, verification, recovery, and learner-creation endpoints must be rate-limited server-side.
- Sensitive state-changing requests require CSRF protection appropriate to the chosen session model.

## Password storage

Passwords/passphrases must never be encrypted for reversible recovery and must never be stored in plaintext.

The Account Service must use a modern password hashing function appropriate to the deployment environment. Argon2id is preferred where available; approved alternatives may be used when platform or compliance requirements require them. Each password requires its own salt. Any optional pepper belongs in protected secret management, separate from the account database.

Fast general-purpose hashes such as plain SHA-256 or SHA-512 are not password-storage mechanisms.

## Session management

Authenticated browser sessions must use server-issued session secrets, preferably in cookies with all practical protections enabled:

- `Secure`;
- `HttpOnly`;
- `SameSite=Lax` or `SameSite=Strict` as appropriate;
- narrow hostname/path scope;
- opaque session identifier only;
- explicit expiration;
- server-enforced inactivity and overall lifetime;
- invalidation on logout, credential reset, account compromise, or security-sensitive permission change.

Authentication/session secrets, access tokens, refresh tokens, and session identifiers must not be stored in `localStorage` or `sessionStorage`.

High-risk actions such as changing recovery channels, creating additional high-volume rosters, or modifying account authority should require recent authentication or step-up verification.

## Recovery

Child/student recovery should normally flow through an authorized adult account rather than emailing or texting a young child directly.

Adult account recovery must:

- use a verified side channel;
- return non-enumerating responses;
- use cryptographically random, single-use, expiring reset tokens/codes;
- rate-limit requests and attempts;
- invalidate the reset token after successful use;
- invalidate or offer to invalidate active sessions after a successful credential reset;
- never email or text the existing password.

Recovery tokens/codes must never appear in application logs or public client storage.

## Anti-abuse principles

The service should prevent automated or mass creation of fake family and learner accounts through layered controls such as:

- verified adult contact channels;
- server-side request throttling;
- creation-velocity controls;
- duplicate/reused recovery-contact checks;
- suspicious-account review states;
- higher-volume household review without assuming fraud;
- bot/automation resistance;
- audit logging for account creation and learner issuance.

The system should evaluate account-creation behavior, not whether a child's name, family structure, or learning profile appears "real."

A legitimate large family must be allowed to continue through additional verification rather than being permanently blocked by a simple child-count ceiling.

## Academic firewall

Anti-abuse or account-risk signals must never silently alter:

- grades;
- mastery;
- assessment evidence;
- course completion;
- placement;
- mentor conclusions.

Account review may temporarily restrict new account creation or protected sign-in operations, but academic evidence remains a separate domain.

## Child-data minimization

For younger learners, the parent/guardian should establish the learner account. The public student-facing experience should collect only information needed for learning and continuity.

Do not require a child to provide an email address, phone number, legal last name, birth date, or other unnecessary personal information simply to access coursework.

## Authorization model

Authentication answers **who is signed in**. Authorization answers **what that account may do**. Every protected route must enforce authorization server-side.

The service must not trust client-provided role labels, family IDs, learner IDs, grade placement, or permission claims without verifying them against protected records.

Required checks include:

- an adult may only manage families to which the adult is actively linked;
- an adult may only manage learners for whom the adult has the required permission;
- a student may only access that student's own protected learner record unless an explicitly authorized educational role permits otherwise;
- educators require separately granted institutional/roster authority;
- administrative functions require stronger authorization than ordinary learner access.

## Credential-storage boundary

The following belong only in protected server infrastructure and never in public repositories or browser-local Academy records:

- passwords/passcodes;
- password hashes;
- verification tokens/codes;
- recovery secrets;
- session secrets;
- access/refresh tokens;
- private fraud signals;
- private rate-limit thresholds;
- private service credentials;
- backend trust configuration;
- secret keys or peppers.

## Institutional ID authority

The current public `khaemenes-institutional-id.js` layer issues provisional local Student/Scholar IDs for continuity and UI development.

The protected Account Service will become authoritative for globally reserved identifiers. It may:

1. confirm the provisional ID if available;
2. migrate it to a server-reserved ID if necessary;
3. record the migration explicitly;
4. preserve the internal learnerId and academic continuity.

No silent identifier churn is permitted after server confirmation.

## Public API contract direction

Future public clients should receive only the minimum account information needed for the current operation, for example:

```json
{
  "authenticated": true,
  "accountType": "adult",
  "adultVerified": true,
  "familyId": "fam_...",
  "learnerId": "learner_...",
  "institutionalId": "KA-...",
  "permissions": ["learner.view"],
  "placement": {"stage":"elementary","grade":"04"}
}
```

The client must treat this as display/routing context, not as an authorization source for protected operations. Server authorization remains authoritative.

## Logging and audit

Security logs should record event metadata without recording secrets. Appropriate events include:

- account created;
- contact verified;
- authentication success/failure;
- session created/terminated;
- recovery requested/completed;
- learner created;
- Institutional ID confirmed/migrated;
- permission granted/revoked;
- creation hold/review state entered or released.

Never log plaintext passwords, OTP values, reset tokens, session cookies, recovery secrets, or full sensitive request payloads.

## Deployment gate

The Account Service is not considered production-ready until all of the following are independently verified:

- HTTPS-only transport;
- trusted server-side authentication and authorization;
- modern password hashing;
- secure session-cookie configuration;
- CSRF protection for state-changing authenticated browser requests;
- login, verification, recovery, and account-creation rate limiting;
- non-enumerating login/recovery responses;
- secure password-reset lifecycle;
- permission isolation across at least two families and two learners;
- logout and session invalidation;
- audit logging with secret redaction;
- dependency/security scanning;
- backup/restore and incident-response procedures;
- no authentication/session secrets in browser localStorage or public repositories.
