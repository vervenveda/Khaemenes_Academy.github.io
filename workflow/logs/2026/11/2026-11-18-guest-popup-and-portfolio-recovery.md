# 2026-11-18 · Guest Popup, Portfolio Recovery and High School Profile Integration

- **Types:** repair · source audit · regression
- **Status:** code changes committed; browser runtime unverified

## Findings
- The High School Grade 09 dashboard previously lacked `data-grade` and could be classified as a generic Academy `/student/` route by `assets/khaemenes-guest-tour-invitation.js`.
- A registered learner was considered only if the raw browser Academy registry and selected learner pointer agreed. The updated check optionally corroborates the canonical Academy registry API while preserving the matching learner ID / grade gate.
- Guest feature clicks used to show the same modal repeatedly. The updated handler blocks personal-only actions for an unselected guest but shows its modal only once per page lifetime, then provides a small non-modal explanatory notice. An additional `Select an Existing Student` destination avoids suggesting repeated enrollment for existing learners.
- The Portfolio UI could synchronize course evidence during render and receive a nested synchronous profile-change event. The UI now rejects nested renders, releases its guard in `finally`, and offers error/guest recovery instead of blank content.
- The Portfolio page's competing global chrome auto-mounter was removed; explicit original VNV scripts remain, reducing duplicate observer/mount risk.

## Regression and provenance
- `tests/guest-tour-routing-regression.test.mjs`.
- `tests/student-profile-ui-render-guard.test.mjs`.
- `.github/workflows/academy-guest-profile-interactions.yml` validates source syntax and these focused contracts.
- No learner records were inspected, modified, uploaded or migrated.
- No STOS / Terminal 03 activation or account-cloud connection is claimed.

## Outstanding
Real Chrome/Safari interaction tests with fictional guest and enrolled learner, dialog focus and Escape, date/session behavior, and full pages delivery still required. General Academy STOS crossover/topology workflows reported unrelated outstanding issues; do not confuse their failures with the focused UI guard verdict.
