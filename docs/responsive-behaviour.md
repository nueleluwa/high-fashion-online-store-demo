# Responsive Behaviour

Viewports captured: 1440×900, 1366×768, 768×1024, 390×844, 375×667 (homepage at all five; other templates at desktop and mobile).

| Area | Desktop (≥1024) | Mobile (<1024) |
|---|---|---|
| Header | Text nav left, logo centre, 3 icons right | Hamburger left, logo centre, search + cart icons right (account icon hidden) |
| Collection grid | 4 cols, 0 gap, image-only cards | 2 cols, 0 gap, cards show title + struck compare-at + price under image |
| Collection toolbar | FILTER / SORT 12px at 17px padding | Same, 10px padding |
| Product | Gallery 50% vertical stack, sticky info 50% | Single column: carousel (dots left, arrows right) → info |
| Page heights (ref) | Home 4774 / Collection 3066 / PDP 5068 | Home 2449 / Collection 4579 / PDP 2376 |
| Homepage editorial rows | Full-bleed single images (copy baked in), desktop crops | Separate mobile crops below 750px (still full-width, not stacked halves); carousel 70% slides instead of 40% |
| Footer | 4 columns | Single column (verified at 390 and 768) |
| Overflow | none at any captured viewport | none |

Notes: homepage imagery, carousel sizing and video switch at 750px (the reference's media queries); header/nav and footer columns switch at 1024px (`lg`). Tablet (768px) therefore uses the mobile header and single-column footer but desktop homepage artwork.
