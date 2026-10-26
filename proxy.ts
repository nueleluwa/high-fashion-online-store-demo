import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import known from "@/data/known-routes.json";

// With Cache Components, notFound() inside a streamed page keeps a 200 status, so unknown handles
// are rejected here with a real 404 (rendered by app/not-found.tsx).
const SETS: [RegExp, Set<string>][] = [
  [/^\/products\/([^/]+)\/?$/, new Set(known.products)],
  [/^\/collections\/([^/]+)\/?$/, new Set([...known.collections, "all"])],
  [/^\/pages\/([^/]+)\/?$/, new Set(known.pages)],
  [/^\/policies\/([^/]+)\/?$/, new Set(known.policies)],
  [/^\/blogs\/news\/([^/]+)\/?$/, new Set(known.articles)],
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  for (const [re, handles] of SETS) {
    const m = pathname.match(re);
    if (m && !handles.has(decodeURIComponent(m[1]))) {
      return NextResponse.rewrite(new URL("/__not-found", request.url), { status: 404 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/collections/:path*", "/pages/:path*", "/policies/:path*", "/blogs/news/:path*"],
};
