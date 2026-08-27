# Khaemenes Academy Homeschool Compliance Framework — v1

## Purpose

Khaemenes Academy reports and family-account compliance views must support homeschool recordkeeping across the United States without pretending that one national homeschool rulebook governs every family.

The U.S. Department of Education states that regulation of private and home schools is primarily the responsibility of state and local governments. Its State Regulation of Private and Home Schools resource is the national discovery layer for state-by-state requirements. Khaemenes therefore uses a **national academic record core plus a jurisdiction-specific compliance overlay**.

Official federal discovery source:

- U.S. Department of Education — State Regulation of Private and Home Schools: https://www.ed.gov/birth-grade-12-education/education-choice/state-regulation-of-private-and-home-schools
- U.S. Department of Education — Frequently Asked Questions: Non-Public Education: https://www.ed.gov/birth-grade-12-education/education-choice/frequently-asked-questions-non-public-education

The Department of Education pages are reference/discovery sources. When a state requirement affects a family-facing compliance checklist or generated report, the implementation should also cite the current official state statute, administrative code, state education agency guidance, or other authoritative state source whenever available.

## Legal-status boundary

Khaemenes Academy provides **compliance-support records**, not legal certification or legal advice.

The parent or guardian remains responsible for satisfying filing, notice, evaluation, attendance, portfolio, testing, retention, and other legal requirements that apply in the family's jurisdiction.

The software must never claim that a family is legally compliant merely because a dashboard item is marked complete.

## Architecture

```text
National Academic Record Core
            │
            ▼
Family Jurisdiction Profile
            │
            ▼
State / Territory Ruleset
            │
            ├── official sources
            ├── effective / reviewed dates
            ├── required actions
            ├── required evidence
            └── retention / evaluation rules
            │
            ▼
Student + Family Reports
```

## Family jurisdiction profile

Each protected Family Account should support:

```text
country
stateOrTerritory
countyOrDistrict      optional where legally relevant
educationPath         home-education / umbrella / private-school / other
academicYear
rulesetId
rulesetVersion
rulesetReviewedAt
```

Changing jurisdiction must not silently rewrite historical reports. A report retains the ruleset version that governed it when generated.

## National academic record core

The national core is the consistent Khaemenes educational record independent of state-specific legal requirements. It may include:

- family and learner identifiers;
- academic year;
- grade/level and school pathway;
- enrolled courses;
- instructional activity dates;
- lesson completion;
- assignments and work products;
- assessment attempts and scores;
- mastery status and mastery threshold;
- corrections and retakes;
- projects and capstones;
- reading/resource log;
- portfolio evidence index;
- attendance/activity evidence where tracked;
- course grades and credits where applicable;
- progress reports;
- report cards;
- transcripts;
- certificates and course-completion records.

This academic record core does not by itself assert legal compliance.

## Jurisdiction-specific compliance overlay

Each ruleset may describe only requirements supported by authoritative sources. The schema should support the following categories without assuming every state uses them:

```text
noticeOrRegistration
compulsoryAttendanceAge
requiredSubjects
instructionTimeOrAttendance
portfolioOrRecordkeeping
readingMaterialLog
workSamples
evaluationOrTesting
annualReporting
teacherOrParentQualifications
assessmentOptions
recordRetention
withdrawalOrTermination
publicSchoolAccess
specialEducationAccess
otherStateSpecificRequirements
```

Each requirement should carry:

```text
requirementId
status: required | conditional | recommended | not-required | unknown
summary
appliesWhen
sourceTitle
sourceAuthority
sourceUrl
sourceCitation
sourceEffectiveDate
sourceReviewedAt
rulesetVersion
```

If a requirement has not been verified against an authoritative current source, its status must be `unknown`, not guessed.

## Source authority order

Use the highest-authority current source available:

1. state constitution/statute or administrative code;
2. official state department/agency guidance;
3. official local district/superintendent guidance where the rule is local;
4. U.S. Department of Education state-regulation summary as a national discovery/reference layer;
5. secondary legal summaries only as research leads, never as sole authority for a compliance rule.

## Ruleset freshness

Every state/territory ruleset must be versioned and date-stamped.

Recommended fields:

```text
rulesetId
jurisdiction
version
publishedAt
reviewedAt
effectiveFrom
effectiveTo
sourceCount
verificationStatus
supersedes
```

A ruleset that has exceeded the Academy's review interval should display **Review Required** rather than presenting stale requirements as current.

## Family dashboard

The Family Profile should surface legal/administrative responsibilities separately from academic progress.

Example:

```text
Home Education Compliance Support
Jurisdiction             <state>
Ruleset                  <version>
Last Verified            <date>

Requirement              Status
Notice / Registration    Required / Complete / Due
Portfolio                 In Progress
Reading Log               Current
Work Samples              Current
Annual Evaluation         Due <date>
Record Retention          <state rule>
```

Every requirement must offer a source/details view.

## Student dashboard

Students should primarily see their own academic information, not family legal administration.

The Student Profile should surface:

- courses and current position;
- lesson/assignment completion;
- assessment scores;
- visible mastery threshold;
- review/retake status;
- projects and portfolio work;
- recent learning activity;
- progress reports and student-facing records.

Sibling records and family compliance administration are not student-authority data.

## Reports

Generated reports should state:

```text
studentId
familyId where parent report
academicYear
jurisdiction
educationPath
rulesetId
rulesetVersion
rulesetReviewedAt
generatedAt
recordType
```

A compliance-support report should include its authoritative source list and the statement that the report supports family recordkeeping and does not itself constitute a government filing, legal certification, or legal advice.

## Mastery and educational evidence

Khaemenes mastery rules are academic rules, not state-law claims. When a course uses an 80% mastery gate, reports should distinguish:

```text
Academic mastery requirement: 80%
Student score: <score>
Academic status: Mastered / Review & Retake
Legal homeschool requirement: determined separately by jurisdiction ruleset
```

A state requirement must never be inferred from the Academy's internal mastery policy.

## Enrollment identity

Human-readable enrollment numbers may be sequential for administration while internal continuity keys remain non-sequential and non-secret.

```text
KA-FAM-001  founding family enrollment number
KA-STU-001  founding student enrollment number

familyId    immutable internal identifier
learnerId   immutable internal learner continuity key
```

Enrollment numbers are never recycled and are never authenticators.

## Privacy and authority

### Student view

Only the student's own academic/profile data and student-safe records.

### Family view

Authorized learners' academic summaries, records, compliance-support checklist, credential/session management, and authorized-adult controls.

### Academy admin view

Enrollment sequence/counters, account status, ruleset administration, source-review status, sanitized audit evidence, and aggregate operational information.

No ordinary family account may view Academy-wide enrollment records or another family's data.

## Ruleset change handling

When a verified requirement changes:

1. create a new ruleset version;
2. preserve the previous version for historical reports;
3. record source and review provenance;
4. identify affected families by jurisdiction without exposing family content to the rules engine;
5. show a family-facing `Requirements Updated` notice;
6. never rewrite completed historical reports silently;
7. require human administrative review for ambiguous legal changes.

## Release gates for compliance reporting

Do not label a report or dashboard requirement as state-law based until:

- jurisdiction is known;
- the requirement is backed by an authoritative current source;
- source URL/title/citation are stored;
- ruleset version and review date are present;
- applicability conditions are represented;
- historical ruleset preservation is working;
- family/student privacy boundaries are tested;
- generated reports identify their ruleset version;
- stale/unknown requirements fail visibly rather than being guessed.

## Nationwide implementation sequence

1. Build the ruleset schema and source registry.
2. Build the national academic record core.
3. Build Family Profile v2 and Student Profile v2 against that core.
4. Verify and enter state/territory rules systematically from authoritative sources.
5. Test materially different regulatory models before nationwide release.
6. Add ruleset-change monitoring and administrator review.
7. Generate jurisdiction-aware progress, portfolio, annual-summary, transcript, and compliance-support reports.

The compliance engine must remain independent from 333 Network identity and communication services. Optional 333 linking cannot change jurisdiction, grades, mastery, placement, records, or homeschool compliance state.
