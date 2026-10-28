import Link from "next/link";
import { FOOTER, type FooterLink } from "@/lib/nav";
import { InstagramIcon, TikTokIcon, TwitterIcon, YouTubeIcon } from "@/components/common/Icons";

const icons = { Twitter: TwitterIcon, Instagram: InstagramIcon, TikTok: TikTokIcon, YouTube: YouTubeIcon };

function Col({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h2 className="page-title mb-[17px]">{title}</h2>
      <ul>
        {links.map((l) => (
          <li key={l.label} className="leading-[15px]">
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="bg-white px-[9px] lg:px-[17px] pb-[16px] pt-[8px]">
      <div className="grid grid-cols-1 gap-y-[30px] lg:grid-cols-4">
        <Col title="Menu" links={FOOTER.menu} />
        <Col title="Legal" links={FOOTER.legal} />
        <Col title="Policies" links={FOOTER.policies} />
        <div>
          <h2 className="page-title mb-[17px]">Socials</h2>
          <div className="flex gap-4">
            {FOOTER.socials.map((s) => {
              const Icon = icons[s.label as keyof typeof icons];
              return (
                <a key={s.label} href={s.href} aria-label={s.label} >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <p className="mt-[17px] text-[14px] leading-[15px]">© 2026, Schick.</p>
    </footer>
  );
}
