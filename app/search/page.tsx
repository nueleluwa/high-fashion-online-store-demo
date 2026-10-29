import { Suspense } from "react";
import type { Metadata } from "next";
import SearchResults from "@/components/commerce/SearchResults";

export const metadata: Metadata = { title: "Search – SCHICK" };

export default function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  // Reading searchParams is request-time data, so it lives behind a Suspense boundary (Cache Components).
  return (
    <Suspense fallback={<h1 className="page-title px-[17px] pt-[17px]">Search</h1>}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}
