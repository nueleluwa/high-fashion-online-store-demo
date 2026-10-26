import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section>
      <h2 className="page-title px-[9px] lg:px-[17px] pb-[7px] pt-[16px]">You may also like</h2>
      <ul className="grid grid-cols-2">
        {products.map((p) => (
          <li key={p.id}>
            <Link href={`/products/${p.handle}`} className="relative block aspect-[4/5] bg-[#f0f0f0]" aria-label={p.title}>
              {p.images[0] && (
                <Image src={p.images[0].src} alt={p.title} width={p.images[0].width} height={p.images[0].height} sizes="50vw" className="absolute inset-0 h-full w-full object-cover object-top" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
