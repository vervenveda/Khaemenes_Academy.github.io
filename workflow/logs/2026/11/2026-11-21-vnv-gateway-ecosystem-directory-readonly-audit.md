# 2026-11-21 — VNV gateway ecosystem directory source-only forensic audit

**Mode:** READ ONLY on `vervenveda/vervenveda.github.io`. **Gateway index SHA:** `543b8aeaa47b2b18ebec33e6a4029075cedc4596`. **Canonical directory SHA:** `2bb151b301060320d246c9cb46e29ad46c6dc5b6`. Neither file was edited, and no browser account data was accessed.

## Architecture actually traced
1. Main `index.html` contains native 333 Network ticker `#networkTicker` (not a `vnv-333-ticker.js` import on the gateway); `#vnvGatewayAutoTickerSlot` reserves 33px, and `/assets/vnv-ticker-autopopulate.js` is explicitly opted in with `document.documentElement.dataset.vnvTickerGateway="enabled"`. `window.VNVGatewayBootstrap.mountTicker()` is idempotent and diagnostics are exposed through `verify()`.
2. Gateway header is native `body > .site-header`, one visible top-right `#menuButton` controlling `#menuOverlay` and its existing drawer/search. The shared `vnv-header-autopopulate.js` is a **migration engine for other pages**, not imported into this gateway. Do not replace the native gateway header.
3. Translator rail `#vnv-language-rail` reserves its own strip; `assets/vnv-language.js` is local fallback and `Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1` is an opt-in canonical Linguistics resource handoff. Source says failures retain fallback.
4. The gateway loads `/assets/vnv-class-tools-toolbar.js?v=1.6.1` for its **lower-left** configured class tools, and `https://vervenveda.com/assets/vnv-ecosystem-toolbar.js` for the **separate lower-right** ecosystem utility dock `#vnvEcosystemUtilityDock`. They are not duplicate implementations of the same toolbar role.
5. Live directory fetch `/ecosystem/master-ecosystem-directory.json` (`cache:"no-store"`), accepts public `directoryVisible===true`, `access==="free-public"`, `status==="active"`, valid URL/category/type, then rebuilds both `SITES` and `ECOSYSTEM_DIRECTORY`. On fetch failure the embedded fallback arrays remain in effect. Category education hub points to `https://vervenveda.com/KhaemenesAcademy_Home.github.io/`.
6. Optional `?chrome_audit=1` adds trace/probe. Not active for ordinary visits. Native admin gate explicitly labels its 10-digit browser-local code a convenience shortcut **not secure authentication**.

## Count and uniqueness checks
- Canonical master: **196** entries; **183** satisfy active/public/visible preliminary filter; 184 have status active but one fails some public/visibility eligibility.
- Canonical IDs: **zero duplicates**; canonical full URLs: **zero duplicates**; title collision: `Career Assessment` appears twice (distinct entries).
- Embedded fallback `SITES`: **32** entries and one duplicate **title** `Jennifer Pearl 2028 · Campaign Home` for two distinct URLs; embedded fallback `ECOSYSTEM_DIRECTORY`: **13 categories, 130 group items**.
- HTML literal `id` attributes: no duplicates found by static scan; external `<script src>` strings: seven, no same-file duplicate (Linguistics loader, interlingual phrases/core, language fallback, autopopulate, class-tools, ecosystem toolbar).
- The gateway's native 333 ticker is embedded and must not be counted as a missing imported 333 script.
- The new `vervenveda/Khaemenes_HL_Associates-Level.github.io` **does not appear** in canonical 196, fallback 32, or fallback 130. It is already linked by Academy Adult Portal. This is a concrete discoverability gap.

## Five priority bubbles, non-destructive
1. **New Associates-Level link missing (P1):** Add a distinct free-public Education entry to the canonical master after separate approval/testing; preserve existing Higher Learning and no duplicate adult identity. Embedded fallback should not be assumed automatically current.
2. **Cross-origin family/learner continuity risk (P1):** canonical master routes Pre-K, Kinder Garden, Elementary, Middle, and Higher Learning to `https://vervenveda.github.io/...` while Academy Home and many High School routes use `https://vervenveda.com/...`. Browser `localStorage` is origin-specific; links on alternate origins cannot by themselves access existing `vervenveda.com` selected accounts. Verify actual deployed redirects and dedicated stage domain behavior before changing URLs. Never silently migrate saved student records or claim same-origin identity.
3. **Emergency fallback parity (P2):** embedded 32-site and 130-item fallback lists are intentionally separate from the 196-entry canonical directory. The fallback contains a duplicate campaign title and excludes the new Associates campus. Add a *report-only* source parity test/manifest; do not rewrite the 273KB gateway to patch one link.
4. **Two-tier chrome ownership and first-paint stability (P2):** the native ticker + auto ticker + native header, interpreter rail, lower-left class tools and lower-right ecosystem dock are each deliberately separate. The bootstrap exposes DOM duplicate-count and geometry diagnostics. Preserve frozen gateway; validate actual desktop/tablet/mobile first paint and menu keyboard handling with opt-in probe before altering CSS or scripts. Static scan cannot prove runtime behavior.
5. **Translator/hamburger/directory fallback robustness (P3):** full translator loader and local language fallback, native hamburger and two-layer directory operate independently; test loaded/unavailable canonical JSON, mobile focus/scroll, third-party translator failure and browser-local admin gate with real page QA. Audit also flags that a local admin gate is not authentication. No production credential or account interface should inherit that local-only shortcut.

## No-change boundary
- Do **not** purge or replace the gateway's native ticker, header, translator, menu, or two separate toolbars.
- Do **not** add `high-school-global-chrome-v2.js` or a new wrapper/chrome owner.
- Do **not** combine Academy student IDs and 333 membership identities.
- Do **not** change `vervenveda.github.io` paths without verifying actual host redirects and preserving user/device records.
- No source modifications, account/record writes or T03 cloud commissioning in this audit.

**Suggested next safe move:** create a small independent validator for canonical directory stage coverage, Associates discoverability and source-owned URL origin parity; run it as a separate workflow with no gateway markup changes. Any eventual canonical directory entry addition should be a separate minimal, reviewed commit and not a broad `index.html` rewrite.
