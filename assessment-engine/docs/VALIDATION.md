# Foundation Validation Checklist

## Automated checks completed for the starter package

- JSON files parse successfully.
- JavaScript modules pass syntax checking.
- Required folders and relative paths are present.
- The demonstration bank contains permanent item IDs.
- Formal and adaptive eligibility are explicitly represented.
- Local save, resume, reset, and export paths are implemented.

## Browser checks after upload

Test on the live GitHub Pages URL:

- [ ] Landing page loads without a console error.
- [ ] Theme toggle works and persists after refresh.
- [ ] Foundation diagnostic loads.
- [ ] All eight items can be completed.
- [ ] Refreshing mid-attempt resumes progress.
- [ ] Objective score is calculated.
- [ ] Likert response remains non-graded.
- [ ] Written response is marked for human review.
- [ ] Mastery bars render.
- [ ] JSON export downloads.
- [ ] New attempt clears only the current diagnostic attempt.
- [ ] Keyboard-only navigation reaches every control.
- [ ] Focus indicators are visible.
- [ ] Mobile layout has no horizontal scrolling.
- [ ] Print view is readable.

## Repository follow-up

Current `apps/` filenames include two nonstandard extensions:

- `career_star_ind`
- `mentor_review_index.ht`

Normalize these after preserving backups:

- `career_star_index.html`
- `mentor_review_index.html`

Then update the root `index.html` links.

## Before adding a course bank

- [ ] Course ID and version assigned.
- [ ] Assessment blueprint approved.
- [ ] Standards crosswalk reviewed.
- [ ] Item IDs are unique.
- [ ] Scoring keys verified independently.
- [ ] Rubrics supplied for human-review tasks.
- [ ] Accessibility reviewed.
- [ ] Print or fixed alternative prepared.
- [ ] Retake policy documented.
- [ ] Answer-key exposure reviewed.
