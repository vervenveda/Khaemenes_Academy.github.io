# Pre-K, Kindergarten and Elementary Student Profile Sibling Isolation — Handoff
**Date:** 2026-11-09  
**Status:** Code and synthetic source checks staged on independent review branches; no live deployment and no student records modified.

## Frontend branch changes
| School | Repository | Review branch | Target |
|---|---|---|---|
| Pre-K | `vervenveda/Khaemenes_Preschool.github.io` | `hardening/student-profile-sibling-selection-2026-11-09` | `student-profile/index.html` |
| Kindergarten | `vervenveda/Khaemenes_KinderGarden.github.io` | same branch name | `student-profile/index.html` |
| Elementary 1–5 | `vervenveda/Khaemenes_Elementary.github.io` | same branch name | `student-profile/index.html` |

All three grade profile sibling switchers now require:
- A selected child whose grade/stage is valid for that profile.
- The child and active adult to belong to the currently selected family.
- The active adult's existing `progress.view` permission for that exact learner.
- Browser registry active family, adult and learner pointer read-back after selection, with a fail-closed error when inconsistent.
- Clearing the profile-edit adult-confirmation checkbox on a successful sibling switch.

Kindergarten additionally now resets the adult-confirmation checkbox whenever an external learner selection changes. Its visual editor consent function confirms that the displayed learner remains the active family learner.

## Validation
- Checked 4 Pre-K inline scripts, 4 Kindergarten inline scripts, and 3 Elementary inline scripts for JavaScript syntax; all parsed.
- Each school review branch contains `tests/student-profile-sibling-isolation.test.cjs`, with source-level regression cases for family membership, permission, read-back, denial and editing confirmation.
- Source checks of all required identity/permission guard markers passed on each branch.
- Node test execution, real interactive sibling switching, cross-tab races, parent-only course views and cross-device identity tests **have not been completed**.

## Remaining backend and frontend boundaries
- The local family registry is not authenticated authority; local permissions can be forged. The safety checks reduce accidental sibling switches but are not a security boundary.
- Destination student and course pages may contain editing and academic submission controls. A parent viewing a course must have a backend-validated read-only observer session to prevent changes.
- Pre-K, Kindergarten and Elementary sources still contain other data-writing features beyond their sibling switchers; these changes do not claim to freeze all parental writes.
- Shared browser active learner pointers must ultimately be replaced/supplemented by authenticated, explicit account context through STOS T03.
- Do not merge into live repositories or enable automatic migration until Node/browser tests and authenticated permission checks succeed.
