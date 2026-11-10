# Parent Portal Frontend Fine-Tuning — Second Audit
Date: 2026-11-09
Branch: `hardening/parent-student-schedule-mirror-2026-11-09`
Scope: Academy Family Portal / parent schedule mirror, **review only**.

## Five front-end bubbles addressed

1. **First-render dependency order.** The initial Family Portal render ran before `high-school-course-pins.js` and `high-school-eight-class.js` loaded, causing an empty eight-slot schedule on some visits. Moved shared High School catalog scripts above the inline Family Portal controller, preserving single loads.
2. **Legacy Next Step link trust.** Existing continuation snapshot links could contain broader HTTP(S) origins. Apply `KhaemenesParentScheduleMirror.allowedHref` to both the rendered next-step control and the navigation handler, excluding non-Academy and insecure destinations.
3. **Visual consistency.** Standardized parent schedule progress captions, status labels, and action notes to at least 16px with improved contrast and keyboard focus visibility.
4. **Learner/guardian separation.** Re-checked that new parent profile/course links require the family registry's `progress.view` permission, while the schedule module stays read-only with no grade or storage writes.
5. **Regression coverage.** Added five source-focused regression tests for catalog load order, one-time script load, next-step restrictions, and text standards. Total parent schedule suite: 11 tests authored.

## Validation performed
- Family Portal inline JS, schedule module JS, and regression tests passed JavaScript syntax inspection.
- Source-level checks confirmed load order, single script import, authorized navigation predicates, and text minimum.
- Existing synthetic schedule logic previously confirmed eight slots, honest unreported state, maths pathway selection and stale progress.
- **The actual Node suite and browser interaction tests have not been executed.** The GitHub connector exposes source files, but not an executable Node environment. The local container could not access GitHub raw URLs for a complete checkout.

## Holds
- No production merge/deployment, student record change, migration or T03 runtime modification.
- Parent navigation is not yet secure *read-only impersonation*. A browser-local family selection does not grant server-verified parent authorization. Destination profiles and course pages must enforce authenticated parent-view permissions before permitting safe cross-device parent access.
- Grade 9–12 catalog coverage is staged. Pre-K, Kindergarten, Elementary, Middle and Higher Learning schedule parity still requires source audits.
- The frontend continuity intent contract stays prepare-only; encrypted record backup, atomic durable receipts and T03 connection remain separate backend gates.

## Next acceptance tests
1. Parent view in a real browser, with and without continuation snapshots, including multiple linked learners.
2. Verify destination course launch and return navigation, disabled unauthorized controls, and no unintended grade or work submission.
3. Test source catalog unavailable/offline fallback, keyboard and mobile layouts, and STOS authorization once commissioned.
