"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/money";
import { type Product } from "@/lib/catalog";
import { ArrowLeft, ArrowRight, ChevronDown, Minus, Plus } from "@/components/common/Icons";

type Section = { title: string; html: string };

export default function ProductDetail({ product, intro, sections }: { product: Product; intro: string; sections: Section[] }) {
  const { add } = useCart();
  const colorOpt = product.options.find((o) => /colou?r/i.test(o.name));
  const sizeOpt = product.options.find((o) => /size/i.test(o.name));
  const val = (v: Product["variants"][number], o?: Product["options"][number]) =>
    o ? (o.position === 1 ? v.option1 : v.option2)?.trim() ?? "" : "";

  const first = product.variants.find((v) => v.available) ?? product.variants[0];
  const [color, setColor] = useState(val(first, colorOpt));
  const [size, setSize] = useState(val(first, sizeOpt));
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  const colors = colorOpt?.values.map((c) => c.trim()) ?? [];
  const sizes = sizeOpt?.values.map((s) => s.trim()) ?? [];

  const variantFor = (c: string, s: string) =>
    product.variants.find((v) => (!colorOpt || val(v, colorOpt) === c) && (!sizeOpt || val(v, sizeOpt) === s));
  const variant = variantFor(color, size);

  const swatch = useMemo(
    () => (c: string) => product.variants.find((v) => val(v, colorOpt) === c)?.featured_image?.src ?? product.images[0]?.src,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product],
  );

  const images = product.images;
  const goto = (i: number) => {
    const n = (i + images.length) % images.length;
    setSlide(n);
    track.current?.scrollTo({ left: n * track.current.clientWidth, behavior: "smooth" });
  };
  const pickColor = (c: string) => {
    setColor(c);
    const src = swatch(c);
    const idx = images.findIndex((im) => im.src === src);
    if (idx >= 0) goto(idx);
  };

  const cmp = Number(variant?.compare_at_price ?? 0);
  const now = Number(variant?.price ?? product.variants[0].price);
  const soldOut = !variant || !variant.available;

  return (
    <div className="lg:flex">
      {/* gallery */}
      <div className="lg:w-1/2">
        <div className="hidden lg:block">
          {images.map((im, i) => (
            <Image key={im.id} src={im.src} alt={product.title} width={im.width} height={im.height} sizes="50vw" priority={i === 0} className="h-auto w-full" />
          ))}
        </div>
        <div className="lg:hidden">
          <div
            ref={track}
            className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
            onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          >
            {images.map((im, i) => (
              <div key={im.id} className="relative w-full shrink-0 snap-center" style={{ aspectRatio: `${images[0].width} / ${images[0].height}` }}>
                <Image src={im.src} alt={product.title} fill sizes="100vw" priority={i === 0} className="object-cover object-top" />
              </div>
            ))}
          </div>
          {images.length > 1 && (
          <div className="flex items-center justify-between px-[9px] py-[9px]">
            <div className="flex gap-3">
              {images.map((im, i) => (
                <button key={im.id} aria-label={`Image ${i + 1}`} onClick={() => goto(i)} className={`h-[9px] w-[9px] rounded-full border border-black ${slide === i ? "bg-black" : ""}`} />
              ))}
            </div>
            <div className="flex gap-3">
              <button aria-label="Previous image" onClick={() => goto(slide - 1)}><ArrowLeft size={30} /></button>
              <button aria-label="Next image" onClick={() => goto(slide + 1)}><ArrowRight size={30} /></button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* info */}
      <div className={`px-[9px] lg:px-[17px] pb-[15px] lg:pb-10 ${images.length > 1 ? "pt-[32px]" : "pt-[9px]"} lg:pt-[9px] lg:sticky lg:top-[65px] lg:h-fit lg:w-1/2 lg:self-start`}>
        <h1 className="page-title text-[16px] leading-[14.4px]">{product.title}</h1>
        <p className="mt-[32px] text-[16px] leading-[16px] tracking-normal">
          <span className="text-gray-500">{money(now)}</span>
          {cmp > now && <span className="ml-1 line-through">{money(cmp)}</span>}
        </p>
        <p className="mt-2">Shipping calculated at checkout.</p>

        {colors.length > 1 || (colors.length === 1 && colorOpt) ? (
          <div className="mt-[34px]">
            <p>Color: {color}</p>
            <div className="mt-3 flex gap-[13px]">
              {colors.map((c) => (
                <button
                  key={c}
                  aria-label={c}
                  aria-pressed={c === color}
                  onClick={() => pickColor(c)}
                  className={`relative h-[28px] w-[28px] overflow-hidden outline-offset-2 ${c === color ? "outline outline-1 outline-black" : ""}`}
                >
                  <Image src={swatch(c)!} alt={c} width={60} height={75} className="h-full w-full object-cover object-center" />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {sizes.length > 0 && (
          <div className="mt-[18px]">
            <p>Size:</p>
            <div className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
              {sizes.map((s) => {
                const v = variantFor(color, s);
                const na = !v || !v.available;
                return (
                  <button
                    key={s}
                    aria-pressed={s === size}
                    onClick={() => setSize(s)}
                    className={`h-[28px] min-w-[38px] px-3 ${s === size ? "border border-black" : "border border-transparent"} ${na ? "line-through" : ""}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-[25px] lg:mt-[31px]">
          <p>Quantity:</p>
          <div className="mt-3 flex items-center gap-4">
            <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus /></button>
            <span className="w-[44px] border-b border-black pb-2 text-center text-[14px]">{qty}</span>
            <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}><Plus /></button>
          </div>
        </div>

        <p className="mt-[54px]">Ready to ship</p>
        <p className="mt-[23px] text-[12px]">4 interest-free installments, or from <b>{money(now / 11)}</b>/mo with <span className="font-bold text-[#5a31f4]">shop</span> (demo)</p>

        <button
          disabled={soldOut}
          className="btn-label mt-[50px] h-[36px] lg:mt-[43px] w-full bg-black text-white disabled:bg-gray-400"
          onClick={() =>
            variant &&
            add({
              variantId: variant.id,
              handle: product.handle,
              title: product.title,
              variantTitle: variant.title,
              price: Number(variant.price),
              image: variant.featured_image?.src ?? images[0]?.src ?? null,
            }, qty)
          }
        >
          {soldOut ? "Sold out" : "Add to cart"}
        </button>
        <p className="mt-1 text-[12px]">At no extra cost, 1% of every order will be donated to support a nonprofit you choose. Powered by Beam</p>

        {intro && <div className="rte mt-[55px] text-[19px] lg:mt-[52px] leading-[19px]" dangerouslySetInnerHTML={{ __html: intro }} />}

        <div className="mt-[22px] lg:mt-[36px]">
          {sections.map((s, i) => (
            <div key={`${s.title}-${i}`}>
              <button className="flex h-[44px] w-full items-center justify-between font-[family-name:var(--font-regular)] text-[14px] font-bold uppercase leading-[14px] tracking-[1px]" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                {s.title}
                <ChevronDown size={26} className={`transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <div className="rte fade-in pb-4 text-[12px] leading-[18px]" dangerouslySetInnerHTML={{ __html: s.html }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
