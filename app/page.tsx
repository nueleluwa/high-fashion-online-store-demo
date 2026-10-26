import Image from "next/image";
import Link from "next/link";
import HomeCarousel from "@/components/commerce/HomeCarousel";
import { getCollection } from "@/lib/catalog";

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

const VIDEO = "autoPlay=true&playerColor=ffffff&showControls=false&loop=true";

export default function Home() {
  const restocked = getCollection("just-restocked")?.products ?? [];
  return (
    <>
      <Link href="/collections/just-restocked" className="block">
        <Image src={`${F}HANIFA_HEADER_IMAGE_26.png?v=1779740058`} alt="Hanifa" width={2000} height={1333} priority sizes="100vw" className="h-auto w-full" />
      </Link>
      <HomeCarousel title="JUST RESTOCKED" href="/collections/just-restocked" products={restocked} />
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
      {/* Original SproutVideo embeds: 16:9 on desktop, 3:4 on mobile */}
      <div className="bg-black">
        <div className="relative hidden pb-[56.25%] min-[750px]:block">
          <iframe
            title="Hanifa video"
            src={`https://videos.sproutvideo.com/embed/109bddb01b1aefcb9a/051a9441f0048bb8?${VIDEO}`}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            className="absolute left-0 top-0 h-full w-full border-0"
          />
        </div>
        <div className="relative pb-[133.3333%] min-[750px]:hidden">
          <iframe
            title="Hanifa video"
            src={`https://videos.sproutvideo.com/embed/8c9bddb01b1aefc506/25c9f86070a7f3a0?${VIDEO}`}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            className="absolute left-0 top-0 h-full w-full border-0"
          />
        </div>
      </div>
    </>
  );
}
