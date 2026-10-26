import Image from "next/image";
import Link from "next/link";
import { compareAt, money, price } from "@/lib/money";
import { type Product } from "@/lib/catalog";

// Desktop: image only; hovering reveals a white bar (title left, prices right).
// Mobile: title and prices sit below the image.
export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const img = product.images[0];
  const cmp = compareAt(product);
  const now = price(product);
  const prices = (
    <>
      {cmp > now && <span className="block line-through">{money(cmp)}</span>}
      <span className="block text-gray-500">{money(now)}</span>
    </>
  );

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f0f0f0]">
        {img && (
          <Image
            src={img.src}
            alt={product.title}
            width={img.width}
            height={img.height}
            sizes="(min-width:1024px) 25vw, 50vw"
            priority={priority}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        )}
        <div className="absolute bottom-0 left-0 hidden h-[68px] w-full items-start justify-between bg-white px-[17px] pt-[17px] text-[17px] leading-[17px] opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:flex">
          <span className="font-semibold">{product.title}</span>
          <span className="text-right">{prices}</span>
        </div>
      </div>
      <div className="px-[9px] pb-4 pt-[18px] text-[13.6px] leading-[13.6px] lg:hidden">
        <p className="font-semibold">{product.title}</p>
        <div className="mt-1 leading-[14px]">{prices}</div>
      </div>
    </Link>
  );
}
