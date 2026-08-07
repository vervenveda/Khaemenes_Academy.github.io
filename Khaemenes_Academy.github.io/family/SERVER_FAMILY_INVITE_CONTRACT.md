# Khaemenes Family Account — Secure Email Invitation Contract

This is the future cross-device seam. The current GitHub deployment remains static/local-first.

## Purpose

A parent or guardian may invite another authorized adult by email and grant access to:
- all learner accounts in the family; or
- selected learner accounts only.

The inviter chooses a permission preset.

## Create invitation

`POST /api/v1/khaemenes/family/invitations`

Server-authenticated request using a Secure, HttpOnly, SameSite session cookie.

Example request body:

```json
{
  "familyId": "fam_...",
  "email": "parent@example.com",
  "relationshipLabel": "Dad",
  "role": "parent",
  "learnerIds": ["learner_..."],
  "permissionPreset": "co-guardian",
  "expiresInHours": 48
}
```

The server MUST:
1. verify the authenticated adult belongs to the family;
2. verify that adult has `adult.invite` permission for the selected learners;
3. validate the target email;
4. create a cryptographically random invitation token;
5. store only a secure hash of the token;
6. make the invitation one-time-use;
7. set an expiry;
8. record selected learner IDs and permissions;
9. send the email server-side;
10. never return the plaintext token to the browser;
11. write an auditable invitation event.

The email must not include student grades, diagnoses, private notes, exact birthdays, addresses, or other unnecessary child data.

## Accept invitation

Recipient follows:

`https://vervenveda.com/Khaemenes_Academy.github.io/family/accept/?token=<opaque-token>`

The browser sends:

`POST /api/v1/khaemenes/family/invitations/accept`

```json
{"token":"opaque-token"}
```

The token MUST NOT be written to localStorage or sessionStorage.

After validation, the server:
- requires or creates the recipient's adult account;
- verifies ownership of the invited email;
- links adult membership to the family;
- applies only the selected learner permissions;
- consumes the invitation;
- redirects or returns success;
- issues/uses a Secure HttpOnly account session cookie.

## Revoke invitation

`POST /api/v1/khaemenes/family/invitations/revoke`

Inviter must have authority to revoke.

## Adult access revocation

Family administrators must be able to revoke an adult's access to selected learner accounts without deleting:
- the learner;
- academic records;
- other parents/guardians;
- the adult's independent account.

## Custody / authority boundary

Khaemenes does not determine legal custody, parental rights, educational authority, or court-ordered access. The inviter must attest that they are authorized to grant access.

The platform must support limited access and revocation because family arrangements may differ.

## Passwords and credentials

Never store:
- passwords in GitHub;
- passwords in localStorage;
- invitation tokens in localStorage;
- API keys in front-end code;
- bearer tokens in browser storage;
- SMTP credentials in browser code.

Use secure server-side authentication and cookie sessions when the account service is connected.
