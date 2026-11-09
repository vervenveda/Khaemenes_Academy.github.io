# Yearbook → Learner Profile Picture Integration
Date: 2026-11-09
Status: review-branch candidate, NOT deployed

## Student journey
1. Student opens the **Yearbook** button/pop-up, which embeds the canonical `Academy-Yearbook.github.io` application rather than cloning the editor.
2. After selecting a Yearbook photograph, student explicitly chooses **Make Available to My Profile**. The application verifies that an existing Academy learner is selected on this browser, confirms the action, and stores only a reference to that photo's existing Yearbook IndexedDB record.
3. Student returns to their stage's **Customize Picture** or native photo import controls, chooses **Choose from My Yearbook**, previews a learner-filtered set of explicitly linked images, then selects one.
4. Image is resized locally to a 240×240 JPEG. The profile's existing save pathway owns the new profile image. Yearbook source photo and its edit history are unchanged. The shared profile studio previews first and still requires **Save My Look**; native editors commit on explicit selection.
5. Parent Profile does NOT expose Yearbook images. Parent appearance remains in adult-scoped keys.

## Repository map
- **Yearbook generator:** `vervenveda/Academy-Yearbook.github.io`, branch `upgrade/yearbook-profile-image-bridge-2026-11-09`, `index.html`.
- **Shared learner bridge:** `vervenveda/Khaemenes_Academy.github.io`, branch `upgrade/profile-photo-editor-parity-2026-11-09`, `assets/khaemenes-yearbook-profile-images.js`.
- **Shared student picture studio:** `assets/khaemenes-universal-profile-look-editor.js`, plus stage adapters for Pre-K, Elementary, Middle, High and Higher Learning.
- **Pre-K / Kindergarten / Elementary:** their existing `student-profile/index.html` pages have native Yearbook choices and Open Yearbook actions; Pre-K and Elementary also have the universal picture studio.
- **Middle School:** existing `index.html` learner-specific picture entry offers the shared Yearbook popup and picture chooser.
- **High School Grades 9–12:** `vervenveda/Khaemenes_High.github.io`, branch `upgrade/high-yearbook-profile-picker-2026-11-09`; Grade 09 photo component is shared by upper-grade dashboards, and four Edit Profile pages consume the shared universal studio.
- **Higher Learning:** `index-core.txt` and shared stage picture entry.

## Storage and privacy contract
- The existing Yearbook remains **one 50-photo browser-wide IndexedDB gallery** (`KhaemenesYearbook/photos`) and is **not yet an authenticated per-student gallery**.
- The learner's explicit choices are only **photo ID references** under `khaemenes.yearbook.profileChoices.v1:<learnerId>` (browser localStorage). This avoids duplicating the gallery or moving its records. The selected thumbnail must still exist.
- Source photo data is rendered only for the currently selected learner with linked ID references. If learner selection changes while reading an image, the selection is abandoned.
- Profile-save operations keep their original learner-specific storage and authorization checks. A resized profile JPEG is deliberately saved in the learner's existing photo record, while the full-resolution Yearbook source remains unchanged.
- **This is local presentation convenience, not a security boundary:** a person with control of the browser/origin can inspect the original shared Yearbook gallery or edit browser storage. Avoid using photos without permission. Sensitive student photos and backups are not encrypted in the existing Yearbook.
- This feature does not create a learner, verify guardian consent, enable cross-device cloud sync, authenticate with T03, or change academic records.

## Synthetic acceptance and required browser regression
- Bridge regression `assets/khaemenes-yearbook-profile-images.test.cjs`: explicit reference creation, no duplicate references, missing/deleted source handling, sibling isolation for the learner-specific picker, unchanged profile when read/selection fails.
- Source-level script and load-order validation: all grade profile pages should load bridge before image editor; only learner adapters set `allowYearbook:true`. Parent adapter must not.
- Browser tests still required: select learner A, mark a photo, choose it from Pre-K/Kindergarten/Elementary/Middle/High/Higher profile; switch to learner B and confirm no inherited choices; edit/delete original Yearbook image; upload traditional picture; Save/Cancel; repeat after refresh and offline reopening; keyboard focus and tablet/mobile pop-up fit.
- Validate the one Yearbook gallery's shared-device privacy disclaimer and the local-only nature of exported images.

## Ordered deployment dependency
1. Review/publish Academy bridge + updated universal editor and stage adapters.
2. Review/publish the canonical Yearbook application, verifying the new opt-in action against the bridge.
3. Review/publish each campus's learner editor integrations one grade/stage at a time, checking the script version URLs and local picture restoration.
4. Do not merge to production or commission STOS/T03 without separate user authorization.

## Verification continuation — 2026-11-09

- High School shared photo component now increments a photo-operation revision when an ordinary upload starts, a Yearbook selection starts, an image is removed, or a selected learner changes. Old asynchronous image decodes are discarded. Its persistent Grade 9–12 wiring test checks the cancellation guards.
- The Middle/Higher stage Yearbook launcher was found to use an undefined `d` variable; corrected to the actual document object and versioned on both dependent campus pages.
- The stage-photo regression now executes the Yearbook launch button, proves it uses the currently selected learner ID, and rejects launches after changing to an ineligible profile. **22 synthetic assertions passed** after repair.
- Parent-specific photo adapter regression remains passing and has no Yearbook opt-in.
- High School wiring tests and Yearbook bridge isolated tests pass; these are not full browser tests. Chromium is available in a local shell but no installed Playwright package and GitHub review branches cannot be fetched directly from that environment. Interactive browser verification of the actual integrated branches is still required.
- Review-branch changes only: no merge, release, T03 activation, or actual learner data change.
