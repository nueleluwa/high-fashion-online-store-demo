import Image from "next/image";
import Link from "next/link";
import HomeCarousel from "@/components/commerce/HomeCarousel";
import slides from "@/lib/carousel-slides.json";

const F = "https://hanifa.co/cdn/shop/files/";

// Each editorial row is one full-bleed image (text and cream panel are baked into the artwork),
// with a separate crop below 750px (the reference's image breakpoint).
function Row({ href, desktop, mobile }: { href: string; desktop: { src: string; w: number; h: number }; mobile: { src: string; w: number; h: number } }) {
  return (
    <Link href={href} className="block">
      <Image src={F + desktop.src} alt="" width={desktop.w} height={desktop.h} sizes="100vw" className="hidden h-auto w-full min-[750px]:block" />
      <Image src={F + mobile.src} alt="" width={mobile.w} height={mobile.h} sizes="100vw" className="h-auto w-full min-[750px]:hidden" />
    </Link>
  );
}

const YOUTUBE = "https://www.youtube.com/embed/c2BPjlTxTqQ?autoplay=1&mute=1&loop=1&playlist=c2BPjlTxTqQ&controls=0&playsinline=1&rel=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1";

export default function Home() {
  return (
    <>
      <Link href="/collections/just-restocked" className="block">
        <Image src={`${F}HANIFA_HEADER_IMAGE_26.png?v=1779740058`} alt="Hanifa" width={2000} height={1333} priority sizes="100vw" className="h-auto w-full" />
      </Link>
      <HomeCarousel title="JUST RESTOCKED" href="/collections/just-restocked" slides={slides} />
      <Row
        href="/collections/bestsellers"
        desktop={{ src: "Slice_4_7fc8db15-a2a3-462c-b298-643d06f3d7ea.jpg?v=1769928727", w: 2252, h: 1491 }}
        mobile={{ src: "Slice_4-1.jpg?v=1769928739", w: 2252, h: 1745 }}
      />
      <Row
        href="/collections/shipping-now"
        desktop={{ src: "Slice_3_1.jpg?v=1769528890", w: 1501, h: 1001 }}
        mobile={{ src: "Slice_4_1.jpg?v=1769528906", w: 1501, h: 1231 }}
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
