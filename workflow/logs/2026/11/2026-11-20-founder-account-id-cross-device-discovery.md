# 2026-11-20 — Founder account ID and two-device discovery evidence

**Type:** evidence correction · account continuity · privacy-safe reconciliation hold
**Source:** founder's direct report in the Academy Account Cloud workflow discussion, November 20, 2026.
**Status:** USER-OBSERVED ACCOUNT ID AND CROSS-DEVICE DISCOVERY; CLOUD PERSISTENCE NOT VERIFIED.

## Corrected chronology
1. An Academy family/student account was created on the learner's laptop.
2. The founder later located the existing family and student account records from a separate Mac computer using Chrome Developer Tools and Academy/High School pages.
3. **An Account ID exists and was identified during this investigation.** Preserve this as an explicitly reported historical fact, rather than saying only anonymous profile records were located.
4. The actual Account ID bytes/value were not provided in this workflow update and are deliberately NOT published in GitHub. The account ID must not be reconstructed, guessed, overwritten, rotated, or replaced to fill a documentation gap.
5. The founder's and student's private identity details are excluded from public repository logs.

## Evidence classification
| Fact | Status |
| --- | --- |
| Original account created on child's laptop | FOUNDER-REPORTED |
| Existing account found on Mac via Chrome Developer Tools | FOUNDER-REPORTED |
| Account ID discovered | FOUNDER-REPORTED / VALUE WITHHELD |
| Academy and High School surfaces capable of inspecting local records | SOURCE REVIEWED |
| Exact transport used between devices | UNVERIFIED |
| Same Account ID byte-for-byte compared on both devices | NOT ATTESTED IN THIS LOG |
| Actual parent and student record retrieval from protected Account Cloud | NOT VERIFIED |
| STOS T03 native commissioning | HOLD |

## No-duplicate identity directive
- Treat the discovered Account ID as **an existing account continuity candidate**, not as an invitation to create new family/learner identities.
- Do not advise re-registration, reissue new institutional identifiers, or overwrite existing learner/course records.
- Only an independently authorized, local-to-protected reconciliation may match original and second-device IDs by exact value, provenance, ownership, and timestamp, using privacy-safe evidence. Do NOT commit identifiers, passcodes, browser storage dumps, sensitive school records or tokens to public GitHub.
- A device-to-device discovery event is material evidence of continuity, but by itself cannot establish how the records arrived on the second device or verify protected Account Cloud storage.
- Keep Academy-only account boundary; no 333 Network cloud identity federation or other terminal integration.

## Preservation and verification follow-up
- Preserve original browser profiles and any verified local backups on both devices. No browser storage modification or imports were performed during this documentation.
- Next authorized verification should inspect, **without publishing IDs**, whether exact account/family/learner identifiers and record provenance match across both devices, and separately whether a commissioned authenticated Account Cloud read-back returns them.
- Source-only work cannot inspect the founder's currently saved Chrome profile or issue an Account Cloud read-back.

**Modification scope:** this document only. No Academy UI, family registry, learner records, credentials, VNV gateway, High School or STOS runtime modified.
