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

## Public security boundary

The current public family layer is browser-local unless an authorized family server is connected. It must not contain passwords, API keys, protected routes, private backend topology, or hidden administrative credentials.

Email invitation UI must continue to report server unavailability honestly when the secure family service is not connected.

See `../FRONT_DOOR_PROTOCOL_V2.md` for the Academy-wide protocol.