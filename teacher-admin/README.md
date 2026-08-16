# Khaemenes Academy Teacher Administration

`teacher-admin/index.html` is the Academy-wide teacher-facing coordination shell for the full academic continuum.

## Scope

The portal links the teacher to:

- Pre-K / Crèche
- Kinder Garden
- Elementary (Grades 1–5)
- Middle School (Grades 6–8)
- High School (Grades 9–12)
- Higher Learning / Advanced study
- Family and learner continuity tools
- Academy-wide evidence and answer-key review holds
- Cross-Academy teacher resources

## Evidence review

The page reads the shared browser-local queue:

`khaemenes.evidence-review-holds.v1`

This queue may contain evidence challenges produced by Academy course integrity layers. Teacher review can resolve or reopen a hold and export the local review record as JSON.

A review hold must not silently:

- change a learner grade;
- change an answer key;
- award formal mastery;
- change placement;
- create a competing learner identity.

Any formal correction must be explicit and documented by the course or Academy system that owns that decision.

## Public security boundary

This repository is public. Therefore this teacher-admin page is **not** authentication and must not contain:

- passwords or passcodes;
- API keys or access tokens;
- private learner records;
- hidden answer-key secrets;
- protected service routes;
- private backend topology;
- administrative credentials.

Protected teacher actions and private data must be served through an authorized backend boundary. A client-side JavaScript gate is not treated as secure authentication.

## Academic authority

The Academy shared continuum coordinates stages and public-safe interoperability. Individual courses retain course-specific lessons, assessment logic, evidence, and mastery decisions. Formal placement remains governed by Academy identity/placement systems.

## Design principle

One teacher administration point; distributed academic ownership.
