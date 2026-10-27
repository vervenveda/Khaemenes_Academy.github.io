# Khaemenes Mathematics Continuum

The Khaemenes Mathematics Continuum is the shared public mathematics information contract for the Khaemenes educational ecosystem.

It spans Pre-K, Kinder Garden, Elementary, Middle School, High School, Higher Learning, and advanced/research mathematics.

The canonical file is `khaemenes-mathematics-continuum.json`.

Courses may draw shared stage definitions, mathematics strands, proof/evidence vocabulary, approved public mathematics tools, bounded Mathematics Resource Cloud capabilities, and course-ID rules from the continuum.

Each course remains authoritative for its own lessons, assessments, sequence, learner work, mastery decisions, and local records.

The continuum is optional at runtime. A course must continue with its local curriculum if the shared file is unavailable.

ARSHIF preserves dated historical snapshots for provenance and reconstruction. Archived snapshots are not live course dependencies.

Reference consumer 001 is Advanced Geometric Topology, Global Geometry & Mathematical Physics (`KH-HL-AGTGMP`).


## Archaemenes: Released-Lesson Mathematics Pilot (2026-10-26)

This is an additive pilot in the existing Academy Mentor and school learning-context
publishers, **not** another mathematics curriculum or assessment authority.

Initial authored source matches:
- Elementary Grade 02, Mathematics Week 01, `elementary-grade-02-mathematics/week-01`:
  released heading *Scholar Routines and Reading Stamina*, with the published
  focus *number habits and strategy talk*.
- Middle Grade 07, Mathematics Week 05, `middle-grade-07-mathematics/week-05`:
  released heading *Operations with Rational Numbers* and published essential question.
- High School Algebra I, Unit 01 Lesson 01, `math-algebra1-integrated1/u01-l01`:
  released lesson objective on mathematical claims and justification, drawn
  from the authored `KHAE_UNIT01` lesson data.
- Higher Learning Linear Algebra, Unit 01 Lesson 01, `higher-learning-linear-algebra/u01-l01`:
  released vectors/coordinates focus from the public course and lesson.

The existing `khaemenes-archaemenes-conversation-v2.js` now has two **new,
independent, ungraded formative prompts** for each of these four matched
lessons. A lesson is matched by stage, grade where applicable, canonical
courseId, lessonId, and title. No match means no claim that general practice
is lesson-specific.

### Protected boundaries

- Course/lesson files remain canonical for objectives, grading, mastery,
  learner evidence, and published review skills.
- Mentor context allows only released lesson metadata and already-sanitized
  learner progress; assessment prompts, selections, instructor notes, and
  answer keys are never forwarded.
- Teacher marking keys require a **separately authenticated server-enforced
  educator workflow**, not a browser-only button or a link to public files.
- No new styles, forms, click/submit handlers, or external reasoning provider
  were introduced. Existing learner controls and the 80% formal course
  mastery rule remain unchanged.
- JavaScript syntax, metadata-match, fresh-practice answers, unknown-lesson
  fallback, and non-disclosure tests were checked with fictional contexts.
- **Not certified**: live-browser navigation and saved-score journey across
  all campuses; educator backend authorization; all remaining lessons and
  mathematics courses. Do not treat this four-lesson pilot as full curriculum
  coverage.

Next certification: representative lesson -> practice -> official quiz ->
published result -> mentor remediation -> fresh practice for each campus,
including two-learner isolation and browser reload.

## Round 2 — Nine more released Mathematics pathways (2026-10-26)

This surgical expansion raises the **exact lesson identity matching pilot** from
4 to 13 released lessons. It is NOT a claim of full-course coverage.
The Academy's existing conversation engine still owns the formative practice,
while each school's existing context publisher supplies only student-released
lesson title, source-derived learning focus/objective summary, course ID,
lesson ID, grade/week where relevant, and already-filtered feedback.

| Stage | Source lesson and canonical published title | Practice subject | Existing publisher |
|---|---|---|---|
| Elementary 03 | `grades/grade-03/subjects/mathematics/week-01.html` · Third Grade Scholar Launch | Division / equal grouping | `Khaemenes_Elementary.github.io/assets/khaemenes-elementary-experience.js` |
| Elementary 04 | `grades/grade-04/subjects/mathematics/week-01.html` · Fourth Grade Scholar Launch | Whole-number place value | Same Elementary publisher |
| Elementary 05 | `grades/grade-05/subjects/mathematics/week-01.html` · Fifth Grade Scholar Launch | Decimal place value | Same Elementary publisher |
| Middle 06 | `grades/grade-06/subjects/mathematics/week-01.html` · Ratios and Unit Rates: Scholar Launch | Ratios / unit rates | `Khaemenes_Middle.github.io/assets/khaemenes-middle-learning-context.js` |
| Middle 08 | `grades/grade-08/subjects/mathematics/week-01.html` · Eighth Grade Scholar Launch | Linear relationships | Same Middle publisher |
| High · Pre-Algebra | `courses/mathematics/pre-algebra/units/unit-01/lessons/lesson-01-number-systems.html` · Number Families & the Real Number System | Number classification | `Khaemenes_High.github.io/courses/shared/high-school-learning-context-v1.js` |
| High · Geometry | `courses/mathematics/geometry/units/unit-01/lessons/u01-l01.html` · Points, Lines, Planes & Defined Terms | Definitions / incidence | Same High publisher |
| High · Algebra II | `courses/mathematics/algebra-2/units/unit-01/lessons/u01-l01.html` · Function Language, Notation & Evaluation | Substitution / evaluation | Same High publisher |
| Higher · Calculus I | `courses/mathematics/calculus-1/units/unit-01/lessons/u01-l01.html` · Function Language, Units & Multiple Representations | Functions, domains, output/input units | `Khaemenes_Higher_Learning.github.io/assets/khaemenes-higher-learning-bridge.js` |

- **Content evidence:** published lesson headings and instructional material
  were read directly from `main`. Mentor objective fields are bounded,
  source-derived **focus summaries**, not asserted to be complete verbatim
  copies of every day-level objective in the course. Exact day-level objective
  publication awaits lesson-by-lesson academic verification.
- **Practice:** nine new banks, two new formative prompts apiece, no questions
  copied from official tests or educator keys.
- **Elementary:** Grade 03–05 Week 01 context is published only when the
  existing grade/weekly position and learner's completed Mathematics
  checkpoint match, preserving the original Grade 02 release boundary.
- **Middle:** Grade 06 and 08 Week 01 are added alongside the preserved
  Grade 07 Week 05 route.
- **High:** route-matched Pre-Algebra, Geometry and Algebra II first-lesson
  context is added alongside the existing authored Algebra I lookup.
- **Higher:** existing released Linear Algebra Lesson 01 remains available.
  The Higher bridge also supports Calculus I Lesson 01, and that exact Calculus
  page now loads the same bridge. When the bridge runs outside a matching
  release route, it clears its own known prior pointer.
- **Authority unchanged:** canonical ArchaemenesCore v3.2.0; Academy Family
  Registry; NAIB routing; course-owned mastery (80% minimum where applicable);
  verified score/skill publication; educator-only answer-key workflow. No new
  CSS, new message submit handlers, alternate math scoring system, or AI
  model/API connection.
- **Mock integration tests:** fictional learner contexts passed for all nine
  school publisher → lesson metadata → existing mentor practice cases, with
  one unmatched Middle week and one Higher stale-context clearing check. All
  touched JavaScript files parsed successfully on readback.
- **Not yet certified:** actual student-browser journey (lesson → fresh
  practice → official quiz → saved score → mentor remediation → revisit),
  teacher server authorization, multi-learner browser reload, every additional
  week/unit, and the day-level objectives' full exact text. No GitHub combined
  status checks were returned for the new commits.

Round 2 `main` commits: Academy `92129c2b7`, Elementary `75990b046`,
Middle `7a63d2579`, High `a9ba232fd`, Higher bridge `d17de1174`,
Calculus lesson `88c890bd7`.

Next step: use the same existing released-context and original-formative
contract for subsequent *verified* lessons; never promote an unreviewed source
summary to an authoritative daily objective or a formative check to mastery.
