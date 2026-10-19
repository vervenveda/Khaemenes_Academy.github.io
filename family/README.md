# Khaemenes Academy Family Layer

The Family layer coordinates one family identity with separate learner identities across the Khaemenes academic continuum.

## Canonical entry points

- `family/index.html` — full family workspace, adult permissions, records, invitations, and learner switching.
- `family/enroll/index.html` — canonical local enrollment and exact-grade placement flow.
- `student/index.html` — active-learner front door that routes the learner to the registered school path.
- `adult/enroll/index.html` — self-directed adult-scholar enrollment that creates or links an adult learner identity and routes directly to Higher Learning.

## Placement rule

The shared Family Registry now records both `stage` and exact `grade`.

- Pre-K → preschool
- Kindergarten → kindergarten
- Grades 01–05 → elementary
- Grades 06–08 → middle
- Grades 09–12 → high

When a grade is present, the grade determines the canonical stage. Existing legacy learner records that contain only a stage remain valid and should be given one explicit grade update rather than having a grade guessed silently.

## Identity rule

Each learner receives one Academy `learnerId` and one `accountId`. School portals should consume that identity instead of creating a second institutional learner identity.

School-specific course state may remain local when it is learner-scoped and does not replace the Academy learner record.

## Routing

## Adult learner rule

Adults learning for themselves do **not** receive a K–12 grade. The canonical adult path is:

```text
Academy Front Desk
→ Adult Scholar
→ adult/enroll/
→ linked adult + learner identity
→ stage: higher
→ Scholar ID
→ Khaemenes Higher Learning
```

The adult learner record is marked `selfDirectedAdult: true`, remains separate from K–12 learner placement, and uses the `self-scholar` access preset. The K–12 Student Portal intentionally excludes self-directed adult records from its family learner switcher.

NAIB may route an active learner to the correct registered school surface. Routing is advisory and cannot silently change formal placement, learner identity, grades, or mastery.

The school bridge may warn about stage or grade mismatch without hard-redirecting a parent or educator who is previewing another campus.

## Family Backup Vault

The Family Portal includes a first-party browser-local backup and recovery path for the Academy family identity.

A current backup is wrapped in the versioned schema:

```text
khaemenes-family-backup-v2
```

The envelope carries the current family export plus the privacy-safe Weekly Family Brief and is protected with a SHA-256 integrity digest before download.

Restore behavior is intentionally bounded:

- the file is parsed and structurally validated before any write;
- verified v2 backups must pass their SHA-256 checksum;
- legacy `khaemenes-family-export-v1.2/v1.3` files remain structurally reviewable for continuity;
- the current family record is saved automatically as a browser-local rollback snapshot before restore;
- restore replaces only the selected family scope while preserving unrelated families in the Academy registry;
- ID collisions with another family stop the restore;
- the last restore can be undone from the Family Portal.

The Family Backup Vault restores Academy family identity, adult/learner membership, placement identity, and family permissions only. It does **not** restore or rewrite course grades, assessment attempts, private learner reflections, child conversations, or answer keys. Those remain under their respective course and privacy authorities.

The backup/restore path works without continuous internet access. The downloaded file leaves the browser only when the user chooses where to save or copy it.

---

## Public security boundary

The current public family layer is browser-local unless an authorized family server is connected. It must not contain passwords, API keys, protected routes, private backend topology, or hidden administrative credentials.

Email invitation UI must continue to report server unavailability honestly when the secure family service is not connected.

See `../FRONT_DOOR_PROTOCOL_V2.md` for the Academy-wide protocol.