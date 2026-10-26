# Implementation Plan

## Stack
Next.js (App Router) + TypeScript + Tailwind CSS (matches the reference's Tailwind approach). No other runtime deps except where needed. Fonts self-hosted from downloaded woff2 files in `public/fonts`.

## Data layer
- `data/catalog/products-all.json` and `collection-map.json` (downloaded from the public Storefront JSON; 138 published products, ~55 collections with order).
- `lib/catalog.ts` exposes `getProducts`, `getCollection`, `getProduct`, `search` — one module to swap for Shopify Storefront API later.
- Images: Shopify CDN URLs used remotely via `next/image` (`cdn.shopify.com`) — exact files the reference uses. See `asset-manifest.md`.

## Commerce (simulated)
- Cart in client state (React context + localStorage): add, qty, remove, subtotal. Checkout button is a clearly labelled demo (no payments, no accounts, no orders).
- Login routes to an informational placeholder (external Shopify auth is not replicable).

## Build order
1. Scaffold, tokens, fonts, layout (Header, Footer, dropdowns, search bar, mobile menu).
2. Home, Collection (+filter/sort), Product, Cart drawer.
3. Search, content pages, policies, blog, 404.
4. Playwright screenshot comparison vs `docs/screenshots`, pixel diff, fix loop.
5. Automated route/overflow/console checks; build.

## Features: real vs simulated
| Feature | Status |
|---|---|
| Product/collection data, images | Real public data (snapshot) |
| Cart | Simulated, client-side |
| Checkout, Shop Pay, accounts, newsletter, chat, video | Not connected / placeholder |

## Commerce backend / CMS options
The reference is already a Shopify store, and the data layer is isolated in `lib/catalog.ts` and `lib/cart`, so any of these can be plugged in behind it.

| Option | Fit | Notes |
|---|---|---|
| **Shopify Storefront API (headless) — recommended** | Best | Same catalog, variants, inventory, discounts, customer accounts, Shop Pay and checkout the reference already uses. Next.js calls the GraphQL Storefront API (cart via `cartCreate`/`cartLinesAdd`), and checkout redirects to Shopify's hosted checkout. Needs a custom-app Storefront access token. No data migration. |
| BigCommerce (headless) | Good | Storefront GraphQL + hosted checkout; requires catalog migration. |
| Medusa (self-hosted, open source) | Good if owning the stack | Full control, own checkout and payments (Stripe etc.); you build and host admin, payments, tax. |
| Saleor | Good | GraphQL, open source or cloud; similar migration cost to Medusa. |
| Commerce Layer / Swell / Crystallize | Possible | API-first; migration and checkout work needed. |
| WooCommerce (WPGraphQL) | Weak | Possible, but heavier and a poor fit for a Shopify-native catalog. |
| Hydrogen/Oxygen | Not needed | Shopify's own React framework; we are using Next.js instead. |

**Content CMS (optional, for editorial blocks)**: homepage hero/tiles, pages and the blog can live in Shopify metaobjects and pages (via the Storefront API) or a headless CMS such as Sanity, Contentful or Storyblok. Shopify-only keeps the client's existing admin workflow.

**Recommendation:** Shopify Storefront API, with the Shopify pages and metaobjects feeding the content blocks. It needs a Storefront token, a webhook to revalidate cached catalog data, and the store domain.
