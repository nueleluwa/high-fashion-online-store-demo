"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { ChevronDown, CloseIcon } from "@/components/common/Icons";
import { price } from "@/lib/money";
import { type Product } from "@/lib/catalog";

type Sort = "manual" | "best" | "title-asc" | "title-desc" | "price-asc" | "price-desc";
const SORTS: { v: Sort; label: string }[] = [
  { v: "manual", label: "Featured" },
  { v: "title-asc", label: "Alphabetically, A-Z" },
  { v: "title-desc", label: "Alphabetically, Z-A" },
  { v: "price-asc", label: "Price, low to high" },
  { v: "price-desc", label: "Price, high to low" },
];

const sizeOf = (p: Product) => p.variants.map((v) => (p.options[0]?.name.toLowerCase().includes("size") ? v.option1 : v.option2)?.trim()).filter(Boolean) as string[];

export default function ProductGrid({ products }: { products: Product[] }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("manual");
  const [avail, setAvail] = useState<"" | "in" | "out">("");
  const [size, setSize] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 24;

  const sizes = useMemo(() => [...new Set(products.flatMap(sizeOf))], [products]);
  const maxPrice = useMemo(() => Math.max(0, ...products.map(price)), [products]);

  const list = useMemo(() => {
    let l = products.filter((p) => {
      if (avail === "in" && !p.variants.some((v) => v.available)) return false;
      if (avail === "out" && p.variants.some((v) => v.available)) return false;
      if (size && !p.variants.some((v) => v.available && sizeOf({ ...p, variants: [v] }).includes(size))) return false;
      if (from && price(p) < Number(from)) return false;
      if (to && price(p) > Number(to)) return false;
      return true;
    });
    if (sort === "title-asc") l = [...l].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "title-desc") l = [...l].sort((a, b) => b.title.localeCompare(a.title));
    if (sort === "price-asc") l = [...l].sort((a, b) => price(a) - price(b));
    if (sort === "price-desc") l = [...l].sort((a, b) => price(b) - price(a));
    return l;
  }, [products, avail, size, from, to, sort]);

  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const go = (n: number) => {
    setPage(n);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <div className="relative flex items-center justify-between px-[9px] lg:px-[17px] pb-[17px] pt-[10px]">
        <button className="nav-label inline-flex items-center gap-1" onClick={() => setFilterOpen(true)} aria-expanded={filterOpen}>
          Filter <ChevronDown />
        </button>
        <div className="relative">
          <button className="nav-label inline-flex items-center gap-1" onClick={() => setSortOpen((v) => !v)} aria-expanded={sortOpen}>
            Sort <ChevronDown />
          </button>
          {sortOpen && (
            <ul className="fade-in absolute right-0 top-full z-20 w-[220px] border border-gray-200 bg-white py-2 text-left">
              {SORTS.map((s) => (
                <li key={s.v}>
                  <button
                    className={`block w-full px-4 py-2 text-left text-[12px] ${sort === s.v ? "underline" : ""}`}
                    onClick={() => {
                      setSort(s.v);
                      setSortOpen(false);
                    }}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="px-[9px] lg:px-[17px] py-16 text-center text-[14px]">No products match these filters.</p>
      ) : (
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {visible.map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}
      {pages > 1 && (
        <nav aria-label="Pagination" className="relative flex items-center justify-center px-[9px] lg:px-[17px] py-[10px] text-[17px] leading-[17px]">
          <ul className="flex gap-[2px]">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                <button
                  aria-current={n === current ? "page" : undefined}
                  className={`px-[8.5px] py-[4.25px] ${n === current ? "border-b border-black" : ""}`}
                  onClick={() => go(n)}
                >
                  {n}
                </button>
              </li>
            ))}
          </ul>
          {current < pages && (
            <button className="absolute right-[17px] border-b border-black pb-[4.25px] uppercase" onClick={() => go(current + 1)}>
              Next →
            </button>
          )}
        </nav>
      )}

      {filterOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fade-in absolute inset-0 bg-black/30" onClick={() => setFilterOpen(false)} />
          <aside className="slide-left absolute left-0 top-0 flex h-full w-full max-w-[390px] flex-col overflow-y-auto bg-white p-[17px]">
            <div className="mb-6 flex items-start justify-between text-[12px]">
              <span>Filter</span>
              <button aria-label="Close filter" onClick={() => setFilterOpen(false)}>
                <CloseIcon size={30} />
              </button>
            </div>
            <h3 className="nav-label mb-2">Availability</h3>
            {(["in", "out"] as const).map((a) => (
              <label key={a} className="mb-1 flex items-center gap-2 text-[12px] uppercase">
                <input type="radio" name="avail" checked={avail === a} onChange={() => setAvail(a)} />
                {a === "in" ? "In stock" : "Out of stock"}
              </label>
            ))}
            <h3 className="nav-label mb-2 mt-6">Price</h3>
            <div className="flex items-center justify-between gap-3">
              <input value={from} onChange={(e) => setFrom(e.target.value)} inputMode="numeric" placeholder="$ 0" aria-label="From" className="h-8 w-[80px] border border-gray-300 px-2 text-[12px]" />
              <span>–</span>
              <input value={to} onChange={(e) => setTo(e.target.value)} inputMode="numeric" placeholder={`$ ${maxPrice.toFixed(2)}`} aria-label="To" className="h-8 w-[100px] border border-gray-300 px-2 text-[12px]" />
            </div>
            <h3 className="nav-label mb-2 mt-6">Size</h3>
            {sizes.map((s) => (
              <label key={s} className="mb-1 flex items-center gap-2 text-[12px] uppercase">
                <input type="radio" name="size" checked={size === s} onChange={() => setSize(s)} />
                {s}
              </label>
            ))}
            <div className="mt-auto flex gap-2 pt-8">
              <button
                className="nav-label h-[44px] flex-1 border border-black text-[12px]"
                onClick={() => {
                  setAvail("");
                  setSize("");
                  setFrom("");
                  setTo("");
                }}
              >
                Clear
              </button>
              <button className="nav-label h-[44px] flex-[2] bg-black text-[12px] text-white" onClick={() => setFilterOpen(false)}>
                Apply
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
