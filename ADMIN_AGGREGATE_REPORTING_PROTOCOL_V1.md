# Khaemenes Academy Admin Aggregate Reporting Protocol v1

## Purpose

Khaemenes Academy enrollment, learner continuity, course activity, Institutional ID readiness, and beta-program participation should be visible to the Verve N Veda Administration portal as **aggregate operational counts**.

The static administration page is not an appropriate location for sensitive child records or authentication secrets. System-wide authoritative totals therefore belong behind the protected Account/Data Bridge service.

## Administrator dashboard measures

The Verve N Veda Admin `Academy Data` view should support at least:

- family count;
- authorized-adult count;
- K–12 student count;
- Higher Learning adult-scholar count;
- total learner count;
- exact grade distribution from Pre-K through Grade 12;
- campus/stage distribution;
- learner-scoped course/class record count;
- number of learners with course-state records;
- confirmed / provisional / missing Student or Scholar IDs;
- beta-program participant / lead count.

## Static browser-local mode

When no protected Data Bridge is configured, the Admin dashboard may summarize the canonical browser-local Family Registry and learner-scoped course keys on the **same origin**.

Those figures are explicitly local diagnostics and must never be presented as global Academy enrollment.

## Protected aggregate mode

The protected Data Bridge should eventually return a display-safe object such as:

```json
{
  "academy": {
    "capturedAt": "2026-08-16T18:00:00Z",
    "families": 120,
    "adults": 153,
    "students": 184,
    "scholars": 27,
    "learners": 211,
    "courseRecords": 738,
    "learnersWithCourseState": 198,
    "grades": {
      "pre-k": 10,
      "k": 12,
      "01": 14,
      "02": 15,
      "03": 13,
      "04": 14,
      "05": 14,
      "06": 13,
      "07": 13,
      "08": 12,
      "09": 11,
      "10": 10,
      "11": 9,
      "12": 8
    },
    "stages": {
      "preschool": 10,
      "kindergarten": 12,
      "elementary": 70,
      "middle": 38,
      "high": 38,
      "higher": 27
    },
    "institutionalIds": {
      "confirmed": 205,
      "provisional": 6,
      "missing": 0
    },
    "beta": {
      "total": 42
    }
  }
}
```

Numbers shown above are schema examples only, not real enrollment figures.

## Data minimization

The aggregate dashboard must not require or display:

- passwords or passcodes;
- password hashes;
- verification or recovery codes;
- session tokens;
- child dates of birth;
- street addresses;
- medical information;
- private academic submissions;
- private anti-abuse scores or thresholds;
- custody documents;
- government identifiers.

Individual learner administration, when later required, belongs to an authenticated protected service with role-based authorization and audit logging.

## Beta Program

The ecosystem-wide public Beta Program uses a reusable link widget hosted at:

`https://vervenveda.com/assets/vnv-beta-link.js`

The canonical public Beta gateway is:

`https://vervenveda.com/beta/`

Academy pages that load the canonical Family Registry automatically receive the Beta Program doorway. Other Verve N Veda repositories should include the same reusable script during their page-by-page hardening pass.

Beta feedback must remain separate from grades, mastery, placement, and academic evidence.

## Authority boundary

- Family Registry: learner/family continuity and formal placement in local mode.
- Protected Account Service: authenticated identity, verified family accounts, global Institutional IDs.
- Protected Data Bridge: authoritative aggregate reporting to Administration.
- Admin portal: operations display and review surface.
- NAIB: routing, not enrollment counting authority.
- Archaemenes: mentoring, not identity or reporting authority.
- Course systems: course-specific mastery evidence.
