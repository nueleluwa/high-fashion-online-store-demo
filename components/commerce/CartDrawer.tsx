"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/money";
import { CloseIcon, Minus, Plus } from "@/components/common/Icons";

export default function CartDrawer() {
  const { open, setOpen, lines, count, subtotal, setQty, remove } = useCart();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-label="Cart">
      <div className="fade-in absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <aside className="slide-right absolute right-0 top-0 flex h-full w-full max-w-[490px] flex-col overflow-y-auto bg-white px-[9px] lg:px-[17px] pb-6">
        <div className="flex h-[65px] shrink-0 items-start justify-between pt-[17px]">
          <span className="nav-label text-[12px]">
            Your cart - {count} {count === 1 ? "item" : "items"}
          </span>
          <button aria-label="Close cart" onClick={() => setOpen(false)}>
            <CloseIcon size={26} />
          </button>
        </div>
        <h2 className="page-title mb-4">Your Cart</h2>

        {lines.length === 0 ? (
          <div className="py-8 text-[14px]">
            <p className="mb-4">Your cart is currently empty.</p>
            <Link href="/collections/all" onClick={() => setOpen(false)} className="underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul>
              {lines.map((l) => (
                <li key={l.variantId} className="flex gap-3 pb-4">
                  <Link href={`/products/${l.handle}`} onClick={() => setOpen(false)} className="w-[85px] shrink-0">
                    {l.image && <Image src={l.image} alt={l.title} width={170} height={212} className="h-auto w-full" />}
                  </Link>
                  <div className="flex-1 text-[12px] leading-[12px]">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p>{l.title}</p>
                        <p>{l.variantTitle}</p>
                      </div>
                      <p>{money(l.price * l.qty)}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button aria-label="Decrease quantity" onClick={() => setQty(l.variantId, l.qty - 1)}>
                        <Minus />
                      </button>
                      <span className="w-4 text-center text-[14px]">{l.qty}</span>
                      <button aria-label="Increase quantity" onClick={() => setQty(l.variantId, l.qty + 1)}>
                        <Plus />
                      </button>
                    </div>
                    <button className="mt-2 text-[10px] underline" onClick={() => remove(l.variantId)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between py-2 text-[12px]">
              <span>Subtotal</span>
              <span>{money(subtotal)} USD</span>
            </div>
            <p className="mb-4 text-right text-[12px]">Taxes and shipping calculated at checkout</p>
            <button
              className="nav-label h-[30px] w-full bg-black text-[12px] text-white"
              onClick={() => alert("Demo store: checkout is not connected. A live build would redirect to Shopify checkout.")}
            >
              Check out
            </button>
            <p className="mt-2 text-center text-[10px]">Demo storefront — no payment is processed.</p>
          </>
        )}
      </aside>
    </div>
  );
}
