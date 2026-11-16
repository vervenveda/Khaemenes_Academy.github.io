# 2026-11-16 · Parent Portal & Parent Profile Canonical Template Alignment

**Source standard:** user-supplied `VNV_KA_Canonical_Landing_Page_Template.html` (Khaemenes Academy `data-brand="ka"`).  
**Scope:** visual presentation, shared public chrome and page structure only. Family identities, records, mastery, authentication and STOS are out of scope.

## Canonical design rules retained
- `#202724` charcoal, `#FFF8E9` cream, `#F7F1E5` parchment, `#FFFDF8` paper/card, `#B48B45` gold, `#C7BBA3` border.
- Cinzel headings; Brandon Grotesque/Nunito fallback body; normal 400 weight.
- 66px large hero titles, 44px section headings, 33px card headings at desktop maximum; body 18px, controls and notes at least 16px in updated scoped styles.
- Centered page, responsive grid, 7px radius, focus-visible gold outline, print/reduced-motion accommodations.
- One declared 333 ticker loader, one autopopulate ticker loader, one shared VNV header/menu loader, one translator rail ID and one official ecosystem toolbar script on each page.
- No duplicate custom header introduced. Parent Profile's former standalone `<header>` was converted to a content hero `<section>`, with the official shared header mounted separately.
- Keep all student, family records and active portal workstreams untouched; preserve full portal administrative sections from the existing records/parent involvement sections onward.

## Source changes
| Commit | File | Change |
| --- | --- | --- |
| `9584c3d3e0d52d44145a420ce6fd5bfe96df7e54` | `assets/vnv-ka-parent-canonical-v1.css` | Shared scoped presentation standard based on attached HTML |
| `88ac2ab36b35b0dc2faab8b5bb2214634f41a598` | `family/index.html` | KA brand flag, shared stylesheet, single translation rail anchor |
| `e6c74c4325f9ef1b24145e42b1728cf146cc7880` | `family/profile/index.html` | KA brand flag, shared stylesheet, canonical hero section and header initialization, translator rail and quick-links ticker |

## Verification
- Re-fetched updated files: PASS.
- Both HTML inline JavaScript parse: PASS.
- Exactly one *declared* shared header loader, official toolbar loader and translator rail anchor in each document: PASS.
- Standalone Parent Profile learning-panel mount present: PASS.
- Live browser test for generated header/ticker duplication, translator initialization and six-button toolbar behavior: NOT RUN.
- Computed typography, contrast at runtime, tablet rotation and functional first-click regression: NOT RUN.
- Overall browser acceptance: HOLD.

## Safety
No family/learner data, grades, permissions, account binding, passwords, profile photos, localStorage records, T03 commissioning or repo migration were modified. This is not proof of live Chrome or tablet readiness.
