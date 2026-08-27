# Khaemenes Academy Student + Family Profiles — v2 Architecture

## Purpose

Replace the current sparse launcher-style Student Portal and Family Learning Center with informative academic dashboards that are useful for day-to-day learning, parent oversight, records, and homeschool compliance support.

The profiles consume protected account context and academic records. They do not become grading authorities and do not store authentication secrets in browser storage.

## Student Profile v2

The student profile should show the learner's own academic information only.

### Identity and placement

- Khaemenes Student enrollment number, e.g. `KA-STU-001`;
- grade/level and school;
- academic year;
- enrollment status;
- mentor identity;
- learner goals/interests where the family/student chooses to store them.

Internal `learnerId` remains a protected continuity identifier and is not used as a human-facing credential.

### Academic overview

- courses enrolled;
- courses completed;
- lessons completed;
- current mastery;
- assessments passed;
- review/retake items;
- current unit/lesson;
- last academic activity.

### Course cards

Each course card should support:

```text
courseId
title
currentUnit
currentLesson
completionPercent
lessonCountCompleted
lessonCountPlanned
assignmentCompletion
quizMastery
midterm
final
capstone
masteryThreshold
masteryStatus
lastActivityAt
nextAction
```

A course using the Academy 80% mastery gate must show the threshold and the learner's current status clearly.

### Student records

- progress reports;
- report cards;
- student-facing transcript view;
- certificates;
- portfolio/project evidence;
- reading/resource log where relevant.

### Privacy

A student does not receive sibling academic records or Family Account legal/compliance administration simply because the learners share a Family Account.

## Family Profile v2

The Family Profile is the authorized adult command center.

### Family identity

- family enrollment number, e.g. `KA-FAM-001`;
- Family Account status;
- academic year;
- jurisdiction;
- education path;
- authorized adults;
- student count.

### Family academic overview

- active students;
- active courses;
- courses on track;
- courses needing attention;
- recent assessments;
- upcoming review/retake needs;
- recent learning activity.

### Student summary cards

Each authorized learner card should show:

- Student enrollment number;
- grade and school;
- active courses;
- course completion/mastery summaries;
- recent assessment results;
- review/retake flags;
- links to Student Profile, progress, records, and authorized account management.

### Homeschool compliance support

The Family Profile consumes the verified jurisdiction ruleset defined in `HOMESCHOOL_COMPLIANCE_FRAMEWORK_V1.md`.

It should show:

```text
jurisdiction
educationPath
rulesetVersion
rulesetReviewedAt
requirementsUpdated flag
requirements[]
```

Each requirement may display `Required`, `Conditional`, `Recommended`, `Not Required`, `Unknown`, `Current`, `Due`, `Overdue`, or `Review Required` only when that status is supported by the ruleset and family evidence.

Every state-law-based requirement must provide a source/details view.

### Family records

- portfolio index;
- reading/resource log;
- work samples;
- attendance/activity evidence where relevant;
- annual summary/evaluation support;
- progress reports;
- report cards;
- transcripts;
- course completion records;
- export/print tools.

### Account and security

Authorized adults may access:

- student credential creation/reset;
- active session/device summaries;
- session revocation;
- authorized-adult management;
- account recovery status;
- security/audit notices that are safe for the family to see.

Passwords, password hashes, refresh tokens, signing secrets, recovery secrets, and anti-abuse internals are never displayed.

## Academy Admin boundary

Academy-wide enrollment totals and sequence counters belong only in protected administration.

Examples:

```text
Families       001
Adult Accounts 001
Students       001
```

Ordinary family/student profiles must not expose another family's identifiers, records, aggregate account lists, or private administrative state.

## Reporting metadata

Every generated academic/compliance-support report should carry:

```text
recordType
studentEnrollmentNumber
familyEnrollmentNumber where authorized
academicYear
jurisdiction
educationPath
rulesetId
rulesetVersion
rulesetReviewedAt
generatedAt
```

The report must distinguish Academy academic policy from legal homeschool requirements.

## Initial founding records

The protected enrollment authority may begin with:

```text
KA-FAM-001
└── KA-STU-001
```

These are human-readable enrollment numbers. They are never passwords, session IDs, or authorization keys.

## Release sequence

1. Protect Family/Student identity and sessions.
2. Implement authoritative enrollment sequences.
3. Implement national academic record core.
4. Implement ruleset schema/source registry.
5. Render Student Profile v2.
6. Render Family Profile v2.
7. Connect verified state/territory rulesets.
8. Generate jurisdiction-aware reports.
9. Test cross-family and cross-student isolation.
10. Release only after account, academic, and compliance-report gates pass.
