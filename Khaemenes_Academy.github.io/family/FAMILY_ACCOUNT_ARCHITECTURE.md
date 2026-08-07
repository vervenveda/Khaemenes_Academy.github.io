# Khaemenes Family Account Architecture

```text
FAMILY PROFILE
│
├── Adult Account A · Mom
├── Adult Account B · Dad
├── Adult Account C · Dad
├── Adult Account D · Grandma / Guardian / Caregiver / Educator
│
└── Learner Accounts
    ├── Child 1 · stable learnerId + separate accountId
    ├── Child 2 · stable learnerId + separate accountId
    └── Child N · stable learnerId + separate accountId
```

Adults and learners are many-to-many through explicit access records.

A family can contain multiple adults.

An adult can have access to:
- every learner; or
- selected learners only.

Each learner has a distinct academic identity. Sibling records never share grades or progress simply because they belong to one family.

## One registration across Pre-K–12

All Khaemenes school repositories load the same registry through:

`https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js`

Recommended school sequence:

```text
Crechè / Preschool
→ Kinder Garden
→ Elementary
→ Middle School
→ High School
```

The learner keeps the same `learnerId` and `accountId`.

Only the learner's `stage` changes.

Academic records remain school/course specific and reference the stable learner ID.

## Shared-origin requirement for current local mode

The browser-local registry is shared across repository paths only when pages are opened under the same origin:

`https://vervenveda.com/...`

Direct repository GitHub Pages URLs such as separate `*.github.io` origins do not share localStorage.

## Future account mode

The registry already separates:
- family identity;
- adult identity;
- learner identity;
- access relationships.

That makes it ready for future server synchronization without changing the conceptual data model.
