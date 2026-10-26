import Image from "next/image";
import Link from "next/link";
import { colorSwatches, searchProducts, type Product } from "@/lib/catalog";
import { compareAt, money, price } from "@/lib/money";
import { searchContent } from "@/lib/content";
import { SearchIcon } from "@/components/common/Icons";

const PAGE_SIZE = 12;

function ResultCard({ p, priority }: { p: Product; priority: boolean }) {
  const img = p.images[0];
  const cmp = compareAt(p);
  const now = price(p);
  return (
    <Link href={`/products/${p.handle}`} className="block">
      <div className="relative aspect-[4/5] bg-[#f0f0f0]">
        {img && <Image src={img.src} alt={p.title} width={img.width} height={img.height} sizes="(min-width:1024px) 25vw, 50vw" priority={priority} className="absolute inset-0 h-full w-full object-cover object-top" />}
      </div>
      <div className="flex justify-between px-[9px] lg:px-[17px] pt-[17px] leading-[12px]">
        <span>{p.title}</span>
        <span className="text-right">
          {cmp > now && <span className="mr-1 line-through">{money(cmp)}</span>}
          <span className="text-gray-500">{money(now)}</span>
        </span>
      </div>
      <div className="flex gap-[10px] px-[9px] lg:px-[17px] pb-[17px] pt-[12px]">
        {colorSwatches(p).map((s) => (
          <Image key={s.name} src={s.src} alt={s.name} width={42} height={52} className="h-[21px] w-[21px] object-cover" />
        ))}
      </div>
    </Link>
  );
}

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, 2, 3, total, current]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

export default async function SearchResults({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q = "", page = "1" } = await searchParams;
  const products = searchProducts(q);
  const { articles, pages } = searchContent(q);
  const total = products.length + articles.length + pages.length;
  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, Number(page) || 1), pageCount);
  const visible = products.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const href = (n: number) => `/search?q=${encodeURIComponent(q)}&page=${n}`;

  return (
    <div>
      <h1 className="page-title px-[9px] lg:px-[17px] pb-[20px] pt-[9px]">{q ? `${total} results for “${q}”` : "Search"}</h1>
      <form action="/search" className="flex items-center gap-4 border-b border-black px-[9px] lg:px-[17px] pb-[18px]">
        <SearchIcon size={26} />
        <input name="q" defaultValue={q} aria-label="Search" className="h-[28px] flex-1 border border-transparent bg-transparent px-1 text-[12px] outline-none focus:border-[#5a1f3d]" />
      </form>

      <div className="lg:grid lg:grid-cols-[3fr_1fr]">
        <ul className="grid grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <li key={p.id}>
              <ResultCard p={p} priority={i < 3} />
            </li>
          ))}
        </ul>
        <aside className="px-[9px] lg:px-[17px] pt-[17px]">
          {articles.length > 0 && (
            <section className="mb-[30px]">
              <h2 className="page-title mb-[20px]">Articles</h2>
              {articles.slice(0, 3).map((a) => (
                <Link key={a.handle} href={`/blogs/news/${a.handle}`} className="flex gap-[17px]">
                  {a.image && (
                    <span className="relative h-[40px] w-[40px] shrink-0">
                      <Image src={a.image.replace(/[?&]width=\d+/, "")} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                  )}
                  <span>
                    <span className="page-title block leading-[15px]">{a.title}</span>
                    <span className="mt-1 block">{new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</span>
                  </span>
                </Link>
              ))}
            </section>
          )}
          {pages.length > 0 && (
            <section>
              <h2 className="page-title mb-[20px]">Pages</h2>
              {pages.slice(0, 3).map((p) => (
                <Link key={p.handle} href={`/pages/${p.handle}`} className="mb-4 block">
                  <span className="page-title block">{p.title}</span>
                  <span className="block leading-[10px]">{p.snippet}…</span>
                </Link>
              ))}
            </section>
          )}
        </aside>
      </div>

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="relative flex items-center justify-center px-[9px] lg:px-[17px] py-[10px] text-[17px] leading-[17px]">
          <ul className="flex gap-[2px]">
            {pageList(current, pageCount).map((n, i) => (
              <li key={`${n}-${i}`}>
                {n === "…" ? (
                  <span className="px-[8.5px] py-[4.25px]">…</span>
                ) : (
                  <Link href={href(n)} aria-current={n === current ? "page" : undefined} className={`inline-block px-[8.5px] py-[4.25px] ${n === current ? "border-b border-black" : ""}`}>
                    {n}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          {current < pageCount && (
            <Link href={href(current + 1)} className="absolute right-[17px] border-b border-black pb-[4.25px] uppercase">
              Next →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
