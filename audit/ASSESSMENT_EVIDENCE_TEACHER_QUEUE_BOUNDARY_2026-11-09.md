# Assessment evidence to Teacher Queue: authority-boundary audit

Date: 2026-11-09
Mode: read-only source inspection and synthetic isolated execution.
Scope: Central Academy teacher queue and Archaemenes advisor; Algebra I course mastery authority as a representative consumer.

## Trace established

1. Public Teacher Queue in `teacher-admin/index.html` reads and writes only `khaemenes.evidence-review-holds.v1`. Its local actions are marked unverified on this review branch.
2. `assets/khaemenes-archaemenes-advisor.js` reads the queue to summarize open records, but its advisory workflows use a separate `khaemenes.teacher-advisory-workflow.v1` key. `recordTeacherDecision()` returns `false` and there are no course-score mutations within the inspected code.
3. `assets/khaemenes-learning-continuation.js` maintains separate summary storage, and its status is not formal mastery authority.
4. The representative `Khaemenes_High.github.io/courses/mathematics/algebra-1/assets/mastery-authority-v1.js` reads its own unit, lesson, weekly, midterm and final localStorage keys. It does not consult the Teacher Queue key.
5. No authoritative source-producer for `khaemenes.evidence-review-holds.v1` across every course was established in this audit. GitHub indexed code search yielded no matches, so the investigation cannot claim an exhaustive repository-wide call graph.

## Synthetic execution (in-memory storage mock only)

- With empty storage, unit 1, lesson 1, week 2 and midterm mastery were false.
- Writing a `resolved:true` record under the Teacher Queue key left all four results false.
- A synthetic `khaemenes-algebra1-unit01-progress-v1` `completed:["mastery","u01-l01"]` value was accepted as evidence for both unit and lesson mastery at 80%, even without a numeric score.
- A synthetic `khaemenes-algebra1-weekly-mastery-v2` `attempts:[{mastery_met:true}]` value was accepted as weekly mastery while `best` remained null.
- A structurally complete synthetic midterm attempt with `mastery:true`, 90% score and evaluator-review fields was accepted as reviewed midterm mastery. The validator checks shape, role string, reviewer name, note, review ID, attestation boolean and timestamp; it does not call an authenticated reviewer service.

## Interpretation

PASS: The specific Teacher Queue key is not a direct grading input to the inspected Algebra I mastery module.

RISK: The **browser UI gate** treats editable localStorage fields as mastery evidence. Do not represent these local checks as independent verification or officially authenticated mastery.

UNKNOWN: Whether a separate protected backend would accept or reject those records, and whether analogous weaknesses exist across the other courses. Do not infer a verified STOS production connection from these scripts.

## Recommended next hardening, separately reviewed

1. Define authoritative per-course evidence receipts with course, assessment, learner and evaluator references, verified issuer and integrity validation. Account/grade authority must remain server-side.
2. Keep browser-local results as provisional learning progress until authority is confirmed, without erasing learner work.
3. Replace completion-flag-as-score fallbacks with validated assessment evidence only after mapping all legitimate legacy record formats and migration needs.
4. Change weekly/mastery and evaluator-attestation trust only in a dedicated Algebra I branch with comprehensive regression fixtures: legitimate, legacy, malformed, spoofed and offline.
5. Extend the audit to Elementary, Middle, other High School courses, and the STOS integration boundary before any production release.

No course or production state was changed by this investigation.
