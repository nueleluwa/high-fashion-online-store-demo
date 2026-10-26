# High Fashion Online Store Demo

A Next.js storefront demo that reproduces the look, layout and shopping behaviour of an existing high-fashion Shopify store as closely as possible, built as an exercise in **evidence-driven, pixel-level front-end replication**: audit the reference first, measure it, build to the measurements, then verify with automated screenshot diffs.

> **Read [NOTICE.md](NOTICE.md) first.** This is an independent demo, not affiliated with or endorsed by the store it reproduces. No brand fonts, logos, photography or scraped content are committed to this repository; they are fetched locally by scripts and only if you are authorised to use them.

- **Stack:** Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4
- **Pages:** home, 66 collections, 138 product pages, search, cart + drawer, content pages, policies, blog, real 404s
- **Verification:** 103 automated browser checks, a 224-route hydration/console sweep, and screenshot diffs against the live reference at five viewports (1440, 1366, 768, 390, 375)

## Quick start

```bash
npm install
npx playwright install chromium   # only needed for tests and visual tooling

npm run assets:fetch              # optional: download the reference's fonts + logo into public/ (see NOTICE.md)
npm run data:refresh              # required once: builds data/ from the public storefront (~10-20 min, rate-limited)

npm run dev                       # http://localhost:3000
```

Production build:

```bash
npm run build
npm start -- -p 3100
```

Without `assets:fetch` the site renders with fallback fonts and a missing header logo. Without `data:refresh` the build fails because `data/` is not committed.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Standard Next.js |
| `npm run lint` | ESLint (currently 0 errors, 0 warnings) |
| `npm run data:refresh` | Re-downloads catalog, collection order, recommendations, pages, policies and articles into `data/` (always uses `country=US`) |
| `npm run assets:fetch` | Downloads fonts and logo into `public/` |
| `npm run test:e2e` | 103 checks against `http://localhost:3100` (pass another URL as an argument) |
| `npm run test:sweep` | Loads all 224 product/collection/page/policy/article routes and fails on any console, hydration or failed same-origin request (default `http://localhost:3000`) |
| `npm run visual:capture` | Captures reference screenshots into `docs/screenshots/` |
| `npm run visual:compare '<json pages>' [viewports]` | Screenshots this app and diffs it against the reference captures (pixelmatch) |
| `npm run visual:anchors <path> <viewport> '<json anchors>'` | Compares element positions (x, y, width, font size) between reference and this app |

## How it was built

1. **Audit** the reference: routes from the sitemap and public JSON, screenshots at several viewports and scroll positions, interaction capture, computed-style probes. → [`docs/reference-audit.md`](docs/reference-audit.md), [`docs/route-inventory.md`](docs/route-inventory.md)
2. **Specify**: design tokens, components, interactions and responsive behaviour with measured values. → [`docs/design-system.md`](docs/design-system.md), [`docs/component-inventory.md`](docs/component-inventory.md), [`docs/interaction-specification.md`](docs/interaction-specification.md), [`docs/responsive-behaviour.md`](docs/responsive-behaviour.md)
3. **Plan** the implementation and backend options. → [`docs/implementation-plan.md`](docs/implementation-plan.md), [`docs/asset-manifest.md`](docs/asset-manifest.md)
4. **Build** shared components and page templates.
5. **Validate** with screenshot diffs, anchor probes and automated checks, fix the largest differences first, repeat. → [`docs/implementation-report.md`](docs/implementation-report.md)

See [`docs/README.md`](docs/README.md) for the full documentation index.

## Project layout

```
app/                  routes: /, collections/[handle], products/[handle], search, cart, account,
                      pages/[handle], policies/[handle], blogs/news[/handle]
components/
  layout/             SiteHeader (dropdowns, inline search, mobile drawer), SiteFooter
  commerce/           ProductCard, ProductGrid (filter/sort/pagination), ProductDetail, CartDrawer,
                      HomeCarousel, SearchResults, RelatedProducts
  common/             Icons, NewsletterPopup, ContactForm
lib/                  catalog (data layer), money (client-safe helpers), cart (external store),
                      content, nav, html (HTML balancing), shopify-loader (CDN image loader)
proxy.ts              returns real 404s for unknown handles (Cache Components streams 200s otherwise)
scripts/              data pipeline (scripts/data/*), asset fetcher, HTML balancing, known-routes generator
tests/                e2e-checks.mjs, sweep-all.mjs
tools/visual/         screenshot capture, pixel diff and anchor comparison tools
docs/                 audit, specs, plan, report
```

## Real vs simulated

| Area | Status |
|---|---|
| Catalog, prices, availability, collection order, recommendations, pages, policies, blog | Snapshot of the public storefront (US market), built into `data/` by `data:refresh`. **Static, not live.** |
| Images, video | Hotlinked from the reference's CDN / embeds (nothing bundled) |
| Cart | Simulated, stored in `localStorage`. No payments, accounts, orders or inventory. |
| Checkout button | Explicit demo alert |
| Newsletter, contact, subscribe forms | Client-side only; nothing is sent |
| Customer login | Informational placeholder |
| Search | Simple multi-term substring search (the reference's fuzzy index is not replicated) |

All data access goes through `lib/catalog.ts` and cart state through `lib/cart.tsx`, so a real backend can replace them without touching components. The recommended production path is the **Shopify Storefront API**; alternatives (BigCommerce, Medusa, Saleor) are compared in [`docs/implementation-plan.md`](docs/implementation-plan.md).

## Visual fidelity (initial viewport, % of pixels differing from the reference)

| Page | Desktop 1440 | Mobile 390 |
|---|---|---|
| Home | 0.1 | 8.9 |
| Collection | 0.1–1.3 | 1.8–2.2 |
| Product | 1.0 | 1.2 |
| FAQs | 0.2 | 7.4 |
| Privacy policy | 0.9 | 0.6 |
| Search | 11.0 | 19.7 |

Scores are diagnostic, not a claim of pixel perfection. Known deviations (search relevance, animated GIF frames, a few mobile offsets, estimated timings) are listed in [`docs/implementation-report.md`](docs/implementation-report.md).

## Gotchas worth knowing

- **Always request the reference with `country=US`.** Without it, geo-localised responses return converted prices and different variant availability.
- The storefront **rate-limits (HTTP 429)**; all scripts throttle and retry.
- Scraped Shopify HTML is often unbalanced; `lib/html.ts` balances it before injection (otherwise React hydration breaks).
- With Cache Components, `notFound()` inside a streamed page keeps HTTP 200, so `proxy.ts` handles true 404s from `data/known-routes.json`.
- Tailwind v4: unlayered CSS beats utilities, so custom classes live inside `@layer`.

## Before using anything like this in production

Confirm licensing for imagery, fonts and video; replace the snapshot with a live commerce backend; add real search and form handling; run cross-browser and accessibility audits. The full checklist is in the implementation report.
