# Khaemenes Academy Front Door Protocol v2

Status: source-staged public-safe protocol

## Purpose

The Front Door Protocol defines how a family creates an Academy-local family record, registers separate learner identities, assigns canonical grade placement, and routes an active learner into the correct school surface without creating competing identities.

## Canonical sequence

Family → learner identity → exact grade → canonical school stage → NAIB learner-entry route → school / grade surface → Archaemenes mentoring → course evidence.

Normal learner entry does not require the Teacher Administration portal or an evidence-review workflow. Those systems become relevant when an evidence dispute, curriculum integrity concern, mastery review, or teacher-support need exists.

## Canonical placement

The Family Registry owns the current browser-local learner placement record.

Supported placements:

- Pre-K → preschool
- Kindergarten → kindergarten
- Grades 01–05 → elementary
- Grades 06–08 → middle
- Grades 09–12 → high

When an exact grade is present, grade controls the canonical school stage. A caller may not use a contradictory stage to silently override the grade-derived stage.

## Identity rule

A learner is represented by one Academy learnerId and accountId. School portals must consume that identity rather than create a second institutional learner identity.

School-specific preferences, course state, progress, and evidence may be stored separately when they remain keyed to the Academy learner identity and do not replace it.

## Routing rule

NAIB may receive learnerId, stage, grade, surface, and intent and return a public-safe destination recommendation.

NAIB does not:

- change learner identity;
- change formal placement;
- award mastery;
- alter grades.

The public front-door router has a local fallback so school access does not become dependent on shared infrastructure.

## School bridge rule

A school portal may detect that the active learner is registered for another stage or grade. A mismatch should produce a gentle correction path, not an automatic hard redirect. Parent and educator preview access should remain possible.

## Mentor rule

Archaemenes may mentor after learner entry and may adapt educational guidance to learner context. Archaemenes does not independently change placement or award formal mastery.

## Evidence escalation

When course evidence raises a factual, answer-key, structural, or mastery concern, the institutional escalation remains separate from normal entry:

Course evidence → Noema / HTURT evidence reasoning → NAIB → Teacher Administration → Archaemenes advisory → teacher / course / Academy decision.

No evidence engine or mentor may silently modify a grade.

## Public security boundary

The public static Academy may store local browser records and public-safe routing metadata. It must not contain credentials, private backend routes, protected service topology, hidden answer keys, or authentication secrets.

The current family invitation client remains honest about server state. Browser-local enrollment is not represented as an authenticated cross-device account.

## Shared files

- `assets/khaemenes-family-registry.js` — canonical family / learner / placement record
- `assets/khaemenes-naib-mentor-router.js` — learner and educator routing policy
- `assets/khaemenes-front-door-router.js` — active learner front-door adapter
- `assets/khaemenes-family-school-bridge.js` — school-side continuity and mismatch notice
- `family/enroll/index.html` — canonical local enrollment / placement surface
- `student/index.html` — learner-aware Student Portal

## Compatibility

Older learner records that have a stage but no exact grade remain valid. They are treated as legacy placement records and should be prompted for one explicit grade update rather than silently guessing a grade.
