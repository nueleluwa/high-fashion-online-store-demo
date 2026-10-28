// Converts a WooCommerce/WordPress WXR export into lib/schick-catalog.json (committed, so builds don't need the XML).
//   node scripts/import-wordpress.mjs [path/to/export.xml]
// Product categories become collections; variable products get one variant per attribute value.
import fs from "node:fs";

const file = process.argv[2] ?? fs.readdirSync(".").find((f) => /^theschickreadingparty.*\.xml$/.test(f));
if (!file) throw new Error("No WordPress export XML found");
const xml = fs.readFileSync(file, "utf8");

const cd = (s = "") => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
// The export contains U+FFFD where curly quotes/dashes were lost; restore the likely character.
const fix = (s) => s.replace(/(\w)\uFFFD(\w)/g, "$1\u2019$2").replace(/\s\uFFFD\s/g, " \u2013 ").replace(/\uFFFD/g, "");
const tag = (it, t) => cd(it.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`))?.[1] ?? "").trim();
const entities = (s) => s.replace(/&amp;/g, "&").replace(/&#038;/g, "&").replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const items = xml.split("<item>").slice(1);
const metaOf = (it) =>
  Object.fromEntries([...it.matchAll(/<wp:meta_key>([\s\S]*?)<\/wp:meta_key>\s*<wp:meta_value>([\s\S]*?)<\/wp:meta_value>/g)].map((m) => [cd(m[1]).trim(), cd(m[2])]));

const attachments = {};
for (const it of items) {
  if (tag(it, "wp:post_type") !== "attachment") continue;
  const m = metaOf(it)._wp_attachment_metadata ?? "";
  const dim = m.match(/s:5:"width";i:(\d+);s:6:"height";i:(\d+)/);
  attachments[tag(it, "wp:post_id")] = { src: tag(it, "wp:attachment_url"), width: dim ? +dim[1] : 1000, height: dim ? +dim[2] : 1000 };
}

const paragraphs = (s) => s.replace(/&/g, "&amp;").split(/\n{2,}/).map((p) => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`).join("\n");
const catalog = { products: [], collections: {} };

for (const it of items) {
  if (tag(it, "wp:post_type") !== "product" || tag(it, "wp:status") !== "publish") continue;
  const m = metaOf(it);
  const postId = +tag(it, "wp:post_id");
  const handle = tag(it, "wp:post_name");
  const title = fix(entities(tag(it, "title")));
  const body = fix(entities(tag(it, "content:encoded") || tag(it, "excerpt:encoded")));
  const price = String(Number(m._price || m._regular_price || 0).toFixed(2));
  const regular = Number(m._regular_price || 0);
  const compare = regular > Number(price) ? regular.toFixed(2) : null;
  const thumb = attachments[m._thumbnail_id];
  const image = thumb && { id: +m._thumbnail_id, src: thumb.src, width: thumb.width, height: thumb.height };
  const inStock = m._stock_status !== "outofstock";

  const attr = Object.values(m._product_attributes ? parsePhpAttrs(m._product_attributes) : {})[0];
  const values = attr ? attr.value.split("|").map((v) => v.trim()).filter(Boolean) : [];
  const id = 9_000_000 + postId;
  const mk = (i, label) => ({
    id: id * 100 + i,
    title: label ?? "Default Title",
    option1: label,
    option2: null,
    available: inStock,
    price,
    compare_at_price: compare,
    sku: m._sku || null,
    featured_image: image ?? null,
  });

  catalog.products.push({
    id,
    title,
    handle,
    body_html: paragraphs(body),
    vendor: "SCHICK",
    published_at: tag(it, "wp:post_date_gmt").replace(" ", "T") + "Z",
    tags: [],
    options: values.length ? [{ name: attr.name, position: 1, values }] : [{ name: "Title", position: 1, values: ["Default Title"] }],
    variants: values.length ? values.map((v, i) => mk(i + 1, v)) : [mk(1, null)],
    images: image ? [image] : [],
    sku: m._sku || null,
  });

  for (const [, nice, name] of it.matchAll(/<category domain="product_cat" nicename="([^"]+)">([\s\S]*?)<\/category>/g)) {
    (catalog.collections[nice] ??= { title: fix(entities(cd(name))), handles: [] }).handles.push(handle);
  }
}

// Magazines newest issue first; everything else keeps export order.
const sku = (h) => catalog.products.find((p) => p.handle === h)?.sku ?? "";
catalog.collections.magazines?.handles.sort((a, b) => parseInt(sku(b), 10) - parseInt(sku(a), 10));

fs.writeFileSync("lib/schick-catalog.json", JSON.stringify(catalog, null, 2) + "\n");
console.log(`${catalog.products.length} products -> lib/schick-catalog.json`);
for (const [h, c] of Object.entries(catalog.collections)) console.log(`  ${h}: ${c.handles.length}`);

// Minimal reader for WooCommerce's serialized _product_attributes (name/value strings only).
function parsePhpAttrs(s) {
  const out = {};
  for (const m of s.matchAll(/s:\d+:"name";s:\d+:"([^"]*)";s:\d+:"value";s:\d+:"([^"]*)"/g)) out[m[1]] = { name: m[1], value: m[2] };
  return out;
}
