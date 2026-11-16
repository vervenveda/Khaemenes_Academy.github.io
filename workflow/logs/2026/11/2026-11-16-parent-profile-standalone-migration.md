# 2026-11-16 · Parent Profile Standalone Landing Migration

- Repository: `vervenveda/Khaemenes_Academy.github.io`
- Date: 2026-11-16 · America/New_York
- Type: architecture · UX repair · non-destructive relocation
- State: source changes committed; production browser acceptance HOLD

## User decision
Parent Portal is the navigation hub, not the parent identity page. The parent photo hero and profile appearance tools belong at the top of their own `family/profile/` landing page. The portal must link to the dedicated Parent Profile.

## Changes committed
| Change | File | Commit |
| --- | --- | --- |
| Standalone page, centered identity entry and cross-links to existing family modules | `family/profile/index.html` | `2813101efb63f1afd7dadae7662e577eb8de4a1d` |
| Route profile tools from standalone location to existing Portal sections; retain original parent appearance keys | `assets/khaemenes-family-parent-profile-hero.js` | `ed94a63d8ad30969e1142cff9d41fcdae09e7f51` |
| Add prominent My Parent Profile action and navigation card; retire embedded hero and its adapter from Portal (not from repository) | `family/index.html` | `6a531010d57396e9f6bba7b959a5c38812b30321` |

## Safeguards
- No family registry, parent/learner IDs, appearance data, photos, course grades, assessment history, or permissions read or rewritten by the migration.
- Existing appearance keys remain `khaemenes.parent.profile.appearance.v1:<adult-id>` and `khaemenes.parent.profile.photo.v1:<adult-id>`.
- No new account/cloud sign-in, outbound email, STOS connection or storage authority created.
- Parent Portal remains responsible for schedules, class progress, record backups, enrollment, and family administration.
- Existing Parent Hero and shared appearance editor JavaScript remain in place; the Portal no longer loads the hero.

## Verification
| Check | Result |
| --- | --- |
| Re-fetch all three affected files after commits | PASS |
| Inline script parsing on Family Portal and standalone Parent Profile | PASS |
| Parent Hero JS syntax parsing | PASS |
| Actual browser navigation, first-click performance and dialog operation | NOT RUN |
| Profile photo persistence, tablet orientation, header/toolbar and overlay collision | NOT RUN |
| Production acceptance | HOLD |

## Next
Use synthetic test accounts to confirm the Portal → Profile → Portal path, all 8 tool controls, editor save/photo persistence, one-click navigation, and responsive layout. Keep edits centered and symmetric, with 16px+ type and charcoal/parchment palette. Log any follow-up correction and do not claim browser acceptance until verified.
