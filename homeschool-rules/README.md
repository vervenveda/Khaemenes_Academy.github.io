# Khaemenes Academy Homeschool Rules Registry

This directory is the versioned source-and-rules layer used by Khaemenes Academy homeschool compliance-support dashboards and reports.

## Boundary

There is no single U.S. national homeschool rulebook. Homeschool regulation is primarily state/local. Khaemenes therefore keeps a national academic record core and applies a jurisdiction-specific ruleset only after authoritative sources have been reviewed.

A dashboard or report must never claim legal compliance merely because Academy records are complete.

## Files

- `ruleset.schema.json` — JSON Schema for one jurisdiction ruleset.
- `jurisdiction-source-registry.json` — nationwide index of 50 states, District of Columbia, and five U.S. territories used by the registry.
- `jurisdictions/_template.json` — safe starting template. All legal statuses begin `unknown` until verified.
- `jurisdictions/<CODE>.json` — one versioned ruleset per jurisdiction after research and review.

## Source order

1. Current statute or administrative code.
2. Current official state/territory education agency guidance.
3. Current official local authority guidance where legally relevant.
4. U.S. Department of Education state-regulation materials as the national discovery/reference layer.
5. Secondary summaries only as research leads, never as the sole source of a legal requirement.

## Verification states

- `source-discovery-required`
- `research-in-progress`
- `human-review-required`
- `verified`
- `stale-review-required`

A jurisdiction must not power a legal-status label in the Family Profile until its ruleset is `verified`.

## Requirement statuses

Legal status values are deliberately conservative:

- `required`
- `conditional`
- `recommended`
- `not-required`
- `unknown`

When evidence is incomplete, conflicting, or stale, use `unknown` or `stale-review-required` rather than guessing.

## Historical integrity

Rulesets are immutable by version once used to generate a family report. A legal change creates a new version. Historical reports retain the ruleset ID/version and review date used when they were generated.

## Privacy

The rules engine receives jurisdiction and education-path context, not student work, grades, passwords, family communications, or 333 Network identity data. Student academic records and Family Account content remain under their own protected authorities.

## Initial implementation sequence

1. Populate current primary sources.
2. Build one jurisdiction ruleset at a time.
3. Human-review each requirement and applicability condition.
4. Validate against `ruleset.schema.json`.
5. Mark the ruleset `verified` only after review.
6. Connect verified rulesets to Family Profile v2 and jurisdiction-aware reports.
7. Monitor source changes and issue a new ruleset version when requirements change.

The registry supports compliance recordkeeping; it does not provide legal advice, legal certification, or government filing authority.
