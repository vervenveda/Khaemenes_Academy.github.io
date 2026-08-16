# Khaemenes Academy Protected Account Service Protocol v1

## Purpose

The public Academy repositories remain learner-facing static applications. Real authentication, verified contact information, recovery, cross-device accounts, credential storage, and anti-abuse controls must live in a protected server-side Account Service.

This document defines the public contract and authority boundary without exposing private implementation details, secrets, fraud thresholds, or backend topology.

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
- secret: protected password/passcode or another approved authenticator;
- younger learners: parent-managed credential recovery;
- older learners: age-appropriate recovery options may be added when policy permits.

A learner's last name should not be required as part of the authentication secret. Student IDs are identifiers and are not secret.

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

## Credential-storage boundary

The following belong only in protected server infrastructure and never in public repositories or browser-local Academy records:

- passwords/passcodes;
- password hashes;
- verification tokens/codes;
- recovery secrets;
- session secrets;
- private fraud signals;
- private rate-limit thresholds;
- private service credentials;
- backend trust configuration.

## Institutional ID authority

The current public `khaemenes-institutional-id.js` layer issues provisional local Student/Scholar IDs for continuity and UI development.

The protected Account Service will become authoritative for globally reserved identifiers. It may:

1. confirm the provisional ID if available;
2. migrate it to a server-reserved ID if necessary;
3. record the migration explicitly;
4. preserve the internal learnerId and academic continuity.

No silent identifier churn is permitted after server confirmation.

## Recovery

Child/student recovery should normally flow through an authorized adult account rather than emailing or texting a young child directly.

Adult account recovery should use verified server-side recovery mechanisms and must never expose recovery secrets to public JavaScript.

## Public API contract direction

Future public clients should receive only the minimum account information needed for the current operation, for example:

- authenticated account/session state;
- learner IDs and confirmed Institutional IDs;
- display-safe learner profile fields;
- formal placement;
- permissions needed for the current surface.

Private authentication implementation and anti-abuse intelligence remain behind the service boundary.
