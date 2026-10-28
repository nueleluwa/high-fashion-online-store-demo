"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/nav";
import { useCart } from "@/lib/cart";
import { BagIcon, ChevronDown, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/common/Icons";

export default function SiteHeader() {
  const router = useRouter();
  const { setOpen: openCart } = useCart();
  const [menu, setMenu] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 bg-white" ref={wrap}>
      <div className="relative flex h-[67px] items-stretch justify-between px-[10px] lg:h-[65px] lg:px-[17px]">
        {/* left */}
        <div className="flex w-1/3 items-center">
          <button className="lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
            <MenuIcon size={26} />
          </button>
          <nav aria-label="Primary" className="hidden self-stretch lg:flex">
            {NAV.map((g, i) => (
              <button
                key={g.label}
                className="btn-label mr-4 inline-flex items-center self-stretch py-[8.5px]"
                aria-expanded={menu === i}
                onClick={() => setMenu(menu === i ? null : i)}
              >
                <span className="pr-1">{g.label}</span>
                <ChevronDown className={`transition ${menu === i ? "rotate-180" : ""}`} />
              </button>
            ))}
          </nav>
        </div>

        {/* logo */}
        <Link href="/" className="my-auto inline-block py-2" aria-label="SCHICK">
          {/* the supplied logo is white on transparent; brightness-0 renders it black on the white header */}
          <Image src="/schick-logo-white.png" alt="SCHICK" width={720} height={195} priority className="h-[30px] w-auto brightness-0" />
        </Link>

        {/* right */}
        <div className="flex w-1/3 items-center justify-end gap-x-3 lg:gap-x-4">
          <Link href="/account" aria-label="Log in" className="hidden lg:block">
            <UserIcon size={26} />
          </Link>
          <button aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
            <SearchIcon size={26} />
          </button>
          <button aria-label="Cart" onClick={() => openCart(true)}>
            <BagIcon size={26} />
          </button>
        </div>
      </div>

      {/* dropdown bar */}
      {menu !== null && NAV[menu].links.length > 0 && (
        <div className="fade-in absolute left-0 top-full w-full border-y border-gray-200 bg-white px-[17px] text-center">
          <ul className="flex justify-center gap-4 py-2">
            {NAV[menu].links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setMenu(null)}
                  className={`inline-block py-2 uppercase ${l.sale ? "text-sale" : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* inline search */}
      {searchOpen && (
        <form onSubmit={submit} className="fade-in flex h-[60px] items-center gap-4 border-t border-gray-200 bg-white px-[17px]">
          <SearchIcon size={22} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="SEARCH"
            aria-label="Search"
            className="flex-1 bg-transparent text-[12px] uppercase outline-none placeholder:text-black"
          />
          <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
            <CloseIcon size={26} />
          </button>
        </form>
      )}

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fade-in absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="slide-left absolute left-0 top-0 h-full w-[85%] max-w-[390px] overflow-y-auto bg-white p-[17px]">
            <button aria-label="Close menu" className="mb-6 block" onClick={() => setMobileOpen(false)}>
              <CloseIcon size={26} />
            </button>
            {NAV.map((g, i) => (
              <div key={g.label} className="border-b border-gray-200">
                <button
                  className="nav-label flex w-full items-center justify-between py-4 text-[14px]"
                  aria-expanded={mobileGroup === i}
                  onClick={() => setMobileGroup(mobileGroup === i ? null : i)}
                >
                  {g.label}
                  <ChevronDown size={14} className={mobileGroup === i ? "rotate-180" : ""} />
                </button>
                {mobileGroup === i && g.links.length > 0 && (
                  <ul className="pb-3">
                    {g.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block py-2 text-[13px] uppercase ${l.sale ? "text-sale" : ""}`}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <Link href="/account" onClick={() => setMobileOpen(false)} className="nav-label block py-4 text-[14px]">
              Log in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
