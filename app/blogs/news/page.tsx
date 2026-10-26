import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticles } from "@/lib/content";

export const metadata: Metadata = { title: "Limitless by Hanifa" };

export default function BlogIndex() {
  return (
    <div className="px-[17px] pb-12 pt-[17px]">
      <h1 className="page-title text-center">Limitless by Hanifa</h1>
      <ul className="mx-auto mt-8 grid max-w-[1200px] gap-8 lg:grid-cols-3">
        {getArticles().map((a) => (
          <li key={a.handle}>
            <Link href={`/blogs/news/${a.handle}`} className="block">
              {a.image && (
                <div className="relative mb-3 aspect-[4/5] w-full">
                  <Image src={a.image.replace(/[?&]width=\d+/, "")} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
                </div>
              )}
              <h2 className="font-[family-name:var(--font-heading)] text-[14px] uppercase leading-[16px] tracking-[0.3px]">{a.title}</h2>
              <p className="mt-1 text-[12px]">{new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
