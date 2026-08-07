# Upload Map — Khaemenes Family Registry v1.0

## 1. Khaemenes_Academy.github.io

Upload:

```text
assets/
  khaemenes-family-registry.js
  khaemenes-family-invite-client.js
  khaemenes-family-school-bridge.js

family/
  index.html
  accept/
    index.html
  assets/
    family-runtime-config.example.js
  FAMILY_ACCOUNT_ARCHITECTURE.md
  SERVER_FAMILY_INVITE_CONTRACT.md
```

This repository becomes the central Pre-K–12 family identity authority.

## 2. Kinder Garden

Optional compatibility file supplied:

```text
assets/khaemenes-kinder-family-adapter.js
```

The Kinder Garden root page should load, in order:

```html
<script src="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js"></script>
<script src="assets/khaemenes-kinder-family-adapter.js"></script>
```

Its existing mentor/profile bridge may remain during migration.

## 3. Preschool, Elementary, Middle, High

Use the exact tags in:

`shared-integration/INTEGRATION_GUIDE.md`

Each repository needs only the central registry + school bridge script includes.

## Important

The current family registry works browser-locally across Khaemenes repositories when accessed through the shared `https://vervenveda.com` origin.

Secure cross-device synchronization and email invitation redemption require the future Family Account server.

The email-invite UI is intentionally honest in static mode: it does not claim to send an invite or grant remote access.
