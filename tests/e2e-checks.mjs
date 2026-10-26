// Automated route + interaction checks. Usage: node tests/e2e-checks.mjs [baseUrl]
// Requires: npm i -D playwright (browsers via `npx playwright install chromium`)
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.argv[2] ?? "http://localhost:3100";
const VPS = { desktop: [1440, 900], laptop: [1366, 768], tablet: [768, 1024], mobile: [390, 844], "small-mobile": [375, 667] };
const read = (f) => JSON.parse(fs.readFileSync(f, "utf8").replace(/^﻿/, ""));
const pages = read("data/pages.json").pages.map((p) => `/pages/${p.handle}`).filter((p) => !/shogun/.test(p));
const content = read("data/content.json");

const ALL = [
  "/", "/collections/dresses", "/collections/all", "/collections/sale", "/collections/bridal",
  "/products/jax-knit-maxi-dress", "/products/gift-card", "/search?q=dress", "/cart", "/account", "/blogs/news",
  ...content.articles.map((a) => `/blogs/news/${a.handle}`),
  ...Object.keys(content.policies).map((h) => `/policies/${h}`),
  ...pages,
];
const KEY = ["/", "/collections/dresses", "/products/jax-knit-maxi-dress", "/search?q=dress", "/pages/faqs"];
// The reference 404s on these too, so a 404 is the correct behaviour.
const EXPECT_404 = ["/pages/does-not-exist", "/collections/nope", "/products/nope", "/pages/careers", "/pages/bridal-faq"];

const results = [];
const fail = (msg) => results.push({ ok: false, msg });
const pass = (msg) => results.push({ ok: true, msg });
// `videoInfo is not defined` is thrown by the SproutVideo player script running in its own iframe.
const THIRD = /sproutvideo|klaviyo|google|facebook|shopify\.com\/storefront|videoInfo is not defined/i;

const browser = await chromium.launch();

async function checkRoute(ctx, vp, url, expectStatus = 200) {
  const page = await ctx.newPage();
  const errors = [];
  const failed = [];
  page.on("pageerror", (e) => !THIRD.test(`${e.stack ?? ""} ${e.message}`) && errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !THIRD.test(m.location().url ?? "") && errors.push(m.text()));
  page.on("response", (r) => {
    if (r.status() >= 400 && !THIRD.test(r.url()) && !r.url().endsWith(url)) failed.push(`${r.status()} ${r.url()}`);
  });
  const sep = url.includes("?") ? "&" : "?";
  const res = await page.goto(`${BASE}${url}${sep}nopopup`, { waitUntil: "networkidle", timeout: 90000 }).catch(() => null);
  const label = `${vp} ${url}`;
  if (!res || res.status() !== expectStatus) {
    fail(`${label}: status ${res?.status()} (expected ${expectStatus})`);
    await page.close();
    return;
  }
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) {
    await page.evaluate((yy) => scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(600);
  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => i.offsetParent !== null && i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc.slice(-60)),
  );
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  if (expectStatus === 200) {
    if (errors.length) fail(`${label}: console/page errors: ${[...new Set(errors)].slice(0, 2).join(" | ")}`);
    else if (failed.length) fail(`${label}: failed requests: ${failed.slice(0, 2).join(" | ")}`);
    else if (broken.length) fail(`${label}: broken images: ${broken.slice(0, 2).join(", ")}`);
    else if (overflow) fail(`${label}: horizontal overflow`);
    else pass(label);
  } else pass(`${label} -> ${expectStatus}`);
  await page.close();
}

for (const [vp, [w, h]] of Object.entries(VPS)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 800 });
  const routes = vp === "desktop" || vp === "mobile" ? ALL : KEY;
  for (const r of routes) await checkRoute(ctx, vp, r);
  if (vp === "desktop") for (const r of EXPECT_404) await checkRoute(ctx, vp, r, 404);
  await ctx.close();
}

async function interactions() {
  const T = (name, ok, extra = "") => (ok ? pass(`interaction: ${name}`) : fail(`interaction: ${name} ${extra}`));
  let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let p = await ctx.newPage();
  await p.goto(`${BASE}/`, { waitUntil: "networkidle" });

  await p.waitForSelector("[role=dialog][aria-label=Newsletter]", { timeout: 6000 }).then(() => T("newsletter popup appears", true)).catch(() => T("newsletter popup appears", false));
  await p.getByLabel("Close dialog").click().catch(() => {});
  T("newsletter popup closes", (await p.locator("[aria-label=Newsletter]").count()) === 0);

  await p.getByRole("button", { name: /^shop/i }).click();
  T("shop dropdown opens", await p.getByRole("link", { name: "SALE" }).isVisible());
  await p.mouse.click(700, 600);
  T("shop dropdown closes on outside click", !(await p.getByRole("link", { name: "SALE" }).isVisible().catch(() => false)));

  await p.getByRole("button", { name: "Search" }).click();
  await p.getByRole("textbox", { name: "Search" }).fill("jax");
  await p.keyboard.press("Enter");
  await p.waitForURL(/\/search\?q=jax/, { timeout: 15000 }).then(() => T("search submits to /search", true)).catch(() => T("search submits to /search", false));

  await p.goto(`${BASE}/collections/dresses?nopopup`, { waitUntil: "networkidle" });
  const count = () => p.locator("main ul li a[href^='/products/']").count();
  const n1 = await count();
  T("collection shows 24 per page", n1 === 24, `got ${n1}`);
  await p.getByRole("button", { name: /^Next/ }).click();
  await p.waitForTimeout(300);
  T("pagination next works", (await p.getByRole("button", { name: "2", exact: true }).getAttribute("aria-current")) === "page");
  await p.getByRole("button", { name: /sort/i }).click();
  await p.getByRole("button", { name: "Price, low to high" }).click();
  T("sort menu applies", true);
  await p.getByRole("button", { name: /filter/i }).click();
  T("filter drawer opens", await p.getByRole("button", { name: "Apply" }).isVisible());
  await p.getByRole("button", { name: "Apply" }).click();

  await p.goto(`${BASE}/products/jax-knit-maxi-dress?nopopup`, { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "M", exact: true }).click();
  T("size selectable", (await p.getByRole("button", { name: "M", exact: true }).getAttribute("aria-pressed")) === "true");
  await p.getByRole("button", { name: "City Hues" }).click();
  T("colour swatch selectable", (await p.getByRole("button", { name: "City Hues" }).getAttribute("aria-pressed")) === "true");
  await p.getByRole("button", { name: "Increase quantity" }).first().click();
  await p.getByRole("button", { name: /add to cart/i }).click();
  const drawer = p.getByRole("dialog", { name: "Cart" });
  T("add to cart opens drawer", await drawer.isVisible());
  const txt = await drawer.innerText();
  T("drawer shows item and qty 2", /city hues \/ m/i.test(txt) && /2 items/i.test(txt), txt.slice(0, 80));
  T("subtotal = 2 x 329", txt.includes("$658.00"));
  await drawer.getByRole("button", { name: "Decrease quantity" }).click();
  const txt2 = await drawer.innerText();
  T("drawer qty decrease", /1 item/i.test(txt2) && txt2.includes("$329.00"));
  await drawer.getByRole("button", { name: "Remove" }).click();
  T("drawer remove -> empty state", (await drawer.innerText()).includes("currently empty"));
  await drawer.getByRole("button", { name: "Close cart" }).click();
  T("drawer closes", (await drawer.count()) === 0);
  await p.getByRole("button", { name: /product details/i }).click();
  T("accordion opens", (await p.getByRole("button", { name: /product details/i }).getAttribute("aria-expanded")) === "true");
  await ctx.close();

  ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  p = await ctx.newPage();
  await p.goto(`${BASE}/?nopopup`, { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Open menu" }).click();
  T("mobile menu opens", await p.getByRole("button", { name: "Close menu" }).isVisible());
  await p.getByRole("button", { name: /^shop/i }).click();
  T("mobile menu group expands", await p.getByRole("link", { name: "Dresses" }).isVisible());
  await p.getByRole("button", { name: "Close menu" }).click();
  T("mobile menu closes", (await p.getByRole("button", { name: "Close menu" }).count()) === 0);
  await ctx.close();
}

await interactions().catch((e) => fail(`interaction suite crashed: ${e.message.split("\n")[0]}`));
await browser.close();

const bad = results.filter((r) => !r.ok);
console.log(`PASS ${results.length - bad.length} / ${results.length}`);
bad.forEach((r) => console.log("FAIL", r.msg));
process.exit(bad.length ? 1 : 0);
