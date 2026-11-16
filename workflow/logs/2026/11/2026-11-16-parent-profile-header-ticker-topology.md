# 2026-11-16 · Parent Profile Header and Ticker Placement
**Scope:** `family/profile/index.html`, visual DOM source order only.

## Report
In the supplied Chrome screenshot, the Parent Profile page displayed the large charcoal title hero and navigation before the shared two tickers and official Khaemenes Academy header. The canonical structure requires the shared 333 ticker, auto-populated page ticker and one Academy header/menu at the very top of the page, followed by the translator and then page hero.

## Root cause
The parent page placed `<section class="vka-profile-hero">` and `<nav class="mainnav">` ahead of its unique `#vnv-language-rail`. The official scripts mount shared chrome relative to the rail, so the shared chrome appeared below the first two page-owned sections.

## Repair
Commit `5e5ae53226462b365e1bff463cd068f135a395a4`: moved the unique translator rail before the content hero and page navigation, without duplicating scripts or controls.

Expected top-to-bottom: shared 333 ticker → shared page ticker → official Academy header/menu → language rail → Parent Profile title hero → Parent Profile navigation → existing profile content.

## Verification
Re-fetched source: exactly one rail, exactly one official 333 ticker loader and one header loader, and exactly one profile hero. Inline JavaScript syntax checked PASS. Live Chrome DOM placement, script network load, hamburger first-click, ticker counts and tablet behavior remain NOT RUN.

## Safety
No student/parent profile, appearance keys, academic records, family registry, authentication, permissions or STOS runtime state modified.
