# Design system (DES-1)

**Direction:** a calm, trustworthy reference work, closer to a well-made textbook or Our World in Data than to an app store game. The content is serious, so the design should get out of its way. It stays fun through the labs, missions and rewards, not through decoration.

**Where it lives:** `css/theme.css` loads after the base styles in `index.html` and overrides them. `js/polish.js` strips decorative leading emoji from headings, tabs, card titles and summaries.

## Tokens
- **Paper and ink:** `--bg #FAF9F6`, `--card #FFF`, `--card2 #F4F2EC`, `--ink #1C1C1E`, `--muted #5D6068`, `--line #E3E0D8`. Dark mode uses its own set.
- **Brand:** `--brand #1F4E79` (deep blue). Each discipline keeps its own `--accent` color, used only for the title rule, active tab underline, tags and lab buttons.
- **Type:**
  - Headings, key figures and reading text use a serif (`--serif`: Iowan Old Style, Palatino, Charter, Source Serif, Georgia).
  - Body text uses the system sans at 16px with a line height of 1.6.
- **Radius:** 10px for cards, 8px for buttons, 6px for tabs and chips, 4px for tags. Shadows: none; hairline borders do the work.

## Rules
1. **Page headers:** no gradient banners. A page header is a title block: a short colored rule, a breadcrumb, a serif title and a muted lede.
2. **Emoji:** they belong inside labs, chips and body text where they carry meaning. They don't go in headings or tab labels.
3. **Discipline color:** one discipline color per page, used sparingly.
4. **Tabs:** underlined text, not pills.
5. **Banners inside pages:** become paper cards with a brand-colored left rule. Inline gradients are overridden automatically.
6. **Any new component:** must look right in light and dark mode and at 390px wide.

## Next design units
- **DES-2:** home page restructure, with "Start here" by age band, the search box at the top, and fewer cards above the fold.
- **DES-3:** discipline page order (a beginner layer first, then depth, then labs), and a sticky in-page section menu.
- **DES-4:** accessibility audit (contrast, focus order, alt text, reduced motion).
