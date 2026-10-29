import Image from "next/image";
import Link from "next/link";
import HomeCarousel from "@/components/commerce/HomeCarousel";
import slides from "@/lib/carousel-slides.json";

const F = "https://hanifa.co/cdn/shop/files/";

// Each editorial row is one full-bleed image (text and cream panel are baked into the artwork),
// with a separate crop below 750px (the reference's image breakpoint).
function Row({ href, desktop, mobile, base = F }: { href: string; desktop: { src: string; w: number; h: number }; mobile: { src: string; w: number; h: number }; base?: string }) {
  return (
    <Link href={href} className="block">
      <Image src={base + desktop.src} alt="" width={desktop.w} height={desktop.h} sizes="100vw" className="hidden h-auto w-full min-[750px]:block" />
      <Image src={base + mobile.src} alt="" width={mobile.w} height={mobile.h} sizes="100vw" className="h-auto w-full min-[750px]:hidden" />
    </Link>
  );
}

const YOUTUBE = "https://www.youtube.com/embed/c2BPjlTxTqQ?autoplay=1&mute=1&loop=1&playlist=c2BPjlTxTqQ&controls=0&playsinline=1&rel=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1";

export default function Home() {
  return (
    <>
      <Link href="/collections/merch" className="block">
        <Image src="/home/hero.png" alt="SCHICK Too SCHICK for you t-shirt" width={1672} height={941} priority sizes="100vw" className="h-auto w-full" />
      </Link>
      <HomeCarousel title="SHOP THE MERCH" href="/collections/merch" slides={slides} />
      <Row
        href="/collections/merch"
        base="/home/"
        desktop={{ src: "merch-cta.png", w: 1920, h: 1271 }}
        mobile={{ src: "merch-cta.png", w: 1920, h: 1271 }}
      />
      <Row
        href="/collections/magazines"
        base="/home/"
        desktop={{ src: "magazines-cta.png", w: 1501, h: 1001 }}
        mobile={{ src: "magazines-cta.png", w: 1501, h: 1001 }}
      />
      {/* YouTube video used as a background: muted, looping, no controls, not interactive. The 16:9 player is
          oversized and cropped to fill the frame, which also clips YouTube's title bar and control strip (16:9 on desktop, 3:4 below 750px like the original). */}
      <div className="relative overflow-hidden bg-black pb-[133.3333%] min-[750px]:pb-[56.25%]" aria-hidden="true">
        <iframe
          title="Behind-The-Scenes: SCHICK Summer 2019 Cover Star, AṢA"
          src={YOUTUBE}
          loading="lazy"
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[308.15%] -translate-x-1/2 -translate-y-1/2 border-0 min-[750px]:h-[135%] min-[750px]:w-[135%]"
        />
        {/* Overlay: darkens the video so any content placed on it stays readable */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
    </>
  );
}
