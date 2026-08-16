# NAIB Delegation Contract

Branch: `hardening/archaemenes-preschool-router`

## Role

NAIB is the public-facing **front desk administrator and AI Resources Director** for the Verve N Veda / Khaemenes ecosystem.

NAIB receives a bounded visitor context, interprets the visitor's intent, and delegates the visitor to the most appropriate destination.

NAIB does **not** become every specialist and does **not** own the destination platform's records, teaching, content, or service authority.

## Delegation model

```text
Visitor / Family / Adult
        ↓
NAIB intake + delegation
        ↓
Appropriate destination
        ↓
Platform / resource / specialist AI
```

Examples:

- family account administration → Khaemenes Family Account Hub;
- Khaemenes school learner → learner's Khaemenes campus → Archaemenes;
- music → The Refrain → MoirAI;
- literature / language arts → literary-learning environment → Eiren;
- games / puzzles / practice → Arcade;
- knowledge / archives → ARSHIF;
- verification / source comparison → The Verifier;
- general research discovery → PLERA Search;
- civic learning → civic resources;
- legal-information literacy → Firmament Law;
- communications → 333 Network;
- higher education / adult learning → Khaemenes Higher Learning;
- immediate emergency intent → locally resolved emergency services.

## Emergency boundary

The public static router does not guess a universal emergency number.

If a calling surface has already resolved the visitor's correct local emergency number, it may pass that number to NAIB and receive a `tel:` delegation.

If no local number has been resolved, NAIB returns an immediate-priority delegation with `requiresLocalResolution: true`. The caller must resolve the correct local emergency service before presenting a call action.

## Specialist authority

Current public specialist roster represented in the router:

- **Archaemenes** — Khaemenes Academy educational mentor;
- **MoirAI** — The Refrain music mentor;
- **Eiren** — language arts and literary mentor.

This roster is intentionally extensible. Additional specialist modules may be added without changing NAIB's role.

## Public API

The browser global remains:

`window.KhaemenesNAIB`

Canonical delegation methods:

- `delegate(context)`
- `route(context)`
- `requestDelegation(context)`

Compatibility methods retained while school repositories migrate:

- `assignMentor(context)`
- `requestMentor(context)`

The compatibility mentor method is limited to Khaemenes Academy school stages and returns Archaemenes so Preschool, Kinder Garden, and Elementary integrations continue to work during transition.

## Privacy boundary

The router intentionally ignores learner IDs, family IDs, account IDs, names, email addresses, and other identity-bearing fields.

Bounded routing context may include:

- stage;
- age band;
- high-level intent;
- broad topic/query;
- non-identifying interests;
- calling surface.

Delegation tokens are opaque and are not derived from learner identity.

## Authority boundaries

- **NAIB** — intake, administrative guidance, resource discovery, delegation, handoff.
- **Family Registry** — family/adult/learner identity and local relationship state.
- **Specialist platform** — domain content and service authority.
- **Specialist AI** — mentoring/advisory role inside that domain.
- **Course / assessment system** — academic progress, mastery, and certification authority.

No browser-side router or mentor response is treated as authentication, legal authority, emergency-service verification, or academic mastery evidence.
