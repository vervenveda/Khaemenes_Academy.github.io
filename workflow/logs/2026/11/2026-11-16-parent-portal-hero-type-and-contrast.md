# 2026-11-16 · Parent Portal Hero Navigation, Type Size and Contrast

## User requested
- Add a fifth action, **Higher Learning**, alongside Academy Home under the Family Learning Center hero.
- Canonical hero eyebrow **33px** and main hero title **66px** at desktop widths.
- No on-page text smaller than **16px**, including descriptive/metadata labels; retain responsive behavior on narrow screens.
- Change barely visible pale gold lettering on light parchment further down the page to high-contrast charcoal; gold stays as restrained decoration.

## Source changes
- `e41ec278e9345f3233fb0759205699245292626e` — `family/index.html`: fifth direct Higher Learning link to the existing `https://vervenveda.com/Khaemenes_Higher_Learning.github.io/` destination and stylesheet cache refresh.
- `f9879e15b2ee1b231c7c2489e8fe3ce516ce1bf7` — `assets/vnv-ka-parent-canonical-v1.css`: five-column desktop hero row, 33px eyebrow/66px title, scoped >=16px metadata and control rules, charcoal account-section eyebrow, and three/two/one responsive hero-button columns.

## Source verification
- Re-fetched committed HTML/CSS; all five hero hrefs present: PASS.
- Inline JavaScript parses: PASS.
- Stylesheet contains 33px / 66px / >=16px and contrast overrides: PASS.
- Runtime computed fonts across all dynamically inserted external header/ticker/toolbar components: NOT YET VERIFIED; static CSS selectors cannot establish complete browser compliance.
- Actual Chrome screenshots, mobile overflow, click behavior and visual WCAG contrast: NOT RUN. Production acceptance HOLD.

## Safety
No family identity, learner progress, course grades, stored photos, credential/permission data, STOS bindings or academic authority changed. Presentation and navigation only.
