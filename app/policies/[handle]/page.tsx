import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { balanceHtml } from "@/lib/html";
import { getPolicy, getPolicyHandles } from "@/lib/content";

export function generateStaticParams() {
  return getPolicyHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = getPolicy(handle);
  return { title: p ? `${p.title} – Hanifa` : "Not Found – Hanifa" };
}

// params are request-time data; awaiting them inside <Suspense> keeps the static shell instant.
export default function PolicyPage({ params }: { params: Promise<{ handle: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <PolicyPageContent params={params} />
    </Suspense>
  );
}

async function PolicyPageContent({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const policy = getPolicy(handle);
  if (!policy) notFound();
  return (
    <div className="mx-auto max-w-[394px] px-[20px] pb-[17px] lg:px-0">
      <h1 className="nav-label text-center">{policy.title}</h1>
      <div className="rte policy-body [&_p]:text-[12px] [&_p]:leading-[12px]" dangerouslySetInnerHTML={{ __html: balanceHtml(policy.html) }} />
    </div>
  );
}
