# Khaemenes Academy: Cross-Stage Profile Picture Editor Audit
Date: 2026-11-09
Mode: Isolated review branches; no live account mutation or deployment

## Reference standard
The High School profile picture editor provides learner-scoped photos, adjustable frames, badges, color choices, 16px-or-larger controls, keyboard focus return, and saved presentation preferences. This audit applies those relevant controls without imposing an older-student aesthetic on young learners.

## Source-owned surfaces
| Campus | Actual editor / source | Current review-branch change |
|---|---|---|
| Pre-K | `Khaemenes_Preschool.github.io/student-profile/index.html` plus central universal editor and Pre-K adapter | Native frame options align to rhombus, semicircle, kite and octagon; legacy hexagon/diamond choices map forward without destroying saved pictures; stale upload invalidation; central editor cache-bust |
| Kindergarten | `Khaemenes_KinderGarden.github.io/student-profile/index.html` | Six optional frames and more badges; JPEG image-size handling, learner-switch protection, backup identity check; fixes malformed literal line-break escapes in existing profile JavaScript |
| Elementary Grades 1–5 | `Khaemenes_Elementary.github.io/student-profile/index.html` plus central universal editor and Elementary adapter | Safer native uploads, retry compression, learner-switch protection, 16px controls, shared editor revision |
| Middle Grades 6–8 | `Khaemenes_Middle.github.io/index.html`, linked Academy Family Registry; no dedicated photo editor found | One local profile-picture entry appended to selected-learner tools; reuses universal Academy editor through one stage-aware adapter |
| High School Grades 9–12 | Existing independent photo/studio modules in `Khaemenes_High.github.io` | Reference only. Not changed in this task |
| Higher Learning | `Khaemenes_Higher_Learning.github.io/index-core.txt` loaded via page-core loader and the independent learner-profile adapter | Scholar picture entry next to study profile summary; reuses universal Academy editor and restricts to active self-directed Higher Learning scholar |

## Canonical shared editor changes
- `assets/khaemenes-universal-profile-look-editor.js`: retain ten authored frame options, 24 badges and color choices, keep touch controls >=44px even on short viewports, prevent old file decode from overwriting a reopened or cleared editor, restore keyboard focus only to connected prior opener.
- `assets/khaemenes-stage-photo-entry.js`: new shared entry only for Middle/Higher Learning. It does not issue student accounts, verify consent, authorize records or write academic data. It stores optional appearance by stage and learner ID in browser-local storage with exact write/readback checks.
- `assets/khaemenes-stage-photo-entry.test.cjs`: synthetic stage, learner switch, wrong-grade denial, invalid image format, and identity-bound write regression.

## Preserved boundaries
1. No credential, legal name, guardian verification or academic mastery data is written by the picture studio.
2. A parent checkbox on younger-grade pages is a family-assistance acknowledgment; it is **not** verified legal authority.
3. Browser-local image data is not private from someone who already controls the same browser or origin. The current local photo backups are not encrypted; never claim that SHA checksums or device-only storage provide encryption.
4. The same-origin Academy Family Registry currently supplies selected learner identity. A client-side learner pointer is not protected Account Cloud authentication.
5. No photo or page customization is automatic cloud synchronization. T03 activation remains separate.
6. Pre-K/Elementary consume central Academy JS from the live URL, so the Academy shared editor update must be reviewed and published before those downstream branches can rely on the new async protections. Middle/Higher have the additional dependency on the newly added Academy stage-photo entry script.

## Verification performed and still required
- The source-level script syntax, deterministic shape names and entry-point references can be validated without live profiles.
- Middle/Higher stage adapter has a standalone synthetic isolation test. It does not test real file decoding or real browser storage quotas.
- Browser regression remains pending: desktop/tablet/mobile sizing; assistive-tech labels; 4MB image handling; uploaded photo deletion during decode; multi-learner switching; Pre-K→Kindergarten handoff; older profile and appearance backup restoration; external dependency load order and offline fallback.
- No branches have been merged or deployed. All source patches require individual review and a controlled cross-campus browser pass.

## Safe deployment order
1. Independently review and test canonical Academy universal editor and stage-photo entry.
2. Deploy shared assets only after approval and verify their versioned URLs.
3. Test and deploy Pre-K, Kindergarten and Elementary separately, retaining existing learner data.
4. Verify Middle School and Higher Learning owner selection and new shared editor entry.
5. Keep High School photo editor unchanged until the dedicated Feature 2 audit.
