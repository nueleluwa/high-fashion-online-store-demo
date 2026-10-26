# Documentation index

The documents follow the order of the work: observe, specify, plan, build, verify. Separate **evidence** (what the reference does) from **specification** (what we decided to build) from **implementation** (what exists).

| Document | Purpose |
|---|---|
| [reference-audit.md](reference-audit.md) | Platform, visual identity, site structure, page templates, animations, and what could not be verified |
| [route-inventory.md](route-inventory.md) | Every discovered route with page type, sections, shared components and interactions; routes that 404 on the reference |
| [design-system.md](design-system.md) | Fonts, type scale, colours, layout, breakpoints, buttons, motion. The final "Measured values" section supersedes the estimates above it |
| [component-inventory.md](component-inventory.md) | Each reusable component: appearance, dimensions, responsive behaviour, states |
| [interaction-specification.md](interaction-specification.md) | Initial state, action, result and dismissal for each interactive element, plus verified additions |
| [responsive-behaviour.md](responsive-behaviour.md) | Desktop vs mobile differences and the breakpoints found (1024 px nav/footer, 750 px home imagery) |
| [implementation-plan.md](implementation-plan.md) | Stack, data layer, simulated commerce, build order, and the **ecommerce backend / CMS options** (Shopify Storefront API recommended) |
| [asset-manifest.md](asset-manifest.md) | Which reference assets are used where (images, video embeds, fonts, logo) and how they are loaded |
| [implementation-report.md](implementation-report.md) | Final report: routes, components, interactions, validation results, deviations, simulated vs connected, commands, remaining work |

## Evidence that is not committed
Screenshots (`docs/screenshots/`, `-impl/`, `-diff/`) and raw audit dumps (`docs/data/`) are third-party material and are ignored by git (see [../NOTICE.md](../NOTICE.md)). The documents above cite them by name; regenerate them locally:

```bash
npm run visual:capture                                  # reference screenshots (desktop + mobile)
npm run visual:compare '[["homepage","/"]]' desktop     # implementation screenshots + pixel diff
npm run visual:anchors /products/jax-knit-maxi-dress desktop '[["h1","^jax knit gown$"]]'
```

`visual:compare` expects the app to be running on port 3100 (`npm run build && npm start -- -p 3100`). Screenshot filenames follow `<page>-<state>.png` (for example `homepage-initial.png`, `product-jax-gown-full.png`) under a folder per viewport, with interaction captures under `interactions/`.

## Methodology in one paragraph
Reference measurements come from live computed styles and bounding boxes (Playwright), not from eyeballing. After each build round the app is screenshotted at the same viewport and state, pixel-diffed, and element positions are compared with the anchor probe; the largest and most visible differences are fixed first. Automated checks (`tests/`) then cover routes, overflow, broken images, console and hydration errors, and the main interactions.
