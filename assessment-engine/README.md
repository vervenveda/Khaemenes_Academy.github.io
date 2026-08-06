# Khaemenes Academy Universal Assessment Engine

Foundation release **v0.1** establishes one reusable assessment system for every
Khaemenes Academy subject, grade band, and evidence type.

## What is included

- A working `index.html` landing page and interdisciplinary diagnostic.
- Fixed and constrained-adaptive assessment delivery.
- Local autosave, resume, restart, and JSON export.
- Objective, exploratory, and human-review evidence records.
- Domain mastery and confidence summaries.
- Universal JSON schemas for assessments, items, attempts, and learner profiles.
- Framework, privacy, authoring, and validation documents.
- Links to the existing career and mentor applications in `apps/`.

## Preserve the existing apps folder

This starter intentionally does **not** replace your existing:

- `apps/career_assessment_index.html`
- `apps/career_star_ind`
- `apps/mentor_review_index.ht`

Merge the supplied folders and files into the existing `assessment-engine/`
directory.

For normal GitHub Pages behavior, the two shortened filenames should later be
normalized to:

- `career_star_index.html`
- `mentor_review_index.html`

Update links only after the files are renamed.

## Directory structure

```text
assessment-engine/
├── index.html
├── README.md
├── assets/
│   └── engine.css
├── engine/
│   ├── app.js
│   ├── assessment-core.js
│   ├── adaptive-selector.js
│   ├── scoring-engine.js
│   └── storage-engine.js
├── banks/
│   └── foundation/
│       └── demo-readiness.json
├── schemas/
│   ├── assessment.schema.json
│   ├── item.schema.json
│   ├── attempt.schema.json
│   └── learner-profile.schema.json
└── docs/
    ├── ASSESSMENT_FRAMEWORK.md
    ├── ITEM_AUTHORING_GUIDE.md
    ├── PRIVACY_AND_DATA.md
    └── VALIDATION.md
```

## Testing on GitHub Pages

Open:

```text
https://vervenveda.github.io/Khaemenes_Academy.github.io/assessment-engine/
```

The JSON question bank is loaded with `fetch()`, so the demonstration must be
served over HTTP/HTTPS. Opening `index.html` directly from a local filesystem may
be blocked by browser security rules.

## Registering the next assessment

1. Copy `banks/foundation/demo-readiness.json`.
2. Give the assessment and every item permanent unique IDs.
3. Assign standards, domains, difficulty, prerequisites, and feedback.
4. Validate against `schemas/assessment.schema.json`.
5. Change the bank path in `engine/app.js`, or add an assessment catalog in the
   next release.

## Non-negotiable rules

- Randomness may select an eligible learning item; it never assigns a grade.
- Formal assessments retain a fixed blueprint and comparable difficulty.
- Interests and preferences are temporary signals, not permanent labels.
- Teacher-reviewed evidence is never silently converted into an automatic score.
- Learners must be able to inspect, export, correct, and reset local evidence.


## Centered typography release

This package applies the requested presentation standard to the Assessment Engine
landing page and all three application pages:

- centered page structure, headings, controls, cards, and form content;
- black text only;
- Cinzel title and heading typography;
- Brandon Grotesque as the preferred body face, followed by compatible system
  fallbacks because the commercial font file is not distributed with the package;
- breadcrumbs to Khaemenes Academy Home and the Assessment Engine;
- normalized `.html` filenames for Career Star and Mentor Review.

After uploading the normalized pages and confirming links, the two shortened
legacy files may be removed:

- `apps/career_star_ind`
- `apps/mentor_review_index.ht`
