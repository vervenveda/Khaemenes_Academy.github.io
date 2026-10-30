# Legacy Beta Index Coverage — Retired

The standalone `/assets/vnv-beta-link.js` rollout is retired.

Khaemenes Academy now uses the single-source Verve N Veda ecosystem toolbar:

`https://vervenveda.com/assets/vnv-ecosystem-toolbar.js`

Current policy:

- every public Academy HTML page loads exactly one official ecosystem toolbar;
- legacy floating Beta launchers and landing-toolbar loaders must not coexist with it;
- Beta remains available inside the official toolbar and through intentional in-page Beta links;
- coverage is validated read-only by `scripts/audit-ecosystem-toolbar.mjs`;
- GitHub Actions no longer rewrites HTML to inject standalone Beta controls.

The historical rollout remains available in Git history if needed for forensic review.
