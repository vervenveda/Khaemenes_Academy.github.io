# 2026-11-16 · Khaemenes Academy Secure Mac Terminal v0.1

## Decision
Maintain a Mac-local, continuously openable Archive Custodian terminal while internal STOS upgrades continue. This is NOT STOS terminal T03, an Account Cloud backend, or a commissioned records synchronization service.

## Artifact
`Khaemenes-Academy-Secure-Mac-Terminal-v0.1.zip` (provided as a private conversation attachment, **not committed to GitHub**). Contains `Start-Khaemenes-Secure-Terminal.command`, `ka-archive-custodian.sh`, and usage instructions. The launcher requires explicit activation on the owner's Mac. The scripts use the default macOS Bash command line.

## Safety profile
- No network listeners, HTTP APIs, browser interception, GitHub record uploads, automatic imports, or STOS T03 writes.
- Creates only private directories under `~/Library/Application Support/KhaemenesAcademy/Secure-Archive-Custodian/`.
- Refuses record intake unless macOS FileVault reports On.
- Stages existing user-selected exports without replacing earlier copies, records opaque SHA-256-based IDs, and generates metadata-only receipts.
- Uses explicit human operator action. Source exports and original browser localStorage remain untouched.
- SHA-256 is an integrity check, **not** proof of learner identity, export completeness, grade legitimacy, or encryption.
- This terminal does not automatically access children's Opera/Chrome data.

## Acceptance
- Local Bash syntax check: PASS.
- Package file created and ZIP archive listed: PASS.
- Script executed on actual Mac with FileVault and real records: NOT RUN.
- Launchd service/daemon, live cross-device sync, protected web APIs and T03 import: NOT IMPLEMENTED.
- Real learner record upload/Account Cloud import: HOLD.

## Future handoff
Retain local archive originals until Account Cloud protected persistence and T03 commission receipt exist, along with Wend identity, Klik authorization, Avouch validation, synthetic cross-family isolation, version conflicts/rollback, and independent Mac/tablet validation. Course engines retain grade and mastery authority.
