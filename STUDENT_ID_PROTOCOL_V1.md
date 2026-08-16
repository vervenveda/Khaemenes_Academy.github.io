# Khaemenes Academy Student & Scholar ID Protocol v1

## Purpose

Every Academy learner has two different identities with different jobs:

1. **Internal learnerId** — software continuity key used by the Academy registry and course storage.
2. **Institutional ID** — human-readable learner identifier used on portals, records, certificates, transcripts, and future authentication.

The institutional ID does not contain a learner's name, last name, grade, birth date, or other personal information.

## Identifier classes

### K–12 Student ID

Format:

`KA-YYYY-XXXXXXXXXX`

Example:

`KA-2026-A12B34C56D`

### Higher Learning Scholar ID

Format:

`KS-YYYY-XXXXXXXXXX`

Example:

`KS-2026-F09E87D65C`

The year is the learner-record creation year. The random token does not encode grade, school, name, age, or family relationship.

## Immutability

Institutional IDs are intended to follow the learner throughout the Academy continuum.

Changing grade, stage, campus, mentor, family display name, or course enrollment must not silently regenerate the institutional ID.

A future protected Account Service may confirm, reserve, or migrate a provisional local identifier during authenticated account conversion. Any migration must be explicit, auditable, and preserve the learner's internal learnerId and academic continuity.

## Current static-site boundary

The public Academy currently runs a browser-local Family Registry. Therefore identifiers issued by `assets/khaemenes-institutional-id.js` are marked **provisional local identifiers**.

They are stable inside the local Academy registry and are backfilled non-destructively for existing learners, but a public static page cannot guarantee global uniqueness across every browser or device.

The protected Account Service will become the authority for globally reserved institutional identifiers.

## Security boundary

An Institutional ID is an identifier, not an authenticator or secret.

The following must never be stored in learner JSON, localStorage learner records, family exports, public HTML/JavaScript, or a public GitHub repository:

- passwords or passcodes;
- password hashes;
- recovery secrets;
- email verification tokens;
- SMS verification codes;
- authentication session secrets;
- private anti-abuse signals.

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

The ID must never be used as evidence of mastery, placement, custody, age, identity verification, or accreditation.

## Authority boundary

- Family Registry owns learner identity and formal placement records.
- Institutional ID identifies the learner record.
- NAIB routes but does not issue grades or placement.
- Archaemenes mentors but does not change identity or placement.
- Courses own course-specific mastery evidence.
- Protected Account Service owns authentication and globally reserved account credentials.
