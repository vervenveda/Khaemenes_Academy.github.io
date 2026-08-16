# Khaemenes Academy Student & Scholar ID Protocol v1.1

## Purpose

Every Academy learner has two different identities with different jobs:

1. **Internal learnerId** — software continuity key used by the Academy registry and course storage.
2. **Institutional ID** — human-readable learner identifier used on portals, records, certificates, transcripts, and future authentication.

The institutional ID does not contain a learner's name, last name, grade, birth date, or other personal information.

## Identifier classes

### K–12 Student ID

Current provisional format:

`KA-YYYY-XXXXXXXXXXXXXXXXXXXX`

### Higher Learning Scholar ID

Current provisional format:

`KS-YYYY-XXXXXXXXXXXXXXXXXXXX`

The year is the learner-record creation year. New provisional identifiers use an 80-bit cryptographically secure random token when issued from a secure browser context.

Earlier v1 provisional identifiers containing a 10-hex-character token remain valid and must not be silently regenerated simply because the format was strengthened.

## Secure issuance requirement

The public provisional-ID layer must not fall back to `Math.random()` or another non-cryptographic generator.

If `crypto.getRandomValues()` is unavailable or the page is not running in a secure context, provisional issuance is deferred rather than generating a weaker identifier.

This improves local collision resistance but does **not** make the public browser the global authority for Student/Scholar IDs.

## Immutability

Institutional IDs are intended to follow the learner throughout the Academy continuum.

Changing grade, stage, campus, mentor, family display name, or course enrollment must not silently regenerate the institutional ID.

A future protected Account Service may confirm, reserve, or migrate a provisional local identifier during authenticated account conversion. Any migration must be explicit, auditable, and preserve the learner's internal learnerId and academic continuity.

## Current static-site boundary

The public Academy currently runs a browser-local Family Registry. Therefore identifiers issued by `assets/khaemenes-institutional-id.js` are marked **provisional local identifiers**.

They are stable inside the local Academy registry and are backfilled non-destructively for existing learners, but a public static page cannot guarantee global uniqueness across every browser or device.

The protected Account Service will become the authority for globally reserved institutional identifiers and must enforce uniqueness in protected persistent storage.

## Security boundary

An Institutional ID is an identifier, not an authenticator or secret.

The following must never be stored in learner JSON, localStorage learner records, family exports, public HTML/JavaScript, or a public GitHub repository:

- passwords or passcodes;
- password hashes;
- recovery secrets;
- email verification tokens;
- SMS verification codes;
- authentication session secrets;
- access or refresh tokens;
- private anti-abuse signals;
- private signing/encryption keys.

Authentication belongs to the protected Account Service.

## Records use

Once confirmed by the protected service, Student/Scholar IDs may appear on:

- Student Portal;
- Family Hub;
- teacher-facing records;
- transcripts;
- certificates;
- report exports;
- Higher Learning records;
- account recovery references where appropriate.

The ID must never be used as evidence of mastery, placement, custody, age, identity verification, authentication, authorization, or accreditation.

## Server confirmation

When the protected Account Service becomes available, global confirmation must be transactional and auditable:

1. authenticate/verify the authorized adult or adult scholar;
2. locate the canonical internal learnerId;
3. reserve/confirm a globally unique Institutional ID under a uniqueness constraint;
4. record whether an existing provisional ID was confirmed or migrated;
5. preserve prior provisional ID history when migration occurs;
6. return only display-safe confirmed ID state to the public client.

No public client may self-declare an Institutional ID as globally confirmed.

## Authority boundary

- Family Registry owns local learner identity and formal placement records until protected account migration.
- Institutional ID identifies the learner record.
- Protected Account Service owns global ID reservation and authentication.
- NAIB routes but does not issue grades or placement.
- Archaemenes mentors but does not change identity or placement.
- Courses own course-specific mastery evidence.
