export type NavLink = { label: string; href: string; sale?: boolean; disabled?: boolean };
export type FooterLink = { label: string; href: string };

export const NAV: { label: string; links: NavLink[] }[] = [
  { label: "Shop", links: [] },
  {
    label: "Collections",
    links: [
      { label: "Merch", href: "/collections/merch" },
      { label: "Magazines", href: "/collections/magazines" },
      { label: "Collector's Box", href: "/collections/collectors-box" },
    ],
  },
  {
    label: "Brand",
    links: [{ label: "About", href: "/pages/about-us", disabled: true }],
  },
];

export const FOOTER = {
  menu: [
    { label: "Search", href: "/search" },
    { label: "Size Chart", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  policies: [
    { label: "Refund Policy", href: "#" },
    { label: "Shipping Policy", href: "#" },
    { label: "Store Policies", href: "#" },
    { label: "FAQs", href: "#" },
  ],
  socials: [
    { label: "Twitter", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "YouTube", href: "#" },
  ],
};
