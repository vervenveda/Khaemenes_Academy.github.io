# Archaemenes · Khaemenes Academy Mentor

This directory is the **single active Mentor program for Khaemenes Academy**.

Public Mentor URL:

`https://vervenveda.com/Khaemenes_Academy.github.io/mentor/`

## Authority

Archaemenes uses the Academy Family Registry as the learner identity authority:

`../assets/khaemenes-family-registry.js`

Family Registry v1.3 canonicalizes every Academy learner to:

```json
{
  "mentorId": "archaemenes"
}
```

The accompanying `mentorIdentity` records the stage expression and may retain non-authoritative legacy presentation or communication-style metadata. Older campus Mentor names are not separate Mentor authorities.

The Mentor reads the active family, adult, and learner from the shared `vervenveda.com` browser origin. Family IDs and learner IDs are not placed in the Mentor URL.

## One-Mentor Rule

School repositories may provide Mentor buttons, age-appropriate previews, and compatibility doorways, but they should not maintain independent Mentor applications.

Expected flow:

```text
School / campus
   ↓
Mentor button
   ↓
No active family session? → Family Profile
   ↓
Active family session
   ↓
Active learner selected in Family Registry
   ↓
Archaemenes
```

Archaemenes remains one continuous identity while adapting his expression to the learner's stage:

- **Wise Owl** — Preschool and Kindergarten
- **Academy Mentor** — Elementary, Middle, and High School
- **Scholar** — Higher Learning

The institutional separation is:

- **Family Registry** — learner identity and placement record
- **NAIB** — navigation, matching, delegation, and advisory routing
- **Archaemenes** — educational Mentor
- **Course engine** — grades, mastery evidence, assessment authority, and progression gates
- **Human adults / faculty** — judgment, support, permissions, and formal decisions within their roles

## Early-Learner Boundary

Preschool and Kindergarten learners receive bounded prompt controls rather than unrestricted private text chat.

Older learners may use the normal Mentor conversation composer.

## Legacy Mentor Migration

Legacy campus records are migrated non-destructively. For example, older Kinder Garden identifiers such as Pip, Miri, Nova, and Sage may survive as communication-style metadata, while the canonical learner record becomes `mentorId: "archaemenes"`.

A former custom visible Mentor may likewise be retained as presentation-preference metadata without remaining a separate Mentor identity or program.

## Local Conversation Continuity

Mentor conversation history is stored locally and learner-scoped under:

`khaemenes_archaemenes_mentor_history_v1`

It is not a grade, transcript, psychological record, or authenticated cloud conversation record.

## Public Archaemenes Home

The public character/home repository remains:

`https://artist1970.github.io/Archaemenes.github.io/`

That public home describes Archaemenes. The Academy-hosted `/mentor/` surface is the family-linked learning doorway.
