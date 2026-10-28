"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/money";
import { Minus, Plus } from "@/components/common/Icons";

export default function CartPage() {
  const { lines, subtotal, setQty, remove } = useCart();
  return (
    <div className="mx-auto max-w-[900px] px-[17px] pb-12 pt-[17px]">
      <h1 className="page-title">Your Shopping Cart</h1>
      {lines.length === 0 ? (
        <div className="py-8 text-[14px]">
          <p className="mb-4">Your cart is currently empty.</p>
          <Link href="/collections/all" className="underline">Continue shopping</Link>
        </div>
      ) : (
        <>
          <ul className="mt-6">
            {lines.map((l) => (
              <li key={l.variantId} className="flex gap-4 border-b border-gray-200 py-4">
                {l.image && <Image src={l.image} alt={l.title} width={200} height={250} className="h-auto w-[100px]" />}
                <div className="flex-1 text-[12px]">
                  <p>{l.title}</p>
                  <p>{l.variantTitle}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <button aria-label="Decrease quantity" onClick={() => setQty(l.variantId, l.qty - 1)}><Minus /></button>
                    <span className="text-[14px]">{l.qty}</span>
                    <button aria-label="Increase quantity" onClick={() => setQty(l.variantId, l.qty + 1)}><Plus /></button>
                    <button className="ml-4 underline" onClick={() => remove(l.variantId)}>Remove</button>
                  </div>
                </div>
                <p>{money(l.price * l.qty)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-right text-[14px]">Subtotal {money(subtotal)}</p>
          <p className="mt-1 text-right text-[12px]">Taxes and shipping calculated at checkout. Demo store — checkout is not connected.</p>
        </>
      )}
    </div>
  );
}
