# Asset Manifest

Base: `https://hanifa.co/cdn/shop/files/` (also `cdn.shopify.com/s/files/1/0014/1849/4015/files/`). Usage rights: assumed authorised by client (stated in the brief); confirm before launch.

## Homepage
| Section | File | Width used | Mobile variant |
|---|---|---|---|
| Hero | `HANIFA_HEADER_IMAGE_26.png?v=1779740058` | 2000 | (check) |
| Just Restocked carousel | product featured images from `collections/just-restocked` | 800 | same |
| Best Sellers tile | `Slice_4_7fc8db15-a2a3-462c-b298-643d06f3d7ea.jpg?v=1769928727` | 2000 / 750 | `Slice_4-1.jpg?v=1769928739` (1000/375) |
| Ready to Ship tile | `Slice_3_1.jpg?v=1769528890` | 2000 / 750 | `Slice_4_1.jpg?v=1769528906` (1000/375) |
| Video | SproutVideo embed | — | Not retrievable (blocked headless) |

## Fonts
`BDSans-Black/Bold/Regular`, `Helvetica-Light`, `Helvetica2`, `Helvetica-Bold`, `PPEditorialNew-*`, `aegean` at `/cdn/shop/files/<name>.woff2` (see design-system.md).

## Products
All product images come from `data/products-all.json (built by `npm run data:refresh`)` (`images[].src`, with `width`/`height`), served via Shopify CDN with `?width=` resizing.

## Missing / to obtain
Logo SVG/PNG (header "H" mark), social icons (draw as SVG), homepage video source.

---
## Corrections after implementation
- Homepage editorial "tiles" are **single full-width images** with the cream panel and copy baked in:
  - Row 1: desktop `Slice_4_7fc8db15-a2a3-462c-b298-643d06f3d7ea.jpg` (2252×1491), mobile `Slice_4-1.jpg` (2252×1745) → `/collections/bestsellers`
  - Row 2: desktop `Slice_3_1.jpg` (1501×1001), mobile `Slice_4_1.jpg` (1501×1231) → `/collections/shipping-now`
- Video: original SproutVideo embeds (public iframes) — desktop `videos.sproutvideo.com/embed/109bddb01b1aefcb9a/051a9441f0048bb8`, mobile `.../8c9bddb01b1aefc506/25c9f86070a7f3a0` (params `autoPlay=true&playerColor=ffffff&showControls=false&loop=true`).
- About page: `leah---website.gif` and `HANIFA0194_copy.jpg` (720×720 cover) under "& MORE".
- Logo: `Hanifa_woman_edition_1080_x_1300_px.png` (saved as `public/logo.png`, shown at 40×48).
- Fonts saved to `public/fonts/`: BDSans-Black/Bold/Regular, Helvetica-Light, Helvetica-Bold, Helvetica2 (Helvetica-Bold/2 currently unused). Outfit loaded via `next/font/google`. `AGaramond LT` (supplied by the owner, `AGaramondLT-Regular.woff2`) replaces BDSans-Black as `--font-display`.
- Catalog snapshot (US market, `country=US`): 138 products, 66 collections with ordering, Shopify "related" recommendations. **Note:** requests without `country=US` return localised prices/availability.
