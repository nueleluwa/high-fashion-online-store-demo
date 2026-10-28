// Generates data/known-routes.json (handles only) so proxy.ts can 404 unknown URLs without loading the full catalog.
import fs from "fs";
const read = (f) => JSON.parse(fs.readFileSync(f, "utf8").replace(/^\uFEFF/, ""));
const schick = read("lib/schick-catalog.json");
const products = [...schick.products, ...read("data/products-all.json")].map((p) => p.handle);
const collections = [...Object.keys(schick.collections), ...Object.keys(read("data/collection-map.json"))];
const pages = read("data/pages.json").pages.map((p) => p.handle).filter((h) => !/shogun/.test(h));
const content = read("data/content.json");
fs.writeFileSync(
  "data/known-routes.json",
  JSON.stringify({ products, collections, pages, policies: Object.keys(content.policies), articles: content.articles.map((a) => a.handle) }),
);
console.log("known routes written");
