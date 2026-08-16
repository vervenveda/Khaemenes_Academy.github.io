# Khaemenes Academy Front Door Rollout Status

## Phase 1 — Canonical enrollment and placement

Status: implemented.

- Family Registry v1.2.0 supports exact grade placement from Pre-K through Grade 12 plus the `higher` lifelong-learning stage.
- Grade determines canonical K–12 school stage.
- Legacy broad-stage learners remain intact until grade is explicitly supplied.
- Family Enrollment is available at `family/enroll/`.
- Adult self-directed scholars use a linked learner identity at `stage: higher` with no artificial Grade 13.

## Phase 2 — Canonical Student Portal

Status: implemented.

- Student Portal is available at `student/`.
- Active learner is read from the Family Registry.
- Canonical learner context is loaded.
- Missing exact-grade placement is detected before normal continuation.
- Learner switching preserves separate learner identities.
- NAIB may recommend the route but cannot change placement, identity, grades, or mastery.

## Phase 3 — Shared school integration contract

Status: implemented at shared-infrastructure level.

- `assets/khaemenes-learner-context.js` defines the Academy learner context contract.
- `assets/khaemenes-family-school-bridge.js` detects stage/grade mismatches without forced redirects.
- School/course state can be namespaced by canonical `learnerId`.
- Public routing contracts preserve preview access and formal placement authority boundaries.

## Phase 4 — Academy Home front door

Status: implemented.

- Academy Home now exposes four explicit institutional entrances: Student, Family, Adult Scholar, and Teacher Administration.
- Enrolled learners enter through `/student/` rather than being required to choose a school manually.
- Public campus browsing remains available as exploration.
- Adult learners enter through `/adult/enroll/`.
- Higher Learning scholar continuation uses the Higher Learning `/start/` bridge.
- Teacher Administration is now surfaced as a first-class Academy doorway.
- Stale front-page PWA/icon references and malformed legacy resource routes were removed from the canonical home page.

## Phase 5 — Family Hub

Status: implemented at canonical family-workspace level.

- `family/` now recognizes Preschool through Higher Learning.
- K–12 learner cards display canonical grade/stage context rather than using broad-stage selection as the primary placement control.
- `/family/enroll/` is the canonical Enroll / Add Learner and placement-update surface.
- Adult roles and adult scholar identities are explicitly separated.
- The active adult may begin or resume a self-directed Higher Learning account through `/adult/enroll/`.
- Family export and invitation boundaries remain local-first/public-safe.

## Phase 6 — Elementary integration

Status: root and grade continuity substantially implemented; second-depth audit remains.

- Elementary root treats the Academy learner identity as authoritative.
- Grades 01–05 have canonical continuity work in place.
- Learner-scoped course-state conventions are being adopted.
- Remaining work is subject halls, assessments, records, certificates, and teacher tools where parallel local state may still exist.

## Phase 7 — Kinder Garden / Preschool integration

Status: Preschool approved for current front-door continuity; Kinder Garden integration hardening remains.

- Preschool supports canonical Pre-K placement and legacy migration.
- Kinder Garden remains academically approved and retains its progression system.
- Final Kinder Garden work is to subordinate older continuity/profile records to the canonical Academy learner identity.

## Phase 8 — Middle School integration

Status: grade-root continuity implemented; second-depth audit remains.

- Grades 06–08 use shared canonical continuity.
- Preview access does not change formal placement.
- Remaining work is deeper course/assessment/records/teacher-tool integration.

## Phase 9 — High School integration

Status: active on `hardening/archaemenes-highschool`; not released to High School `main`.

- Grade 09 canonical front door exists on the hardening branch.
- Grade 10 has an established substantial portal and requires a non-destructive learner-context patch rather than replacement.
- Grade 11 canonical landing page has been added on the hardening branch.
- Grade 12 canonical landing page has been added on the hardening branch with a deliberate Higher Learning transition.
- High School root v4.1-readiness exists on the hardening branch.
- A deliberate release/merge decision is still required before public High School traffic receives the hardening branch.

## Phase 10 — Higher Learning bridge

Status: bridge implemented; course-level scoping remains.

- Adult enrollment is available at `/adult/enroll/` in the Academy.
- Higher Learning scholar entry is available at `Khaemenes_Higher_Learning.github.io/start/`.
- Grade 12 and adult learners can continue into Higher Learning without creating a competing identity or Grade 13.
- Remaining work is learner-context adoption inside individual Higher Learning course landing pages and records.

## Phase 11 — Teacher Administration visibility

Status: central public-safe shell implemented.

- Teacher Administration spans Pre-K through Higher Learning.
- Institutional review sequence is represented as Noema → NAIB → Teacher Administration → Archaemenes → Course / Academy decision.
- Evidence review may trigger a hold or human review but never silently changes a grade or placement.
- Protected backend/authentication work remains outside the public shell.

## Validation boundary

Source inspection and static contracts verify structure and authority boundaries. Full browser, mobile, keyboard, cross-origin storage, and end-to-end runtime behavior remain unverified until exercised in an actual browser environment.
