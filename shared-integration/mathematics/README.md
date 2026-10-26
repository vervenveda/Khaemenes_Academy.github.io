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
