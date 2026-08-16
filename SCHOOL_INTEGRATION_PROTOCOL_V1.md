# Khaemenes Academy School Integration Protocol v1

## Purpose

This protocol defines how Khaemenes school and grade portals consume the Academy family/learner identity layer without creating competing student identities.

## Canonical learner flow

Family enrollment → canonical learner identity → exact grade → canonical school stage → NAIB route recommendation → school surface → Archaemenes/course experience.

## Identity rule

A school portal must not create a second learner identity when a canonical Academy learner already exists. School-local academic state may exist, but it should be scoped to the canonical `learnerId` through the learner-context adapter.

Shared public-safe adapter:

`assets/khaemenes-learner-context.js`

It exposes:

- the active Academy learner and family context;
- canonical grade/stage placement;
- surface mismatch detection;
- course-scoped learner envelopes;
- learner-scoped browser storage key generation.

It does not authenticate a learner or grant protected permissions.

## School surface behavior

A school surface declares its stage and, when useful, the grades it serves. The shared school bridge may then identify a mismatch.

A mismatch must not force a redirect. Parent and educator preview remains possible. The learner should receive a clear route back to the registered school/grade path.

## Course state

Course-specific state should be stored under a learner-scoped key rather than a generic shared profile key.

Example conceptual key:

`khaemenes.course:<learnerId>:<courseId>`

The adapter's `storageKey()` method provides the canonical public-safe namespacing pattern.

## Authority boundaries

The Family Registry owns the browser-local learner identity and placement record.

NAIB may interpret context and recommend a destination. NAIB does not change formal placement.

Archaemenes mentors and advises. Archaemenes does not independently award formal mastery or change placement.

Course engines own course-specific mastery calculations.

Teacher/Academy systems own documented formal corrections and institutional decisions.

No school-local convenience profile should override the canonical Academy learner.

## Legacy migration

Legacy school profiles should be treated as compatibility data, not a new identity authority.

Migration should:

1. detect a canonical Academy learner;
2. map legacy academic preferences/progress to that learner where safe;
3. retain the original data until migration is verified;
4. avoid silently changing grade or placement;
5. stop asking for duplicate learner identity fields once canonical context is available.

## Rollout order

1. Academy Student Portal and enrollment.
2. Elementary learner adapter.
3. Kinder Garden compatibility adapter.
4. Middle School grade-context refinement.
5. High School grade-context refinement.
6. Course-level learner-scoped progress migration.
7. Teacher Administration placement-health visibility.

## Public security boundary

These browser modules are continuity and routing contracts, not authentication. They must not contain credentials, private server routes, protected topology, secret answer keys, or protected learner records.
