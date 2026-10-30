import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getCollections } from "@/lib/catalog";
import { getPage, getPageHandles } from "@/lib/content";
import { balanceHtml } from "@/lib/html";
import ContactForm from "@/components/common/ContactForm";

// Page-level sections that the reference stores outside the page body.
const FILES = "https://hanifa.co/cdn/shop/files/";
const PAGE_EXTRAS: Record<string, { heading: string; images: string[] }> = {
  "about-us": { heading: "& More", images: ["leah---website.gif", "HANIFA0194_copy.jpg"] },
};

// Pages switched off for now; they 404 until removed from this list.
const DISABLED_PAGES = new Set(["about-us"]);

export function generateStaticParams() {
  return getPageHandles().filter((handle) => !DISABLED_PAGES.has(handle)).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = getPage(handle);
  return { title: p ? `${p.title} – SCHICK` : "Not Found – SCHICK" };
}

// params are request-time data; awaiting them inside <Suspense> keeps the static shell instant.
export default function ContentPage({ params }: { params: Promise<{ handle: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ContentPageContent params={params} />
    </Suspense>
  );
}

async function ContentPageContent({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const page = getPage(handle);
  // Shogun-built pages have no usable body; `shogun-imported-homepage` is not customer-facing.
  if (!page || handle === "shogun-imported-homepage" || DISABLED_PAGES.has(handle)) notFound();

  const extras = PAGE_EXTRAS[handle];
  return (
    <div>
      <div className="mx-auto max-w-[703px] px-[9px] pb-[17px] pt-[8px] lg:px-0">
        <h1 className="page-title text-center">{page.title}</h1>
        {handle === "collections" ? (
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-[14px] lg:grid-cols-3">
            {getCollections().filter((c) => c.count > 0).map((c) => (
              <li key={c.handle}><Link className="underline" href={`/collections/${c.handle}`}>{c.title}</Link></li>
            ))}
          </ul>
        ) : handle === "subscribe" ? null : (
          // `subscribe` embeds a Mailchimp form that posts to the client's live list; the demo uses a local form instead.
          <div className="rte mt-[17px]" dangerouslySetInnerHTML={{ __html: balanceHtml(page.body_html) }} />
        )}
        {(handle === "contact-us" || handle === "subscribe") && <ContactForm kind={handle} />}
      </div>
      {extras && (
        <>
          <h2 className="page-title px-[17px] pb-[17px] pt-[14px] text-center">{extras.heading}</h2>
          <div className="grid lg:grid-cols-2">
            {extras.images.map((src) => (
              <div key={src} className="relative aspect-square">
                <Image src={FILES + src} alt="" fill unoptimized={src.endsWith(".gif")} sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
