# Privacy and Data Rules

## Foundation posture: local first

Version 0.1 stores attempts in the learner's browser using `localStorage`.
Nothing in this starter sends assessment responses to a server.

Local storage is useful for prototypes and independent study, but it is not a
complete school record system. Browser data may be cleared, shared devices may
expose records, and local storage does not provide authenticated access control.

## Learner rights

A learner should be able to:

- inspect stored evidence;
- export it in a readable format;
- correct identity or profile information;
- request educator review of an inference;
- reset temporary preferences;
- distinguish graded evidence from exploratory signals;
- understand why an item or recommendation was selected.

## Prohibited inferences

Do not infer or store sensitive traits unless a lawful, necessary, explicitly
authorized educational process requires them. The assessment engine must not
guess:

- medical or psychological diagnoses;
- disability status;
- race, ethnicity, religion, or political affiliation;
- immigration status;
- sexual orientation or gender identity;
- family income;
- criminal risk;
- moral worth;
- future success or failure.

Career interests and activity preferences are temporary signals, not identity
labels.

## Server-backed phase

Before adding accounts or cloud synchronization, implement:

- authentication and authorization;
- role-based access;
- encryption in transit and at rest;
- minimum necessary data collection;
- consent and notice;
- retention and deletion schedules;
- audit logs;
- breach-response procedures;
- guardian and student access procedures;
- jurisdiction-specific student privacy review;
- vendor and subprocesser controls.

## Shared-device warning

A future production page should display a clear shared-device control:

- save locally;
- export;
- sign out;
- remove local copy.

Until authenticated storage exists, do not use the foundation engine for highly
sensitive or legally protected records.

## Data separation

Keep these categories distinct:

1. scored academic evidence;
2. teacher-reviewed evidence;
3. accommodations;
4. temporary preferences;
5. career exploration;
6. system telemetry.

Combining them into one opaque score would be misleading and unsafe.
