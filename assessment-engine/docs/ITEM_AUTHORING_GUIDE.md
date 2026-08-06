# Assessment Item Authoring Guide

## Permanent IDs

Use stable, readable IDs:

```text
SCI10-U03-MOLECULES-MC-017
ALG1-U05-LINEAR-NUM-004
ELA11-U02-RHETORIC-ER-006
CIV12-U04-POLICY-PERF-002
```

Never reuse an ID for a different question. Revise the assessment version when
meaning changes.

## Required fields

Each item needs:

- `id`
- `type`
- `prompt`
- `points`
- `domains`

Scored objective items also require an answer rule.

## Supported foundation types

| Type | Automatic scoring |
|---|---|
| `single-choice` | Exact option match |
| `multi-select` | Exact set or configured partial credit |
| `numeric` | Numeric answer with optional tolerance |
| `likert` | Exploratory signal; not graded |
| `short-response` | Human review |
| `extended-response` | Human review |
| `performance` | Human review |

## Domain evidence

A domain is a skill or competency recorded across items.

```json
"domains": [
  { "id": "science-analysis", "weight": 1 },
  { "id": "reading-evidence", "weight": 0.35 }
]
```

Keep domains specific enough to guide instruction but broad enough to collect
repeated evidence.

## Standards

Standards tags document alignment; they do not prove alignment by themselves.
The item prompt, expected reasoning, and scoring rule must actually require the
standard.

```json
"standards": ["HS-PS1-3", "RST.9-10.1"]
```

## Difficulty

Use a provisional `0` to `1` scale:

- `0.10–0.29`: foundational;
- `0.30–0.49`: developing;
- `0.50–0.69`: proficient;
- `0.70–0.89`: advanced transfer;
- `0.90–1.00`: exceptional extension.

Difficulty must be calibrated later from real evidence. Do not confuse reading
complexity with conceptual difficulty.

## Misconceptions

Tag a known reasoning error only when the item's distractors or response pattern
can reasonably reveal it.

```json
"misconceptionTags": [
  "physical-vs-chemical-change"
]
```

Do not infer a disability, diagnosis, motivation, morality, or sensitive trait
from an incorrect response.

## Feedback

Feedback should explain the reasoning target without exposing protected formal
assessment keys before submission policy allows it.

```json
"feedback": {
  "correct": "The evidence supports formation of a new substance.",
  "incorrect": "Distinguish a change of state from evidence of a new substance."
}
```

## Formal-assessment eligibility

Mark an item eligible for formal testing only after reviewing:

- unambiguous wording;
- one defensible scoring rule;
- standards match;
- accessibility;
- cultural and contextual fairness;
- answer-key integrity;
- comparable difficulty;
- exposure history.

## Human-review tasks

Assign a rubric ID:

```json
{
  "type": "extended-response",
  "rubricId": "argument-evidence-reasoning-v2"
}
```

The engine records the submission as awaiting review. A future rubric engine will
attach criterion scores and educator comments.

## Review checklist

Before publishing an item:

1. Is the intended skill clear?
2. Does the prompt measure that skill?
3. Is unnecessary reading demand removed?
4. Are options plausible and parallel?
5. Is the answer rule correct?
6. Are standards and domains accurate?
7. Is difficulty reasonable?
8. Is feedback instructional?
9. Is the item accessible?
10. Is the item safe for its intended mode?
