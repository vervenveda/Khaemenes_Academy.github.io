# 2026-11-16 · Compact Parent Profile Header / Remove Extra Dark Bar

## User request
Shorten the official Parent Profile header and remove the additional charcoal horizontal bar immediately beneath it. **Preserve the charcoal My Parent Profile title hero exactly as is.** Keep both tickers, shared hamburger/menu, translator and all family functionality.

## Cause and scope
- The canonical shared VNV header declares `--vnv-header-height:66px`.
- The Parent Profile previously inherited a charcoal `#vnv-language-rail` with 54px minimum height and padding, creating an unnecessary dark spacer below the official light header, even when the translator rail was empty.
- This repair is **Parent Profile only**, not a global Academy header rewrite.

## Changes
- `5b5de3c12089a6b671f97a33160845036bba52cb`: assign page-specific `vka-parent-profile` body scope and refresh stylesheet to `?v=20261116-profile-compact-header-06`.
- `5eed30d0a110a389e1b1e4c5823c3b97ca90f513`: set the shared header to 52px minimum, shrink only logo/menu geometry (not text), neutralize the translation rail to parchment, hide it when empty, and preserve functional translation controls if populated.

## Verification
- Re-fetched committed Parent Profile HTML and canonical parent stylesheet.
- Parent Profile inline JavaScript syntax: PASS.
- Exactly one static profile content hero remains. No alterations to profile or child popup owner code.
- Live Chrome visual, translator dropdown, tickers, menu first click, and tablet widths: NOT RUN; production visual acceptance HOLD.

## Preserved
Existing family identity and permission source, learner dialogues, Kindergarten activity preferences, grades, records, T03 status, tickers, official shared header/menu and the original charcoal title hero. No browser storage migration or personal data change.
