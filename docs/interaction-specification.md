# Interaction Specification

Evidence: `docs/screenshots/interactions/`. "Observed" = seen in capture; "Assumed" = needs re-verification.

| Element | Initial | Action | Result | Dismissal / notes |
|---|---|---|---|---|
| Nav dropdown (desktop) | Closed, chevron down | Click SHOP / COLLECTIONS / THE BRAND | Full-width bar of links fades in under header (200ms), chevron up. Observed (`desktop-navigation-*-open.png`) | Click outside, focus leaves, or click again. Only one open (assumed) |
| Search | Icon in header | Click magnifier | Inline bar under header with magnifier, "SEARCH" input, X at right; page content stays. Observed | X closes; submit → `/search?q=` |
| Cart icon | "0 items" link | Click | Drawer opens on right (stays on `/`). Observed | X closes |
| Add to cart | Button black "ADD TO CART" | Click with colour+size selected | Cart drawer slides in on the right with line item; URL updates `?variant=<id>`. Observed | Drawer X |
| Cart qty − / + | 1 | Click | Qty changes, subtotal updates. Observed UI; behaviour assumed | min 1; 0 → remove |
| Cart Remove | Link under qty | Click | Line removed; empty state (to capture) | — |
| Cart totals | "Subtotal $329.00 USD" | — | "Taxes and shipping calculated at checkout"; CHECK OUT → Shopify checkout (external) | **Not replicable**: simulated |
| Colour swatch | First colour selected | Click | Selected outline, "Color: X" label updates, gallery jumps to variant image (assumed) | — |
| Size button | Default first available size selected (S selected, XS struck out) | Click | Boxed selection | Unavailable disabled |
| Quantity | 1 | − / + | Number updates, min 1 | — |
| Accordion (PDP) | All closed | Click title | Expands, text below (Product Details list observed) | Click again |
| Filter | Closed | Click FILTER | Left drawer with Availability, Price slider, Colour grid, Size radios, APPLY; page dimmed | X, Apply. Observed on mobile; desktop assumed same |
| Sort | Closed | Click SORT | Menu (options: Featured, Best selling, A–Z, Z–A, Price low/high, Date — Shopify defaults, assumed) | — |
| Newsletter popup | Appears ~on load, covers hero | Close X or submit | Dismisses. Observed (`desktop-newsletter-popup.png`) | Persistence assumed via cookie |
| Mobile menu | Hamburger | Tap | Drawer (to capture) | — |
| Product card hover | — | Hover | Hover bar fades in (verified, see additions below) | — |
| Gallery (mobile) | Slide 1, dots | Swipe / arrows | Next image, dots update | — |
| Loading / error states | — | — | Not observed; use sensible defaults | — |

---
## Verified additions (after implementation diffing)
- **Desktop product card hover**: a white 68px bar fades in at the bottom of the image (title left, prices right). No second-image swap.
- **Collection pagination**: 24 per page, numbered links + `NEXT →`; search paginates at 12 with `1 2 3 … 12`.
- **Home carousel**: auto-advances (observed different slide/dot between captures; the 5s interval is an estimate), prev/next round buttons, 5 dots.
- **Search**: opens as an inline bar under the header; results page has its own input, 3-col grid with swatches, and Articles/Pages sidebar.
- **PDP**: single-image products (gift card) have no dots/arrows; below the gallery there is "YOU MAY ALSO LIKE" (2 products).
- **Newsletter popup (Klaviyo)**: appears shortly after load over the hero; implemented with `?nopopup` bypass for automated comparisons.
- **Not replicable / simulated**: checkout, Shop Pay, customer accounts, newsletter submission, chat widget.
