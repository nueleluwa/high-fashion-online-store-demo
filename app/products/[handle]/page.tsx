import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/commerce/ProductDetail";
import { balanceHtml } from "@/lib/html";
import RelatedProducts from "@/components/commerce/RelatedProducts";
import { getAllProducts, getProduct, getRecommendations } from "@/lib/catalog";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = getProduct(handle);
  return { title: p ? `${p.title} – SCHICK` : "Not Found – SCHICK" };
}

// Product copy is authored as `intro` + <h2> sections, which the reference renders as accordions.
function split(html: string) {
  const clean = html.replace(/ style="[^"]*"/g, "").replace(/<p>(\s|&nbsp;|<br>)*<\/p>/g, "").replace(/<ul><\/ul>/g, "");
  const [intro, ...rest] = clean.split(/<h2[^>]*>/i);
  const sections = rest
    .map((chunk) => {
      const [title, ...body] = chunk.split(/<\/h2>/i);
      return { title: title.replace(/<[^>]+>/g, "").trim(), html: body.join("").trim() };
    })
    .filter((s) => s.title && s.html);
  return { intro: balanceHtml(intro.trim()), sections: sections.map((s) => ({ ...s, html: balanceHtml(s.html) })) };
}

// params are request-time data; awaiting them inside <Suspense> keeps the static shell instant.
export default function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}

async function ProductPageContent({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();
  const { intro, sections } = split(product.body_html);
  return (
    <>
      <ProductDetail product={product} intro={intro} sections={sections} />
      <RelatedProducts products={getRecommendations(product.handle)} />
    </>
  );
}
