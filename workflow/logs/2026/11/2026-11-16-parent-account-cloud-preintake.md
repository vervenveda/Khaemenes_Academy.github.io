# Parent Portal ↔ Parent Profile ↔ Account Cloud · intake bridge (2026-11-16)

**Status:** PRE-INTEGRATION / CONTRACT ALIGNED / LIVE SYNC HOLD

## Source surfaces
- Parent Portal: `vervenveda/Khaemenes_Academy.github.io/family/index.html`
- Parent Profile: `vervenveda/Khaemenes_Academy.github.io/family/profile/index.html`
- Existing Academy family registry remains the **browser-local fallback and explicit export source**, not a session or permission authority for a protected backend.
- Account Cloud release `0.2.0` remains `stos-pre-intake`, `productionDataAllowed=false`, `githubRuntimeAuthority=false`.

## Canonical continuity mapping
| Browser/local source | Protected Account Cloud target | Authority |
| --- | --- | --- |
| familyId | familyId, preserving valid non-conflicting ID | Account Cloud once commissioned |
| adultId | adultId plus separately authenticated adult account link | Wend/OHMIC + protected handoff |
| learnerId | stable learnerId if unambiguous | Account Cloud |
| provisional KA/KS institutional ID | server-confirmed institutional ID with migration record | Account Cloud |
| Adult ↔ Learner access | individually authorized relationship | Klik / policy |
| academic/course records | evidence references and explicit archive provenance | Course engine remains mastery/grade authority |

## Temporary Mac terminal bridge
A local manual-intake Bash launcher can be run in Mac Terminal by the owner. It only creates a local private intake folder, copies **manually selected existing exports** without overwrite, generates SHA-256 fingerprints and a receipt, and stages the result for **future review**.

This is not automatic backup, cloud synchronization, a STOS terminal binding, account authentication, a record importer, or a live T03 worker. No child records may enter GitHub source control, GitHub Pages, issues, logs, Actions or the public Academy.

## Commissioning requirements
1. Approved native read-only T03 inspection of authoritative slot 03 binding, lock, registered repository and commissioned receipt.
2. Provenance and completeness validation of each Academy export, including per-learner identity and all course evidence.
3. Synthetic-only adapter tests of durable storage, compare-and-swap, recovery, audit and cross-family isolation.
4. Server-authenticated Wend/OHMIC handoff, Klik re-authorization and Avouch validation.
5. Idempotent migration preserving stable learner IDs, zero overwrite on conflicts, explicit adult consent and rollback.
6. Successful Mac/tablet sign-in, logout and independent cross-device data verification.
7. Only after these pass: separately authorize real record intake to protected STOS runtime.

## Fail-closed UX
The Parent Portal and Parent Profile must continue to display **LOCAL PROFILE** / not verified when cloud authority is unavailable. Links to a GitHub repository are never equivalent to an authorized service connection. Never introduce a public browser POST endpoint or broad CORS and never store tokens in localStorage. Do not silently merge student records or mark a family as cloud-connected.

## Current acceptance
- Source contracts inspected: PASS.
- No user records modified or exported by this work.
- Real student intake: NOT STARTED.
- T03 commissioned runtime: NOT VERIFIED; HOLD.
