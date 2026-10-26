import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGrid from "@/components/commerce/ProductGrid";
import { getCollection, getCollections } from "@/lib/catalog";

export function generateStaticParams() {
  return [{ handle: "all" }, ...getCollections().map((c) => ({ handle: c.handle }))];
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const c = getCollection(handle);
  return { title: c ? `${c.title} – Hanifa` : "Not Found – Hanifa" };
}

// params are request-time data; awaiting them inside <Suspense> keeps the static shell instant.
export default function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <CollectionPageContent params={params} />
    </Suspense>
  );
}

async function CollectionPageContent({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) notFound();

  return (
    <div>
      <h1 className="page-title px-[9px] lg:px-[17px] pt-[17px] pb-[16px]">{collection.title}</h1>
      <ProductGrid products={collection.products} />
    </div>
  );
}
