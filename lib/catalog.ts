import products from "@/data/products-all.json";
import collectionMap from "@/data/collection-map.json";
import schick from "./schick-catalog.json";

export type Variant = {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  available: boolean;
  price: string;
  compare_at_price: string | null;
  featured_image: { src: string; width: number; height: number } | null;
};

export type Product = {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  tags: string[];
  options: { name: string; position: number; values: string[] }[];
  variants: Variant[];
  images: { id: number; src: string; width: number; height: number }[];
};

// SCHICK products imported from the WordPress export (scripts/import-wordpress.mjs) sit alongside the scraped catalog.
const all = [...(schick.products as unknown as Product[]), ...(products as unknown as Product[])];
const byHandle = new Map(all.map((p) => [p.handle, p]));
type CollectionEntry = { title: string; handles: string[] };
const collections: Record<string, CollectionEntry> = { ...(collectionMap as Record<string, CollectionEntry>), ...schick.collections };

export const getAllProducts = () => all;
export const getProduct = (handle: string) => byHandle.get(handle);

export function getCollections() {
  return Object.entries(collections).filter(([h]) => h !== "all").map(([handle, c]) => ({ handle, title: c.title, count: c.handles.length }));
}

export function getCollection(handle: string) {
  const c = collections[handle];
  if (!c) return undefined;
  return {
    handle,
    title: c.title,
    products: c.handles.map((h) => byHandle.get(h)).filter((p): p is Product => Boolean(p)),
  };
}

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").toLowerCase();
const haystack = new Map(all.map((p) => [p.handle, [p.title, p.tags.join(" "), p.variants.map((v) => v.title).join(" "), text(p.body_html)].join(" ").toLowerCase()]));

// Full-text-ish: every term must appear in title, tags, variant titles or description.
export function searchProducts(q: string) {
  const terms = q.trim().toLowerCase().split(/s+/).filter(Boolean);
  if (!terms.length) return [];
  return all.filter((p) => {
    const h = haystack.get(p.handle)!;
    return terms.every((t) => h.includes(t));
  });
}

export function colorSwatches(p: Product): { name: string; src: string }[] {
  const opt = p.options.find((o) => /colou?r/i.test(o.name));
  if (!opt) return [];
  return opt.values.map((name) => {
    const v = p.variants.find((x) => (opt.position === 1 ? x.option1 : x.option2) === name);
    return { name: name.trim(), src: v?.featured_image?.src ?? p.images[0]?.src ?? "" };
  });
}

export { compareAt, money, price } from "./money";

import recommendationMap from "@/data/recommendations.json";

const recs = recommendationMap as Record<string, string[]>;

// Shopify's "related" recommendations (snapshot); falls back to neighbours in the product's first collection.
export function getRecommendations(handle: string, n = 2): Product[] {
  const direct = (recs[handle] ?? []).map(getProduct).filter((p): p is Product => Boolean(p));
  if (direct.length >= n) return direct.slice(0, n);
  const owner = Object.values(collections).find((c) => c.handles.includes(handle));
  const fill = (owner?.handles ?? [])
    .filter((h) => h !== handle && !direct.some((d) => d.handle === h))
    .map(getProduct)
    .filter((p): p is Product => Boolean(p));
  return [...direct, ...fill].slice(0, n);
}
