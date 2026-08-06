# Khaemenes Academy Assessment Framework

## Purpose

The Khaemenes Academy Universal Assessment Engine records trustworthy learning
evidence across every course while preserving teacher authority, learner dignity,
accessibility, and transparent scoring.

The engine supports:

- readiness diagnostics;
- guided and independent practice;
- retrieval and transfer practice;
- quizzes, unit tests, midterms, and final examinations;
- essays and constructed responses;
- laboratories and engineering tasks;
- performances, portfolios, and projects;
- student reflection;
- career and pathway exploration;
- teacher, parent, and mentor reports.

## Evidence is broader than a percentage

Every attempt may retain:

- the response;
- score and possible points;
- standards and competencies;
- difficulty;
- misconceptions;
- assistance or accommodations;
- response timestamp;
- rubric or human-review requirement;
- revision and retake history;
- mastery and confidence estimates.

A single course grade must never erase the evidence beneath it.

## Assessment modes

### Diagnostic

Identifies readiness, prerequisite gaps, and possible misconceptions. Diagnostic
results guide instruction and are not automatically treated as final grades.

### Practice

May use hints, feedback, retries, retrieval scheduling, and constrained adaptive
selection.

### Quiz

Provides a limited verification snapshot. A quiz may be fixed or use equivalent
items inside a published blueprint.

### Formal

Used for cumulative or high-consequence verification. Required controls include:

- stable blueprint;
- standards balance;
- controlled difficulty;
- defined resources and time rules;
- protected scoring keys;
- equivalent alternate forms;
- printable backup;
- audit trail;
- teacher-controlled reassessment.

Formal mode uses stable item order in foundation v0.1. Later releases may
randomize only within equivalent blueprint cells.

### Performance and portfolio

Records authentic work scored by a rubric or reviewed by an authorized educator.
The engine may organize evidence, but it does not invent a score where human
judgment is required.

### Career and exploration

Collects interests, self-reported strengths, values, and preferences. These
signals are exploratory and revisable. They may suggest experiences but must not
restrict a learner's future.

## Constrained adaptive selection

The adaptive selector considers:

- current mastery need;
- blueprint coverage need;
- active misconceptions;
- appropriate challenge;
- student interest;
- prior item exposure.

Selection occurs only among eligible items. Eligibility requires:

- the item has not already been answered in the attempt;
- the item is active;
- prerequisites are sufficiently supported;
- exposure limits are respected;
- the item is allowed in the current assessment mode.

The initial policy weights are:

| Signal | Weight |
|---|---:|
| Mastery need | 0.32 |
| Blueprint need | 0.22 |
| Misconception need | 0.16 |
| Challenge fit | 0.14 |
| Interest fit | 0.08 |
| Exposure control | 0.08 |

These weights govern **item selection**, never grading.

## Mastery and confidence

Foundation v0.1 calculates domain mastery as weighted evidence from scored items.
Difficulty slightly adjusts evidence weight. Confidence increases with repeated
evidence and is capped until at least five relevant attempts are present.

This is an instructional estimate, not psychometric certification. Future
calibration may add Bayesian knowledge tracing or item-response models after the
Academy has enough validated data.

## Reassessment

A reassessment record should preserve:

- the original attempt;
- corrections or explanation;
- assigned intervention;
- new attempt;
- score policy;
- teacher decision;
- date and evidence used.

Deleting the first attempt is not an acceptable reassessment policy.

## Roles

### Student

Can see progress, evidence, recommended next steps, revisions, and exports.

### Parent or guardian

Can see course progress, missing work, mastery summaries, and authorized reports.

### Teacher or mentor

Controls blueprints, scoring keys, rubrics, accommodations, retakes, and final
interpretation.

### Administrator

Controls schema versions, catalogs, privacy policy, data retention, and audits.

## Accessibility

Every production assessment must provide:

- keyboard operation;
- visible focus;
- sufficient contrast;
- semantic headings and labels;
- screen-reader-compatible controls;
- zoom and responsive layouts;
- print alternatives;
- accommodation metadata;
- equivalent content rather than reduced expectations unless an authorized plan
  requires modification.

## Integrity principle

The engine should help the Academy ask better questions and preserve better
evidence. It must never hide uncertainty behind technological language.
