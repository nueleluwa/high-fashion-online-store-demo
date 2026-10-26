# Reference Audit — hanifa.co

Audit date: 2026-10-26. Method: Playwright (Chromium 1248) at 1440×900 and 390×844 (plus homepage at 1366×768, 768×1024, 375×667), public Shopify JSON endpoints, sitemaps, live computed-style probes. Raw evidence (screenshots, scraped dumps) is generated locally and not committed; see `docs/README.md`.

## Platform
- Shopify storefront, theme assets under `/cdn/shop/t/102/`. Tailwind utility classes + Alpine.js (`x-data="Theme_Header"`), sections are `shopify-section-*`.
- Homepage content is built from "AI generated" app blocks (`ai-responsive-image-*`, `ai-carousel-*`, `ai-embed-video-*`), not native theme sections.
- Third parties: Klaviyo (newsletter popup), a chat widget ("Chat with us", bottom-right), SproutVideo (homepage video), Shop Pay installments, Beam (1% donation line under Add to Cart), Shopify analytics.

## Visual identity
- White, minimal, image-led. Black text on white, edge-to-edge photography, no card borders or gutters in grids.
- Typography is two-voice: wide geometric uppercase **BDSans** for all navigation/headings/buttons; light **Helvetica-Light** for body, footer links, prices.
- Single accent: **SALE** in red in the Shop dropdown; struck-through compare-at prices in grey.
- Brand mark: a small script "H" logo, centred in header.

## Site structure
- Header (65px, white, sticky): left = SHOP / COLLECTIONS / THE BRAND (click-toggle dropdown bars), centre logo, right = account, search, cart icons.
- No announcement bar was present at audit time (none in DOM above header).
- Footer (161px tall at desktop): 4 columns — HANIFA MENU, HANIFA, LLC LEGAL, POLICIES, SOCIALS — then © line.

## Page templates observed
| Template | Example | Notes |
|---|---|---|
| Home | `/` | Hero image, "Just Restocked" carousel, two 50/50 editorial tiles, video embed, footer |
| Collection | `/collections/dresses` | Title, FILTER / SORT row, 4-col edge-to-edge grid (desktop), 2-col with titles+prices (mobile) |
| Product | `/products/jax-knit-maxi-dress` | Vertical gallery left (desktop) / carousel (mobile), sticky info panel, accordions |
| Search | `/search?q=dress` | Inline search bar under header; results page "135 results found" |
| Cart | right drawer + `/cart` | Drawer on add-to-cart |
| Content pages | `/pages/faqs`, `sizing-chart`, `shipping-returns`, `store-policies`, `the-hanifa-dream`, `about-us` | Centred BDSans title + rich text |
| Policies | `/policies/privacy-policy` etc. | Shopify policy template |
| Blog | `/blogs/news` ("Limitless by Hanifa") | 6 articles |
| Login | `/customer_authentication/redirect` | Shopify new customer accounts (external auth) |
| 404 | any bad URL | "404 Not Found – Hanifa" |

## Animations / transitions observed
- Dropdown bars: opacity fade 200 ms ease (Alpine `x-transition`), chevron rotates 180°.
- Cart drawer slides in from the right on add-to-cart; search bar expands inline under header.
- Homepage carousel with dots and prev/next arrows.

## Uncertain / inaccessible
- Desktop product-card hover: later verified as a white 68 px bar (title left, prices right) with no image swap; see `design-system.md` and `interaction-specification.md`.
- Homepage SproutVideo block does not render in headless Chromium (requests blocked/unsupported) — rendered as black gap; video source not publicly retrievable here.
- Klaviyo popup content captured (`interactions/desktop-newsletter-popup.png`); behaviour (delay, frequency) not verified.
- Customer accounts, checkout, Shop Pay, order flow: external Shopify services, not replicable.
- `/pages/bridal-faq` and `/pages/careers` return 404 although linked from the footer. `/a/returns` is an app-proxy page.
- Several interaction steps timed out in automation (filter/sort on desktop, size click, quantity plus, mobile menu button) — selectors need a second pass.
