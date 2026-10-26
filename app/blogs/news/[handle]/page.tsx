import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { balanceHtml } from "@/lib/html";
import { getArticle, getArticles } from "@/lib/content";

export function generateStaticParams() {
  return getArticles().map((a) => ({ handle: a.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const a = getArticle(handle);
  return { title: a ? `${a.title} – Hanifa` : "Not Found – Hanifa" };
}

// params are request-time data; awaiting them inside <Suspense> keeps the static shell instant.
export default function ArticlePage({ params }: { params: Promise<{ handle: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ArticlePageContent params={params} />
    </Suspense>
  );
}

async function ArticlePageContent({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const a = getArticle(handle);
  if (!a) notFound();
  return (
    <article className="mx-auto max-w-[800px] px-[17px] pb-12 pt-[17px]">
      <h1 className="page-title leading-[20px]">{a.title}</h1>
      <p className="py-4 text-[12px]">
        by {a.author} · {new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
      </p>
      <div suppressHydrationWarning className="rte [&_img]:h-auto [&_img]:max-w-full" dangerouslySetInnerHTML={{ __html: balanceHtml(a.html) }} />
    </article>
  );
}
