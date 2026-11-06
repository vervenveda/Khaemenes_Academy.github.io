# Security Policy

**Khaemenes Academy — Public Educational Repository**

Khaemenes Academy welcomes good-faith reports of security concerns affecting its publicly accessible educational pages and tools.

## Supported scope

Security maintenance is directed at the active `main` branch and the published Academy experience. Historical revisions, unofficial mirrors, and downstream forks are not guaranteed support.

## Report vulnerabilities privately

Do not publish vulnerabilities, exploit instructions, student records, account data, or credentials in a public issue or pull request.

If private vulnerability reporting is available, use the GitHub repository's **Security → Report a vulnerability** feature. Otherwise contact maintainers privately and request a secure channel before sharing technical details.

Include the affected public page, expected versus observed behavior, reproduction steps using authorized test data, relevant software versions, and redacted evidence. No bounty or fixed response-time commitment is made.

## Guidance for maintainers

The following instructions describe safe maintenance practices only. Keep sensitive deployment details, private infrastructure architecture, credentials, recovery material, access-control configurations, and incident evidence in restricted documentation.

### Triage and containment

1. Confirm receipt through the private reporting channel.
2. Assess whether the report affects privacy, access control, content integrity, navigation safety, or availability.
3. Reproduce the issue only with non-sensitive data in a controlled environment.
4. Prioritize protection of learners and other affected people.
5. Coordinate any containment, credential revocation, notification, or disclosure privately with authorized personnel.
6. Verify corrective changes and document the outcome without exposing sensitive material publicly.

### Secure implementation standards

- Treat public source code and browser-delivered assets as fully inspectable.
- Do not rely on obscured links, client-side flags, or browser storage for authorization.
- Separate public educational resources from confidential personal information and privileged operations.
- Validate all sensitive access and data changes through an independently trusted authority where server-connected services are used.
- Do not commit credentials, personal student data, private backups, or sensitive internal operating procedures.
- Handle persistence failure explicitly; protect existing records during upgrades.
- Keep shared UI and routing components idempotent, accessible, and regression-tested.
- Review external dependencies and confirm public destination links remain appropriate.
- Do not assert cloud synchronization or server verification without actual confirmation.
- Preserve non-public or dormant service boundaries.

### Before merging or publishing

Review the change scope, test affected pages and dependent portals, verify guest and registered-user paths, inspect for accidental exposure of confidential material, and ensure a clear rollback path. Conduct confidential incident response outside public tickets when necessary.

## Responsible testing

Security evaluation must use authorized accounts and non-sensitive data. No permission is granted for data extraction, service disruption, denial-of-service activity, social engineering, or unauthorized access. If private information is exposed, stop testing and report it privately.

## Security limitations

A public source repository and static website cannot themselves guarantee confidentiality of downloaded code or authenticate users. Publicly available files may remain accessible in git history, forks, caches, or previous deployments after deletion.

**Last updated:** November 6, 2026.
