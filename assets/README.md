# Khaemenes Academy shared assets

This directory is the shared runtime layer for the Academy front desk and portal surfaces.

## Authority classes

### Identity and continuity
- `khaemenes-account-client.js` — protected account-service client seam.
- `khaemenes-family-registry.js` — Academy family and learner continuity model.
- `khaemenes-learner-context.js` — active learner context.
- `khaemenes-learning-continuation.js` — course continuation summaries.
- `khaemenes-student-profile-v2.js` — student profile model.

### Navigation and shell
- `khaemenes-global-header.js` — Academy header behavior.
- `khaemenes-global-navigation.js` — Academy navigation map.
- `khaemenes-landing-toolbar.js` — compatibility loader only; canonical ecosystem toolbar behavior belongs to Verve N Veda.
- `khaemenes-landing-toolbar.css` — compatibility suppression/print layer; it must not own page geometry.
- `vnv-language.js` — language interface and optional translation support.

### Mentoring and learning support
Archaemenes/NAIB modules are advisory and support routing, evidence interpretation, and learning guidance. They do not award mastery or silently change placement.

### Terminal03 crossover seam
- `khaemenes-terminal03-readiness.js` is the only Khaemenes Academy terminal-readiness adapter.
- Terminal03 is the primary and exclusive Academy terminal designation.
- The adapter is non-live, uncommissioned, transport-free, and performs no STOS storage writes.
- Terminal04 has no Khaemenes Academy authority.

## Migration rule

GitHub remains the Academy production source until a frozen GitHub tree has been migrated into STOS and file-for-file parity is certified.

Do not:
- replace newer GitHub Academy code with an older STOS body;
- embed STOS binaries or secrets in this repository;
- reinterpret browser-local continuity as commissioned STOS storage;
- fork Verve N Veda shared toolbar behavior into Academy-owned geometry.

See `STOS-CROSSOVER.json`, `shared-integration/academy-repository-topology.json`, and `shared-integration/crossover-dependencies.json`.
