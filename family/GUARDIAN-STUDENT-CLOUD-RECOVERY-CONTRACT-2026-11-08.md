# Academy Guardian, Student and Baby Cloud Authentication Contract

**Status:** Design/acceptance only. No working authentication, account recovery, live STOS T03 transport, or four-device enforcement is asserted or enabled by this document.

## Account hierarchy

- One verified guardian identity can control one or more authorized family groups, as legitimate guardianship requires.
- Each family has distinct guardian memberships, learner identities and a logically isolated Baby Cloud namespace.
- Each learner has a stable opaque learner ID and independent course-record scope; never use name or grade as an authentication credential.
- A student PIN cannot authenticate directly to the public internet or obtain family/guardian/cloud privileges.
- Profile names and legal mononyms must be supported; a one-word name alone does not indicate fraud. Only authenticated service-issued enrollment receipts mark an account official.

## Guardian sign-in and passcode management

- Support a user-selected **exactly 10-digit numeric guardian PIN**, but do not rely on it alone for remote authentication. Prefer optional passkeys or a stronger password/passphrase. Server-side guess throttling, per-account and per-network abuse controls, alerting, and sensitive-action reauthentication are mandatory.
- Require two independent authentication steps for guardian sign-in or enrollment activation; prefer phishing-resistant passkeys or authenticator-based challenge where supported. Verified phone/email may be configured as confirmation/recovery channels; email-only and SMS are weaker than phishing-resistant factors.
- Primary verified email and/or verified phone; optional verified backup email. Verify each address/number separately and notify existing channels before a recovery address is changed.
- Changing the guardian PIN requires proof of current PIN, a fresh second factor, revocation/rotation of relevant sessions, and notification. Forgotten-PIN reset requires separately verified recovery, **not** the old PIN.
- Never store PINs, recovery codes, OTPs or secrets in browser localStorage, family JSON exports, GitHub or logs. Server-side credentials must use appropriate salted adaptive password hashing with dedicated PIN guess protections. Do not invent unsupported protections.
- Guardian session cookie must be Secure, HttpOnly, SameSite and appropriately scoped; protect state-changing requests from CSRF. Explicit logout invalidates the session.

## Student access within a registered family device

- Guardian authenticates and authorizes the device/family session before learner selection is offered.
- Each student has a unique learner ID plus an **exactly five-digit numeric PIN**. A five-digit PIN has only 100,000 possibilities: it is permitted only as a **rate-limited local/family-session unlock**, never as a public remote login factor.
- Restrict PIN attempts per student/device/family, introduce backoff and guardian intervention. Never expose whether a guessed student ID belongs to an unrelated family.
- Student switching ends the previous learner-scoped session, removes previous child data from visible UI and memory, and forces reauthentication before protected actions.
- Guardian may reset a child's PIN through fresh guardian authentication and verification; child cannot change guardian permissions, account contact methods, recovery credentials or other learners' PINs.
- Course results, assessments and journals must be written under the authenticated learner scope with independent authorization on every server request.

## Four registered devices

- A family may have **at most four active registered devices** at one time. Count is enforced in the authorized service, not JavaScript or localStorage.
- Initial enrollment and each added device require a guardian-approved device enrollment challenge.
- Display device nickname, last-use date, device type and revoke action; avoid invasive hardware fingerprinting.
- Fifth-device request remains pending until guardian revokes an active device or uses a separately authorized lost-device recovery workflow.
- Device revocation must invalidate that device's session keys and prevent further synchronized access; retaining local offline content is a separate policy requiring careful handling.
- Four-device limit does not mean four student profiles: any number of children supported by authorized family policy may have their own learner records, with protections against automated fictitious registrations.

## Recovery after computer loss

1. Guardian returns to official Academy website on replacement hardware and selects **Recover My Family Cloud**.
2. Verify primary credentials and a second independent factor, or use a separately provisioned recovery workflow if those factors are lost.
3. Provide a high-entropy, one-time or rotated recovery code issued by the authorized service; it is never the 10-digit guardian PIN or a child's 5-digit PIN. Show once, encourage safe offline storage, and support invalidation/reissue.
4. After authenticated device registration, server verifies family membership and restore scope; revoke a lost device if four slots are occupied.
5. Download or synchronize a new encrypted/authorized local copy of **family, learner, course progress, grades, assessments, elective choices, portfolio and required metadata** only to the extent those data have independently passed persistence and backup completeness tests.
6. Compare record versions, reject cross-learner merges, and reconcile offline conflicts without silently replacing authoritative work. Confirm durable readback, including restart recovery.
7. Produce audit receipt showing restored dataset scope and verification status; do not claim complete recovery from a family-profile-only export.

## Privacy and accessibility

- Minimize personal data and child profiling; separate public profile display from private identity and education records.
- Support legitimate single legal names, caregivers with alternative authorization arrangements and families without stable phone access. Do not require SMS exclusively.
- Obtain appropriate verifiable parental consent for children where legally required. Design consent withdrawal and data deletion using protected workflows; retain necessary audit evidence according to defined policy.
- Do not ask for a child's password/PIN through an emailed link or public form. Do not put guardian/learner credentials into T03 readiness envelopes.
- Provide an offline-limited mode that is truthfully labeled **Not Yet Synced**; never represent local save as cloud-backed until authenticated server receipt and readback.

## Tests before release

- Guardian 10-digit PIN accepted only under verified second-factor flow; rejected digits/truncation/Unicode ambiguity tested.
- Current-PIN changes require the current PIN and fresh independent challenge; recovery cannot bypass identity proof.
- Student 5-digit PIN can unlock only their learner-scoped UI within authorized guardian/device context; unauthorized students, sibling records, and unregistered devices are blocked.
- Wrong-PIN automation is throttled; errors do not disclose family/student identity.
- Four devices succeed; a fifth is denied or held pending until registered device revoked; revoked device cannot sync.
- Recovery code cannot be replayed, guessed, logged or used as a normal login PIN; changes notify verified guardian channels.
- Clean computer restore and subsequent readback recover the *same versioned learner records* and audit scope, without accidental family merges.
- Server down, power loss, failed database commit or missed synchronization must not report a successful cloud save.
- Validate encryption at rest/in transit, protected backups, audit logs, guardian consent, access revocation and end-to-end browser sessions before launch.

**Do not activate this by changing client flags.** Account authority and data persistence must be independently commissioned and tested in native private STOS T03; public GitHub hosts only non-secret UI contracts and clients.
