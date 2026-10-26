# Component Inventory

| Component | Appearance / dimensions | Responsive | States / interactions |
|---|---|---|---|
| Announcement bar | **Not present** at audit time | — | — |
| Desktop header | 65px, white, hairline bottom, 17px side padding, sticky (`data-sticky`, `is-stuck`) | `lg` (≥1024) only | Dropdown toggles |
| Mobile header | 65px; hamburger left, logo centre, search + cart right | <1024 | Menu drawer opens |
| Primary navigation | SHOP / COLLECTIONS / THE BRAND, BDSans 12px uppercase, chevron | ≥1024 | Click toggles bar; click outside / focusout closes; chevron rotates |
| Dropdown bar | Full-width under header, centred links, SALE red | ≥1024 | 200ms opacity fade |
| Mobile navigation drawer | Left drawer (accordion groups; built from the structure, exact reference capture not obtained) | <1024 | Open/close |
| Search bar | Inline row under header (~60px): magnifier, "SEARCH" placeholder, close X right | all | Opens on icon; submits to `/search?q=` |
| Hero | Full-width image `HANIFA_HEADER_IMAGE_26.png` (2000×1333, 3:2 → 960px at 1440) | scales | Link |
| Carousel ("Just Restocked") | Heading BDSans centred + "View all" link; slides image-only (no title/price): 40% wide at ≥750px, 70% on mobile, 4px gap, 4:5; 40px round white arrows, 5 dots; auto-advances | mobile swipe | Prev/next, dots, autoplay |
| Editorial row | One full-bleed image per row with the cream panel and copy baked into the artwork; separate desktop/mobile crops switching at 750px | desktop 2252×1491 / 1501×1001; mobile 2252×1745 / 1501×1231 | Link |
| Video embed | SproutVideo player, full-width | scales | Autoplay (unverified) |
| Collection title + toolbar | H1 17px; FILTER ▾ left, SORT ▾ right, 12px | all | Opens filter drawer / sort menu |
| Product card | 4:5 image on `#f0f0f0`; desktop shows image only; mobile adds title (Helvetica, 14px est.), struck compare-at, price grey | 4 col → 2 col | Hover bar on desktop (verified) |
| Product grid | 0 gap, edge-to-edge | 4 → 2 cols | — |
| Filter drawer | Left drawer ~390px: Availability radios, Price slider (From/To), Colour swatches grid, Size radios, black APPLY | full-width on mobile | Collapsible groups |
| Product gallery | Desktop: stacked full-width images in left 50%; mobile: carousel with dots + arrows | — | Swipe/arrows |
| Product info panel | Title (BDSans-Bold 16px), price + compare-at, "Shipping calculated at checkout.", Color label + swatches, Size buttons, Quantity − 1 +, "Ready to ship", Shop Pay installments line, ADD TO CART, Beam line | sticky desktop | See interaction spec |
| Variant (colour) selector | 28px swatches with product image | — | Selected outline; label updates |
| Size selector | Text buttons; selected boxed; unavailable struck-through | wraps | Select |
| Quantity control | −/+ with centred number, underline | — | min 1 |
| Accordion | BDSans-Regular 14px (synthesised bold), 1px tracking, uppercase, chevron, 44px rows | — | Expand/collapse |
| Cart drawer | Right drawer ~460px: "Your cart – N item", close X, line items (thumb, title, variant, price, qty −/+, Remove), Subtotal, "Taxes and shipping calculated at checkout", black CHECK OUT, purple Shop Pay | full-width mobile (est.) | Add/update/remove |
| Newsletter popup | Centred 600×553 modal, pink, "NEVER MISS A LAUNCH AGAIN…", email field, grey SIGN UP NOW, close X | — | Appears on load; close |
| Chat widget | Bottom-right pill "Chat with us" | — | Third-party; not replicated |
| Footer | 4 columns + © line, white | single column below 1024px (verified) | Links, social icons |
| Content page | Centred BDSans H1, rich text | — | — |
