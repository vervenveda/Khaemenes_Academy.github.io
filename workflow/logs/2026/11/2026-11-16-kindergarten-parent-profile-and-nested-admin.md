# 2026-11-16 · Kindergarten Family Plan in Parent Profile and Nested Portal Administration

## User-directed topology
- **Kindergarten Family Daily Plan** belongs only on the standalone Parent Profile, automatically visible immediately below its profile hero **if the active family has a registered Kindergarten learner**.
- No Kindergarten plan panel appears on the Parent Portal, or on a Parent Profile without such a learner.
- **Manage Family & Records / Family Administration** should be nested under the **Preparing for secure account connection** disclosure on the Parent Portal.
- Both disclosure summary controls use matching charcoal backgrounds and light cream text. Gold remains a subtle accent/focus ring.

## Committed source work
| Commit | Change |
| --- | --- |
| `b9205665ddeb636d75b179f48c123e34a96ef31d` | Kindergarten daily planner now checks `/family/profile/` and actual eligible kindergarten-family association before mounting, preserves original authorized `education.manage` save requirements, and offers local learner selection without granting additional permissions |
| `67f3886dad2f5900e95e0bbff6ba9efbac2f4da4` | Move existing Family Administration markup into Account Connection's expandable checklist and remove Kindergarten planner script loaders from Parent Portal |
| `92361cd6fb7f68df71ec1852bf5cbc8f6403a69d` | Load existing planner and plan engine only on Parent Profile after photo hero; improve cream/charcoal contrast |
| `e9c5ac5a5d1cc9aca9a216d5f2432a57b3971bbc` | Add matched charcoal nested-disclosure rules in canonical parent CSS |
| `8cfb3cb1dc89add257a6484f58e99636ed0f96d5` | Ensure ineligible or already-active learner selection control is visually hidden |
| `108ac6a2f138087ca1ca90e735ef46b1505038cb` | Refresh Portal stylesheet reference |
| `86d4a930eb3f20d09e2f796b4621bc003e3bb5d1` | Refresh Profile stylesheet and planner script references |

## Non-destructive requirements
- Did not write or migrate existing family identity, student records, report, grade, placement, or attendance records; script only supports authorized selection and optional adult-initiated daily plan saving.
- Planner is a browser-local family-helper, *not* formal lesson mastery, official attendance or verified parent authentication.
- When a family has several Kindergarten learners, parent selects the correct learner locally; saving still requires its pre-existing education.manage permission.
- The Academy's actual account cloud and STOS terminal remain uncommissioned for this workflow.

## Validation register
- GitHub source re-fetch and JS syntax checks: pending follow-up in this pass.
- No browser-level dynamic DOM, actual learner profile, mobile rotation, first-click, verified parent access or persistence regression has been executed.
- Production acceptance: HOLD.
