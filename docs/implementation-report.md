# Implementation Report

Reference: https://hanifa.co/ · Implementation: Next.js 16.4 (App Router, Cache Components), React 19, TypeScript, Tailwind 4 · Audit/build date: 2026-10-26

## 1. Pages and routes implemented
| Route | Notes |
|---|---|
| `/` | Hero, auto-advancing "Just Restocked" carousel, two full-bleed editorial rows (desktop/mobile art), SproutVideo embeds |
| `/collections/[handle]` (66 + `all`) | Title, FILTER/SORT, 4-col (desktop) / 2-col (mobile) grid, 24/page pagination, desktop hover bar |
| `/products/[handle]` (138) | Gallery (stacked desktop / carousel mobile), colour + size selection, quantity, add to cart, accordions from product copy, "You may also like" |
| `/search` | Server-rendered; 3-col results with swatches, Articles/Pages sidebar, 12/page |
| `/cart`, cart drawer | Demo cart |
| `/pages/[handle]` (11) | about-us (+ "& More" imagery), faqs, sizing-chart, shipping-returns, store-policies, contact-us, subscribe, collections, campaign, our-story, the-hanifa-dream |
| `/policies/[handle]` (3) | privacy, terms, refund |
| `/blogs/news`, `/blogs/news/[handle]` | 6 articles |
| `/account` | Informational placeholder (Shopify-hosted auth on the reference) |
| 404 | Real 404 status via `proxy.ts` for unknown handles |

Deliberately **not** built: `/pages/careers`, `/pages/bridal-faq` (404 on the reference too), `/a/returns` (app proxy), checkout, Shopify customer-account screens.

## 2. Shared components
`SiteHeader` (sticky, click dropdowns, inline search bar, mobile drawer), `SiteFooter`, `CartDrawer`, `NewsletterPopup`, `ProductCard`, `ProductGrid` (filter drawer, sort menu, pagination), `ProductDetail`, `RelatedProducts`, `HomeCarousel`, `SearchResults`, `ContactForm`, `Icons`; `lib/catalog` (data), `lib/money` (client-safe helpers), `lib/cart` (external store), `lib/content`, `lib/nav`, `lib/shopify-loader` (CDN `?width=` image loader), `proxy.ts`.

## 3. Interactions implemented (all covered by `npm run test:e2e`)
Nav dropdown open/close (click, outside click, Esc), inline search → results, mobile drawer menu with expandable groups, newsletter popup show/close, collection sort, filter drawer (availability, price range, size), pagination, product colour/size/quantity, add to cart → drawer, quantity −/+, remove, empty state, subtotal, accordions, mobile gallery carousel with dots/arrows, home carousel (arrows, autoplay).

## 4. Assets
Original Shopify CDN files and original SproutVideo embeds are referenced directly (hero, editorial rows, product images, about-page imagery, logo, fonts). Fonts BDSans-Black/Bold/Regular and Helvetica-Light/Bold were downloaded to `public/fonts`; Outfit comes from `next/font/google`. Full mapping in `docs/asset-manifest.md`. **Missing/unverified:** licence confirmation for fonts and photography (assumed authorised per the brief); the PP Editorial New and Aegean faces load on the reference but no visible use was found, so they were not added.

## 5. Visual validation performed
Playwright screenshots of reference and implementation at identical viewports and states, pixel-diffed with pixelmatch (threshold 0.15) after every round; text/box positions also compared via anchor probes (e.g. PDP desktop matches to 0 px at every anchor). Evidence: `docs/screenshots/` (reference), `docs/screenshots-impl/`, `docs/screenshots-diff/`.

Initial-viewport diff, % of pixels differing (lower is closer):

| Page | Desktop 1440 | Mobile 390 |
|---|---|---|
| Home | 0.1 | 8.9 |
| Collection (dresses) | 1.3 | 2.2 |
| Collection (all) | 0.1 | 1.8 |
| Product (Jax gown) | 1.0 | 1.2 |
| Product (gift card) | 1.2 | 6.9 |
| FAQs | 0.2 | 7.4 |
| Privacy policy | 0.9 | 0.6 |
| Sizing chart | 1.6 | 4.4 |
| About us | 19.8 | 7.1 |
| Search | 11.0 | 19.7 |

Laptop 1366 / tablet 768 / small-mobile 375 (diffed before the last tablet-homepage fix, which changed the 750 px image breakpoint; the tablet homepage was re-measured by height only, 3038 px vs 3023 px, not re-diffed): home 0.8 / 8.9 (pre-fix) / 7.0; collection 1.8 / 1.1 / 2.3; product 1.3 / 0.2 / 0.8; FAQs 5.7 / 10.5 / 7.8. Full-page heights agree within about 0–5 px on the home, collection and product pages at desktop, and within ~15 px on the tablet homepage. These scores are diagnostic only; the remaining mobile differences are mostly sub-pixel text and icon placement.

Automated checks (`npm run test:e2e`): **103/103 passing** — every route at desktop and mobile (key routes also at laptop, tablet, small-mobile) for HTTP status, console errors, failed requests, broken images and horizontal overflow; five unknown URLs return 404 (82 route checks); 21 interaction checks. `npm run lint`: 0 errors, 0 warnings. `node tests/sweep-all.mjs` loads all 224 product, collection, page, policy and article routes and fails on any console, hydration or same-origin HTTP error: **224/224 clean**. `next build`: succeeds, 238 static pages.

## 6. Known deviations from the reference
- **Search relevance:** simple multi-term substring search (title, tags, variant names, copy). Shopify's fuzzy index returns 134 of 138 products for "dress"; ours returns 92. Result order differs, so search diffs are high (11% desktop / 20% mobile).
- **About page (19.8%):** the left image is an animated GIF; captures land on different frames.
- **Mobile pixel diffs of 5–9%** on home/FAQs/gift card are small layout offsets (icon positions, line wrapping), not missing sections. Mobile header icon sizes/spacing are still ~2 px off.
- **Carousel autoplay interval (5 s)** and **sort menu options** are estimates; the reference autoplays but the exact timing was not measured. The reference sort options were not captured (desktop sort/filter automation timed out), so Shopify's defaults were used.
- **Related products:** Shopify's recommendations are non-deterministic; the snapshot's first two are used, so the two cards can differ from a given live visit.
- **Klaviyo popup** is rebuilt from a screenshot (copy, size, colours estimated); its trigger timing and dismissal persistence are assumptions. Chat widget not replicated.
- **Filter drawer** colour swatch grid is not implemented (availability, price, size are). Price control is two inputs, not a range slider.
- **Gift card product** uses the standard product template; the reference's denomination/recipient fields were not captured.
- **Policy pages** at mobile use a 350 px column inferred from one measurement.
- **Subscribe page:** the reference embeds a Mailchimp form that posts to the client's live list. It is intentionally **not** rendered; the demo uses a local form that sends nothing. Hook this up to the real list only for production.
- **Raw Shopify HTML** (product copy, pages, articles) is often unbalanced; `lib/html.ts` balances it before injection, which fixed hydration errors on several products and all articles.
- **SproutVideo** third-party script logs `videoInfo is not defined` inside its iframe on the reference's own embed; the tests ignore that single message.

## 7. Simulated vs connected
| Feature | Status |
|---|---|
| Catalog, prices, availability, ordering, recommendations, pages, policies, blog | Real public data snapshot (US market, 2026-10-26) — **static, not live** |
| Images, fonts, video | Live from Shopify CDN / SproutVideo |
| Cart | Simulated (localStorage). No payments, accounts, orders or inventory changes |
| Checkout button | Explicit demo alert |
| Newsletter / contact / subscribe forms | Client-side only; nothing is sent (the reference's live Mailchimp embed is deliberately omitted) |
| Customer login | Placeholder page |

## 8. Commands
```bash
npm install
npx playwright install chromium     # once, for tests
npm run dev                         # http://localhost:3000
npm run build && npm start -- -p 3100
npm run test:e2e                    # against :3100
npm run lint
node scripts/build-known-routes.mjs # after changing catalog/pages data (feeds proxy.ts 404s)
node scripts/balance-html.mjs       # after re-scraping articles/policies
```
Catalog refresh: `npm run data:refresh` (scripts in `scripts/data/`; always uses `country=US`; Shopify rate-limits with 429).

## 9. Remaining before production
1. Confirm licensing for the reference's photography, fonts and video with the client.
2. Replace the snapshot with the **Shopify Storefront API** (catalog, cart via `cartCreate`/`cartLinesAdd`, hosted checkout, customer accounts via Shopify), plus webhook-driven revalidation and a Storefront token. See `docs/implementation-plan.md` for alternatives (BigCommerce, Medusa, Saleor).
3. Real search (Shopify predictive/search API or an index) and newsletter/contact backends (Klaviyo or similar).
4. Re-capture the reference's desktop filter/sort, mobile menu and empty-cart states (automation selectors timed out) and match them exactly; implement the colour-swatch filter and gift-card form.
5. Final mobile polish pass on the remaining 5–9% pages, cross-browser (Safari/Firefox) checks, accessibility audit, SEO (metadata, sitemap, canonicals, structured data), analytics and cookie consent.
