# Khaemenes Academy Universal Access & Mastery Contract v1

Status: canonical public-safe Academy policy

## Mission

Khaemenes Academy is a universal free education platform for learners of every age.

Access to education is never conditioned on tuition, subscription, paid membership, or purchasing advancement. Formal academic advancement is earned through demonstrated mastery.

> Education is universally accessible. Advancement is earned through demonstrated mastery, never purchased.

## Lifelong learning ladder

The canonical Academy learning ladder is:

Verve N Veda public gateway → Khaemenes Academy → Preschool / Pre-K → Kindergarten → Elementary → Middle School → High School → Higher Learning → Continuing / Lifelong Learning.

A learner may enter at the age-appropriate or academically appropriate point. The Academy identity and continuity architecture should remain stable while presentation, curriculum depth, mentor style, and course expectations mature with the learner.

## Preschool distinction

Khaemenes Preschool intentionally has two access layers.

### 1. Open Preschool Learning Garden

The public Preschool exploration layer remains open and free to everyone without registration.

It may include:

- stories and read-aloud experiences;
- games and playful practice;
- art and music activities;
- language exploration;
- number and shape exploration;
- movement and wellness activities;
- science and nature discovery;
- other unscored public learning resources.

Open exploration does not create formal academic advancement, formal mastery, or an Academy completion record.

### 2. Formal Preschool Curriculum

When a family chooses the structured Preschool curriculum, the learner enters the formal Academy progression system.

Formal Preschool curriculum work is learner-linked and follows the same mastery rules as the rest of the Academy.

The open Learning Garden must never be treated as a bypass around formal curriculum prerequisites.

## Universal mastery threshold

Every scored formal curricular checkpoint requires at least **80% mastery** before it may unlock required downstream curriculum.

This includes, where applicable:

- scored lesson practice;
- weekly quizzes;
- unit mastery assessments;
- scored projects and rubric checkpoints;
- remediation exits;
- midterms;
- finals;
- prerequisite assessments that explicitly control placement or progression.

A course may require stronger evidence than 80%, but it may not lower the Academy progression threshold below 80% for a scored gate without an explicit Academy policy exception.

## Review is not mastery

Opening a lesson, reading a page, watching material, spending time on a surface, clicking a completion control, or reviewing an answer does not by itself create mastery.

`reviewed` and `mastered` are separate states.

A progression gate may only consume qualifying mastery evidence.

## Sequential progression

Formal curricula fail closed.

A learner may not unlock a required future lesson, quiz, unit, examination, or other gated curricular checkpoint until the prerequisite mastery contract has been satisfied.

Direct URL entry must not create an unlock.

Navigation visibility must not be treated as authorization to advance.

A course may allow educator/admin preview, but preview must never mutate learner mastery or progression state.

## Best demonstrated mastery

Where repeated practice or reassessment is allowed, the Academy should preserve the learner's best demonstrated qualifying mastery unless a deliberate formal reset or reassessment policy says otherwise.

A later lower practice result must not silently erase an earlier valid mastery pass.

Attempt history may be retained separately from best mastery.

## Reassessment and remediation

A learner who has not yet reached 80% remains in the current curricular scope.

Courses should provide age-appropriate remediation, explanation, additional practice, reflection, correction, alternate examples, and/or parallel assessment forms before reassessment.

Failure is a routing signal for more learning, not a payment gate.

## Assessment exposure rule

Locked future scored assessments must not be intentionally exposed through normal learner navigation, mentor guidance, public indexes, answer keys, or preview controls.

For high-integrity assessments, the preferred architecture is to avoid delivering future locked item banks to the learner's browser until the learner is eligible to attempt them.

Static public repositories cannot provide strong secrecy for assessment material that is shipped in public source files. Courses that require protected future test banks should use an authorized assessment delivery service or another access-controlled mechanism rather than relying only on hidden HTML or JavaScript.

## Mentor boundary

Mentors support learning inside the learner's permitted academic scope.

Mentors may:

- explain concepts;
- give clues and examples;
- recommend unlocked resources;
- help diagnose misunderstandings;
- support study habits and reflection;
- adapt tone and presentation to learner stage and subject.

Mentors must not:

- award formal mastery;
- change grades or placement;
- manufacture unlock receipts;
- reveal locked future quiz/test questions or answer keys;
- silently complete scored work for the learner;
- bypass course prerequisites.

The institutional mentor and any subject specialist operate under the same authority boundary.

## Admin boundary

Authorized Admin / educator preview may inspect curriculum architecture for quality assurance, accessibility, assessment integrity, and support.

Admin preview is not learner progression.

Admin tools must not accidentally mark a learner as mastered merely because an administrator opened or inspected a future lesson or assessment.

Protected learner records, credentials, authentication secrets, and private assessment material do not belong in public static administration code.

## Beta boundary

The Verve N Veda Beta Program is a QA and feedback layer, not an academic authority.

Beta may identify public surface metadata needed to report a page or feature. It must remain separate from grades, mastery, learner placement, answers, assessment content, and progression receipts.

Beta participation cannot unlock curriculum.

## Authority model

- **Verve N Veda** — universal public gateway and ecosystem navigation.
- **Family Registry / Account layer** — learner identity and formal placement.
- **NAIB** — routing and mentor assignment policy; never mastery authority.
- **Mentor system** — educational guidance and advisory support.
- **Course engines** — course-specific mastery calculation and progression evidence.
- **Teacher / Academy authority** — documented institutional decisions and corrections.
- **Admin** — authorized operations, oversight, QA, and educator support.
- **Beta** — public-safe product/testing feedback.

No layer may silently assume another layer's authority.

## Stage continuity

The formal learner identity should remain continuous across:

Preschool → Kindergarten → Elementary → Middle → High → Higher Learning.

Stage-specific repositories may maintain local academic state, but that state should be learner-scoped and must not create a competing Academy identity.

Higher Learning may support self-directed adult scholars while preserving the same learner-scoped continuity and authority boundaries.

## Implementation requirement

New or hardened formal courses should expose machine-verifiable progression rules whenever practical, including:

- mastery threshold;
- prerequisite identifiers;
- best-score behavior;
- attempt history behavior;
- locked/unlocked state;
- distinction between review and mastery;
- assessment eligibility;
- authority/source of completion receipts.

Validators should fail when a formal course can advance a learner below the Academy threshold or when review state is treated as mastery.
