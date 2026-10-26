// Rebuilds everything under data/ from the public storefront. Takes roughly 10-20 minutes because the
// storefront rate-limits (429) and every script throttles itself. Run from the project root: npm run data:refresh
import { spawnSync } from "node:child_process";

const steps = [
  "scripts/data/fetch-base.mjs", //          collection list + static pages
  "scripts/data/fetch-catalog-us.mjs", //    products (always country=US, otherwise prices/availability are localised)
  "scripts/data/fetch-map-us.mjs", //        collection membership + order
  "scripts/data/fetch-all-html.mjs", //      the "all" collection's real order (scraped from rendered pages)
  "scripts/data/fetch-recs.mjs", //          "related" recommendations per product
  "scripts/data/scrape-content.mjs", //      policies + article list
  "scripts/data/scrape-articles.mjs", //     article bodies, authors, dates
  "scripts/balance-html.mjs", //             strip unmatched closing tags from scraped HTML
  "scripts/build-known-routes.mjs", //       handle lists used by proxy.ts for real 404s
];

for (const step of steps) {
  console.log(`\n==> ${step}`);
  const r = spawnSync(process.execPath, [step], { stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`Step failed: ${step}`);
    process.exit(r.status ?? 1);
  }
}
console.log("\nData refreshed.");
