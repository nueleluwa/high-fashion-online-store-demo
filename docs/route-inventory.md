# Route Inventory

Source: `sitemap.xml` (139 products, 66 collections, 12 pages, 1 blog, 6 articles) and live header/footer link crawl.

| Route | Page type | Main sections | Shared components | Interactive elements |
|---|---|---|---|---|
| `/` | Home | Hero image, "Just Restocked" product carousel (+View all), Best Sellers 50/50 tile, Ready to Ship 50/50 tile, video embed | Header, Footer, NewsletterPopup | Carousel arrows/dots, popup, nav dropdowns |
| `/collections/[handle]` (66; ~55 with products) | Collection | Title, FILTER/SORT row, product grid | Header, Footer, ProductCard, FilterDrawer | Filter (availability, price, colour, size), sort, card hover |
| `/collections/all` | Collection | All 520 variants-listing products | same | same |
| `/pages/collections` | Content | Collection index | Header, Footer | links |
| `/products/[handle]` (139) | Product | Gallery, title, price, colour swatches, size buttons, qty, Add to Cart, Shop Pay/Beam notes, description, accordions (Product Details, Size and Fit, Fabric Care, Size Chart) | Header, Footer, CartDrawer | Gallery, swatches, sizes, qty, ATC, accordions |
| `/products/gift-card` | Product (gift card) | Denomination + recipient form | same | amount select |
| `/search?q=` | Search | Inline search bar, results grid ("N results found") | Header, Footer, ProductCard | Search input, clear |
| `/cart` | Cart | Cart page (drawer is primary) | Header, Footer | qty, remove |
| `/pages/about-us` | Content | "For women without limits" text | Header, Footer | — |
| `/pages/our-story` | Content | Title only (empty body at audit time) | Header, Footer | — |
| `/pages/the-hanifa-dream` | Content | Editorial long page | Header, Footer | — |
| `/pages/campaign` | Content | Title only | Header, Footer | — |
| `/pages/contact-us` | Content | Contact form | Header, Footer | form |
| `/pages/sizing-chart` | Content | Fit guide table (XS–3X: dress size, bust, waist, hips) | Header, Footer | — |
| `/pages/faqs` | Content | FAQ accordion/text | Header, Footer | accordion |
| `/pages/shipping-returns` | Content | Shipping policy | Header, Footer | — |
| `/pages/store-policies` | Content | Policy text | Header, Footer | — |
| `/pages/subscribe` | Content | Newsletter signup | Header, Footer | form |
| `/policies/privacy-policy`, `/terms-of-service`, `/refund-policy` | Policy | Policy text | Header, Footer | — |
| `/blogs/news` | Blog index | "Limitless by Hanifa", 6 articles | Header, Footer | article links |
| `/customer_authentication/redirect` | Auth | External Shopify sign-in | — | **Not replicable** (external) |
| `/pages/bridal-faq`, `/pages/careers` | — | 404 on reference | — | Documented, not built |
| `/a/returns` | App proxy | Returns portal | — | **Not replicable** |
| `/pages/shogun-imported-homepage` | Internal | Legacy builder page | — | Not customer-facing |

Header nav: SHOP → SALE, New, Just Restocked, Ready to Ship, Coats, Tops, Bottoms (`pants`), Dresses, Jumpsuits, Knitwear, Jewelry, Footwear, Gift Card. COLLECTIONS → FW25, Resort '25, SS25 Drop 2, SS25 Drop 1, Handbags, Bridal. THE BRAND → About, Hanifa Dream.
Footer: Search, Size Chart, Returns, Careers, Contact Us | Privacy, Terms | Refund, Shipping, Store Policies, FAQs, Bridal FAQ | socials (Twitter, Instagram, TikTok, YouTube).
