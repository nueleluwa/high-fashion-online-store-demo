// Loads every product, collection, page, policy and article and reports console/hydration errors.
// Usage: node tests/sweep-all.mjs [baseUrl]   (works against dev or prod; dev gives full hydration messages)
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.argv[2] ?? "http://localhost:3000";
const known = JSON.parse(fs.readFileSync("data/known-routes.json", "utf8"));
const routes = [
  ...known.products.map((h) => `/products/${h}`),
  ...known.collections.map((h) => `/collections/${h}`),
  ...known.pages.map((h) => `/pages/${h}`),
  ...known.policies.map((h) => `/policies/${h}`),
  ...known.articles.map((h) => `/blogs/news/${h}`),
];
const THIRD = /sproutvideo|klaviyo|google|facebook|videoInfo is not defined/i;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const bad = [];
let done = 0;

async function worker(queue) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
  // Same-origin failures (404/500 for assets, RSC payloads, images) must not be hidden.
  page.on("response", (r) => r.status() >= 400 && r.url().startsWith(BASE) && !r.url().includes("/__nextjs") && errors.push(`HTTP ${r.status()} ${r.url().replace(BASE, "")}`));
  for (let r; (r = queue.shift()); ) {
    errors.length = 0;
    await page.goto(`${BASE}${r}?nopopup`, { waitUntil: "load", timeout: 120000 }).catch((e) => errors.push(`nav: ${e.message.split("\n")[0]}`));
    await page.waitForTimeout(500);
    const real = errors.filter((e) => !THIRD.test(e));
    if (real.length) bad.push(`${r}: ${real[0].replace(/\s+/g, " ").slice(0, 160)}`);
    if (++done % 25 === 0) console.log(`checked ${done}/${routes.length}`);
  }
  await page.close();
}

const queue = [...routes];
await Promise.all([worker(queue), worker(queue), worker(queue)]);
await browser.close();
console.log(`SWEEP ${routes.length - bad.length}/${routes.length} clean`);
bad.forEach((b) => console.log("BAD", b));
process.exit(bad.length ? 1 : 0);
