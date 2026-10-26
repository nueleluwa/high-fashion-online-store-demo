// Runs before `dev` and `build`. The scraped data (data/) is not committed, so a fresh clone or a CI/Vercel
// build generates it on first use. Subsequent runs skip this because data/ already exists.
//
//   FETCH_BRAND_ASSETS=1   also download the reference's fonts + logo into public/ (opt-in: third-party assets,
//                          only enable if you are authorised to use them; see NOTICE.md)
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const REQUIRED = [
  "data/products-all.json",
  "data/collection-map.json",
  "data/recommendations.json",
  "data/pages.json",
  "data/content.json",
  "data/known-routes.json",
];

function run(script) {
  const r = spawnSync(process.execPath, [script], { stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`\n${script} failed (exit ${r.status}).`);
    process.exit(r.status ?? 1);
  }
}

const missing = REQUIRED.filter((f) => !fs.existsSync(f));
if (missing.length) {
  console.log(`[ensure-data] missing: ${missing.join(", ")}`);
  console.log("[ensure-data] generating data from the public storefront (about 10-20 minutes, rate-limited)...");
  run("scripts/refresh-data.mjs");
} else {
  console.log("[ensure-data] data/ present, skipping refresh");
}

if (process.env.FETCH_BRAND_ASSETS === "1") {
  if (fs.existsSync("public/fonts/BDSans-Black.woff2") && fs.existsSync("public/logo.png")) {
    console.log("[ensure-data] brand assets present, skipping download");
  } else {
    console.log("[ensure-data] FETCH_BRAND_ASSETS=1 -> downloading fonts and logo");
    run("scripts/fetch-assets.mjs");
  }
} else if (!fs.existsSync("public/logo.png")) {
  console.log("[ensure-data] brand fonts/logo not installed (set FETCH_BRAND_ASSETS=1 to download them; see NOTICE.md)");
}
