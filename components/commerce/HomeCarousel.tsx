"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/catalog";

// Slides are image-only (no title/price), 40% wide on desktop and 70% on mobile, 4px gap.
export default function HomeCarousel({ title, href, products }: { title: string; href: string; products: Product[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const DOTS = 5;
  const paused = useRef(false);

  // The reference carousel advances on its own (interval is an estimate; pauses while hovered/touched).
  useEffect(() => {
    const t = setInterval(() => {
      const el = track.current;
      if (!el || paused.current) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: "smooth" });
      else {
        const slide = el.firstElementChild as HTMLElement | null;
        el.scrollBy({ left: (slide?.offsetWidth ?? el.clientWidth) + 4, behavior: "smooth" });
      }
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((slide?.offsetWidth ?? el.clientWidth) + 4), behavior: "smooth" });
  };

  return (
    <section className="pb-5 pt-[29px] min-[750px]:pt-[40px]">
      <div className="mb-[40px] flex flex-col items-center justify-center gap-[19px] min-[750px]:flex-row min-[750px]:gap-5">
        <h2 className="font-[family-name:var(--font-display)] text-[16px] uppercase leading-[16px] tracking-[2.5px]">{title}</h2>
        <Link href={href} className="text-[12px] tracking-[-1px] underline">View all</Link>
      </div>
      <div className="relative" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)} onTouchStart={() => (paused.current = true)} onTouchEnd={() => (paused.current = false)}>
        <div
          ref={track}
          className="flex gap-[4px] overflow-x-auto scroll-smooth [scrollbar-width:none]"
          onScroll={(e) => {
            const el = e.currentTarget;
            const max = el.scrollWidth - el.clientWidth;
            setPage(max > 0 ? Math.round((el.scrollLeft / max) * (DOTS - 1)) : 0);
          }}
        >
          {products.map((p, i) => (
            <Link key={p.id} href={`/products/${p.handle}`} aria-label={p.title} className="block w-[70%] shrink-0 min-[750px]:w-[40%]">
              <div className="relative aspect-[4/5] bg-[#f0f0f0]">
                {p.images[0] && (
                  <Image
                    src={p.images[0].src}
                    alt={p.title}
                    width={p.images[0].width}
                    height={p.images[0].height}
                    sizes="(min-width:750px) 40vw, 70vw"
                    priority={i < 3}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
        <button aria-label="Previous" onClick={() => go(-1)} className="absolute left-[10px] top-1/2 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 4-8 8 8 8" /></svg>
        </button>
        <button aria-label="Next" onClick={() => go(1)} className="absolute right-[10px] top-1/2 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 4 8 8-8 8" /></svg>
        </button>
      </div>
      <div className="mt-[20px] flex justify-center gap-[14px]">
        {Array.from({ length: DOTS }).map((_, i) => (
          <span key={i} className={`h-[10px] w-[10px] rounded-full ${i === page ? "bg-black" : "bg-[#ccc]"}`} />
        ))}
      </div>
    </section>
  );
}
