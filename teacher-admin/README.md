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
- Archaemenes, the Scholar and Educational Mentor of Khaemenes Academy

## Public academic review sequence

The public teacher page presents only the educational sequence:

`Evidence → Teacher review → Educational guidance → Teacher / Course / Academy decision`

The responsibilities are deliberately separated:

- **Evidence review** holds disputed or uncertain results for inspection.
- **Teacher Administration** preserves the teacher's role in interpreting evidence and documenting decisions.
- **Archaemenes** provides academic mentoring, curriculum guidance, mastery guidance, evidence-review guidance, and learner-support recommendations.
- **Course or Academy authority** remains responsible for any formal grade correction, mastery determination, placement action, or official record change.

The browser-local workflow contract is stored under:

`khaemenes.teacher-advisory-workflow.v1`

This is a browser-local coordination record. It is not a secure account, permanent records service or claim that an external advisory service is connected.

## Archaemenes teacher advisory bridge

The portal directly loads:

`../assets/khaemenes-archaemenes-advisor.js`

The bridge now supports both direct teacher guidance and the Academy workflow contract above. It can:

- normalize a public-safe evidence submission;
- route that submission into Teacher Administration;
- create a teacher-review workflow record;
- request Archaemenes guidance for that record;
- document a teacher review decision;
- expose status without claiming protected services are live.

The public bridge does not import or expose protected ArchaemenesCore internals, private prompts, protected routes, credentials, source-weighting logic, or backend topology.

Archaemenes may advise, scaffold, identify review needs, and support instructional decisions. Archaemenes does not independently:

- award formal mastery;
- change learner placement;
- silently change a grade or answer key;
- change learner identity.

A future authorized service may respond to the same public-safe events behind the protected infrastructure boundary without changing the teacher portal contract.

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

One teacher administration point; distributed academic ownership; one canonical institutional educational mentor; evidence routed through explicit human review before formal academic decisions.
