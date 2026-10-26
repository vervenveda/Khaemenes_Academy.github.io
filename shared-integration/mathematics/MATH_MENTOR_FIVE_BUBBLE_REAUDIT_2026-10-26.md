# Archaemenes Mathematics · Five-Bubble Forensic Reaudit
Date: 2026-10-26
Branch: main
Scope: Elementary, Middle, High School, Higher Learning released-lesson pilot
Canonical persona: artist1970/CORE/ArchaemenesCore v3.2.0

## Guardrails
- This is an additive repair to the existing Academy conversation engine and the existing Higher Learning context publisher.
- Existing CSS, lesson content, quizzes/tests, Family Registry, course grading, mastery threshold (80%), teacher access controls, and published storage contracts were not modified.
- Mentor practice is independent, original, ungraded, and cannot certify mastery or alter scores.
- No official teacher answers, locked assessment banks, learner selections or marking keys were added to the mentor.
- A browser-side flag is not educator authorization; answer keys remain out of student mentoring.

## Five confirmed bubbles and repairs
1. **Exact lesson intent priority.** A user asking for help with an Algebra I lesson could trigger the generic equations routine before the released-lesson match. The existing coach now handles an explicit lesson-help request before generic topic routing; its lesson match still requires stage, course, lesson, title, and grade/week as applicable.
2. **Cross-course feedback.** A current mathematics lesson could inherit review skills and a score from a separate recent science assessment. Current released-lesson feedback now accepts only records with a matching courseId; missing course identifiers do not establish alignment.
3. **Stale practice state.** On changing released lesson identities or leaving a released lesson, a previous question and expected answer could survive. The existing coaching state now stores the current released-lesson scope and clears only active practice fields when that scope changes.
4. **Higher Learning stale publisher.** The Linear Algebra unit 01 lesson publisher retained its last released-lesson slot on non-lesson navigation. When the existing Higher bridge runs outside the authorized lesson route (or with no matching active scholar), it clears its own previous Linear Algebra lesson pointer without changing formal course records.
5. **Fraction equivalence.** Correct alternative rational representations (such as 2/4 instead of 1/2) were marked wrong in new ungraded practice. The existing practice checker now compares finite rational values in a bounded range and rejects zero denominators; formal assessment grading remains untouched.

## Main commits
- Academy mentor runtime: `826d97ff25d6fb1e650d4e74ac41b05192d4bfd9`
- Higher Learning bridge: `9fba2040fc1862cc0f8dd223354721e4df59dd3e`

## Readback and validation
- Updated JavaScript files fetched from main and parsed successfully.
- Fictional contextual dialogue tested: Algebra lesson match, off-course review skill exclusion, switching to Middle Mathematics, invalidated old attempt, and equivalent fractions.
- Post-commit exact-match practice checked for Elementary Grade 02 Week 01, Middle Grade 07 Week 05, High Algebra I Unit 01 Lesson 01, and Higher Linear Algebra Unit 01 Lesson 01.
- Unknown-lesson fallback checked to make sure no unrelated practice is presented as matched.
- No CSS or submit handler was added; existing course and Academy interfaces are retained.
- GitHub combined status returned no individual status checks for either repaired commit.

## Remaining certification (not yet completed)
- Live-browser navigation including Higher Learning's off-lesson publisher branch, course → mentor → quiz return.
- Fictional two-learner identity isolation through complete browser reload and cross-tab switching.
- Course-specific official results saved then read through the Academy's already-sanitized published context.
- Academic-content review of the Grade 02 week-level cross-disciplinary heading before interpreting it as a day-level mathematics objective.
- Authenticated server-enforced educator answer-key review; this is not implemented via the mentor.
- Rollout beyond the four released Mathematics pilot lessons, one canonical course-owned objective and authored formative bank at a time.
