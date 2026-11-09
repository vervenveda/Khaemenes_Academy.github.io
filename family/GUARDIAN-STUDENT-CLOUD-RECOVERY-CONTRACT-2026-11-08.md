# Academy Guardian and Student Authentication — Mother Cloud / Optional Baby Cloud Contract

**Status:** Design and acceptance criteria only. Neither Mother Cloud persistence nor paid Baby Cloud storage, account recovery, billing, or STOS T03 production integration is verified live by this document. **Free education and verified student account persistence must not depend on buying a Baby Cloud.**

## Product tiers and storage authority

| Capability | Free Academy family | Optional Baby Cloud family |
| --- | --- | --- |
| Family and student account identity, guardian permissions and verified student login | **Mother Cloud** — included | **Mother Cloud** — included |
| Academic enrollment, placement, class selections, progress, grades and authoritative course records | **Mother Cloud** — included | **Mother Cloud** — included |
| Secure login and recovery of core student account after device failure | **Mother Cloud** — included | **Mother Cloud** — included |
| Free lessons and Verve N Veda vanilla HTML resources | Included | Included |
| Yearbook | Local-device storage only; loss of device may lose unsynced local items | Cloud-backed yearbook photo allowance: **1,000 photos per student and 1,000 photos per parent** |
| Additional personal documents, photographs and files | No additional personal cloud storage | Included in optional Baby Cloud allocation |
| Personal cloud capacity | None beyond necessary core-account/academic records | **1 TB (terabyte) per purchased family Baby Cloud**; exact quota-counting rules to be documented |
| Price | **Free** | **$55.55, one-time lifetime purchase**, with lifetime updates, subject to an explicitly published sustainable service agreement |
| Registered Baby Cloud devices | Not applicable | Up to **4 registered devices** (enforced server-side) |

**Important separation:** Core student academic records always belong to the Mother Cloud, whether or not the optional Baby Cloud was purchased. The optional Baby Cloud is a personal storage entitlement, not a prerequisite for enrollment, grading, attendance, coursework, or restoration of the core account. The free tier must not be falsely labeled 'local-only account' once Mother's authenticated persistence is operational; however, **free yearbook content is local-only** unless a separately authorized cloud storage entitlement exists.

## Accounts and authentication for all families

- Each guardian has an individually verified account linked to authorized family/learner memberships. Keep support for legal mononyms, alternate guardianship arrangements and minimum required personal data.
- Guardian may select an **exactly ten-digit numeric PIN** plus a **second independent factor**. Offer stronger passkeys or passwords when supported; a 10-digit PIN alone is not an adequate remote sign-in credential. Use server-side throttling, protected salted adaptive credential hashes, suspicious-attempt controls and session rotation.
- Guardian contact channels: verified phone and/or email, plus optional separately verified backup email. Stronger authenticator/passkey factors are preferred to email/SMS where available.
- To change the guardian PIN, check the current PIN **and** require fresh second-factor verification; forgotten-PIN recovery uses separately verified recovery and alerts established channels.
- Learners have distinct opaque student IDs and **five-digit numeric PINs** for switching within an authenticated family/device session only, with throttling and isolation. Student PINs never unlock Mother Cloud globally, Baby Cloud personal documents, another child's records, or parent controls.
- Parents can reset child PINs after reauthentication; child cannot change guardian security, subscription status, recovery channels or device permissions.
- Session cookies must be Secure, HttpOnly and SameSite with CSRF controls. Do not expose credentials, recovery tokens or secrets to JavaScript persistence, exports, logs or public repositories.

## Mother Cloud — standard for every family

1. Guardian verification and consent as applicable, duplicate-safe server enrollment and relationship permissions.
2. Family, adult, student, enrollment, grade placement, assessment provenance, course selection, grades and learning records are persisted in a protected authoritative system.
3. An independently verified write/readback receipt is required before telling a user their academic work is safely synced.
4. On device loss, a family can authenticate at the Academy site and recover core account and available synchronized academic records **without purchasing a Baby Cloud**.
5. Use bounded, learner-scoped server authorization; no student data leaks between families, siblings, test accounts or logged-out devices.
6. Course-owned grade/assessment authority remains separate from family profile metadata; optional personal storage must not become the authority for grades.

## Optional Baby Cloud — personal family storage

- Family expressly opts in to a **one-time $55.55 lifetime purchase**, advertised as **1 TB with lifetime updates**. Payment, entitlement, quota and long-term service terms need separately reviewed implementation before public activation; don't claim billing is live.
- Each student and parent has **1,000 cloud-backed yearbook photo slots**, protected by their own identity and guardian permissions. Define whether replacements, deleted items, high-resolution assets and derived thumbnails count toward photo-slot and storage quotas before launch.
- Store additional personal information, documents, and photos only with explicit entitlement and consent, separate from mandatory academic records. Personal information categories and sensitive child uploads need minimization, encryption, retention and deletion policy.
- The **1 TB is interpreted in this draft as one aggregate family Baby Cloud allocation**, not one TB per individual family member. Confirm product wording before launch.
- Store entitlement and capacity limits on the protected server. Do not place purchase proofs, payment details, sensitive documents or storage authorization keys in public GitHub or browser localStorage.
- Support **up to four registered Baby Cloud devices**. A fifth device needs an authorized replacement/revocation, not a silent bypass. Whether a separate free-tier signed-in-device policy is needed is undecided; do not cut off free educational access by applying a paid storage limit to Mother Cloud.
- Provide a protected recovery workflow for paid personal cloud data after device loss: guardian sign-in, second factor or distinct high-entropy recovery code, registered device validation, ability to revoke lost device, verified restore/readback and non-secret receipt. Recovery code must not be guardian 10-digit PIN or student 5-digit PIN.
- Recovery of the core **Mother Cloud** account must be available to free and paid families; the optional Baby Cloud recovery code concerns **paid personal data access**, not permission to use the Academy.

## Offline behavior and storage messaging

- Free yearbook photos remain on the original device. Clearly tell users they are not cloud-synced or guaranteed recoverable and provide safe manual local export where available.
- Core student work may be locally cached for offline lessons, but do not report it 'synced' until the Mother Cloud acknowledges and readback verifies it. Display **Saved on this device / Not yet synced** when offline or when authority is unavailable.
- Paid Baby Cloud uploads similarly require authenticated durable receipt; show pending uploads and failed uploads accurately.
- Never silently put free personal uploads into Mother's academic datastore. Never move core academic records behind a paid access gate.

## Enrollment UI acceptance tests

- Free enrollment always available with working guardian/student security; no payment step required to finish core enrollment.
- Buyer sees price, 1 TB shared allocation, 1,000 yearbook photos **per parent and per student**, four registered Baby Cloud devices and lifetime update terms before purchase.
- Free-family yearbook states **Stored on this device only**; no misleading cloud icon, and offline export behavior verified.
- Both free and paid student account restoration return same protected family/learner identity and authoritative academic records after device loss.
- Paid personal photos/documents remain inaccessible to free tier and unauthorized siblings; disabling/revoking a device ends protected access.
- Failed purchase, cancellation, quota exceeded, server outage or session loss cannot change an academic enrollment into unpaid/unregistered status.
- Simulated network failure, storage write failure or test account cannot falsely produce an official 'enrolled' or 'synced' indicator.
- Verify billing entitlement, usage meters, durable backups, four-device lifecycle, recovery code rotation, consent, customer support and incident handling before paid launch.

**Do not enable account features by flipping browser flags.** Protected STOS Mother Cloud authority must be commissioned and verified first; optional Baby Cloud storage is separately provisioned and separately authorized.
