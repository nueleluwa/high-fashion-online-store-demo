# Design System (measured)

Values marked **(est.)** are estimates from screenshots; others are computed styles from the live site (measured with Playwright probes; see `tools/visual/anchors.js`).

## Fonts
All served from `/cdn/shop/files/*.woff2` (woff fallback). Licensing to be confirmed with client.
| Family | File | Use |
|---|---|---|
| BDSans-Black | BDSans-Black.woff2 | Nav buttons, filter/sort, buttons (weight 300 declared, face is the Black file) |
| BDSans-Bold | BDSans-Bold.woff2 | H1, footer headings, accordion titles |
| BDSans-Regular | BDSans-Regular.woff2 | Secondary headings |
| Helvetica-Light | Helvetica-Light.woff2 | Body, footer links, prices |
| Helvetica2 / Helvetica-Bold | Helvetica2.woff2, Helvetica-Bold.woff2 | Available; bold emphasis |
| PPEditorialNew-Regular/Ultralight | PPEditorialNew-*.woff2 | Loaded, editorial use (unverified) |
| Aegean | aegean.woff2 | Loaded (unverified) |

## Typography
| Role | Font | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|
| Body / footer link | Helvetica-Light | 12px | 10.8px | 0.5px | none |
| Nav button / filter / sort | BDSans-Black | 12px | 10.8px | -0.5px | uppercase |
| H1 / page title / footer heading | BDSans-Bold | 17px | 15.3px (footer heading 17px) | 0.3px | uppercase |
| Product price (PDP) | Helvetica-Light | ~16px (est.) | — | — | grey #6b7280 (est.), compare-at struck through |
| Product description | Helvetica-Light | ~19px (est.) | ~19px | — | none |

## Colours
- Text `#000`; background `#fff`; image placeholder grey `#f0f0f0` (est.); page background below content `#ececec` (document-less area only).
- Sale accent red `~#d00` (est.). Editorial tile cream `~#f3f0e8` (est.). Newsletter popup pink `~#fdeeee` (est.). Popup button `~#595555` (est.).
- Borders: Tailwind default `rgb(229,231,235)` where present; header has a hairline.

## Layout
- Header height **65px**; page horizontal padding **17px** (`--section-horizontal-spacing`); full-bleed content, no max-width container on grids.
- Collection grid desktop: **4 columns × 360px** cards, aspect **4:5 (360×450)**, **0 gap**. Mobile: **2 columns × 195px**, image ~195×243, title+price below.
- Collection title at y=82; FILTER/SORT row at y≈130; grid starts y=153.
- Product desktop: gallery column 720px (50%) vertical stack; info column 50% with 17px padding, sticky.
- Footer: 4 equal columns (~360px), 161px tall, link line-height ~15px.
- Dropdown bar: full-width under header, links centred, `gap-4`, items `py-2`, 12px uppercase.

## Breakpoints
- Tailwind `lg` = **1024px**: desktop nav and 4-column footer vs hamburger and single-column footer.
- **750px**: homepage artwork, carousel sizing and video switch between mobile and desktop variants (from the reference's own `min-width: 750px` media queries).

## Buttons / Links
- Add to Cart: full-width black bar, white BDSans uppercase text, ~36px tall, 0 radius.
- Filter Apply: black, full-width, 0 radius. Popup sign-up: grey fill, 0 radius.
- Radius: 0 for buttons/inputs; popup 16px (est.).
- Size buttons: 38×28px (est.), 1px black border when selected, unavailable = strike-through.
- Colour swatches: 28px square thumbnails, selected = black outline.

## Motion
- Dropdown/drawer transitions 200ms ease, opacity; chevron rotate.

---
## Measured values (supersede the estimates above)
Probed with Playwright against hanifa.co; implementation diffs confirm them.

| Item | Value |
|---|---|
| Primary nav text (SHOP / COLLECTIONS / THE BRAND) | BDSans-Black **17px**, ls -0.5px, uppercase (text widths 60/149/119px) |
| Filter / Sort | BDSans-Black 12px, ls -0.5px |
| Page title (collection, content) | BDSans-Bold 17px / 15.3px, ls 0.3px, centred on content pages |
| PDP title | BDSans-Bold **16px** / 14.4px, ls 0.3px |
| PDP labels (Color, Size, Quantity, Ready to ship) | Helvetica-Light 12px |
| Add to Cart | BDSans-Black 17px, ls -0.5px, white on black, 36px tall |
| PDP accordion title | BDSans-Regular 14px, **weight 700 (synthesised bold)**, ls 1px, row 44px |
| PDP description | Helvetica-Light 19px / 19px |
| Desktop card hover bar | white, 68px tall, title 17px weight 600 (left), compare-at struck + price grey (right); **no image swap** |
| Mobile card text | title 13.6px weight 600; struck compare-at; grey price; 18px below image |
| Pagination | 17px Helvetica-Light, numbers padded 4.25/8.5px, current underlined, `NEXT →` right-aligned with underline; **24 products/page** (search: 12/page) |
| Content page column | 703px centred (policy pages 394px desktop / 350px mobile); `.rte` top margin 17px |
| Rich text | `p` 12px/12px with 17px between paragraphs (FAQ/policy); FAQ `h4` Outfit 21.25px |
| Mobile gutter | **9px** (header 10px); desktop 17px |
| Header | 65px desktop, **67px mobile** |
| Carousel (home) | slides 40% (desktop) / 70% (mobile) wide, 4px gap, 4:5, image only; round 40px white arrows; 5 dots; heading BDSans-Black 16px ls 2.5px; auto-advances |
| Home hero | 2000×1333 (3:2) full width |
| Home editorial rows | full-bleed single images with text baked in (desktop 2252×1491 / 1501×1001; mobile 2252×1745 / 1501×1231) |
| Home video | SproutVideo 16:9 desktop, 3:4 mobile |
| Search page | 3-col results (1080px) + 360px sidebar (Articles, Pages), 12/page |
| PDP below fold | "YOU MAY ALSO LIKE": 2 image-only 50% cards |
| Collection `all` ordering | alphabetical by title |
