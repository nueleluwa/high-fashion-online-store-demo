export type NavLink = { label: string; href: string; sale?: boolean };
// `dead` links 404 on the reference too (linked from its footer); skip prefetching them.
export type FooterLink = { label: string; href: string; dead?: boolean };

export const NAV: { label: string; links: NavLink[] }[] = [
  {
    label: "Shop",
    links: [
      { label: "SALE", href: "/collections/sale", sale: true },
      { label: "New", href: "/collections/new" },
      { label: "Just Restocked", href: "/collections/just-restocked" },
      { label: "Ready to Ship", href: "/collections/shipping-now" },
      { label: "Coats", href: "/collections/coats" },
      { label: "Tops", href: "/collections/tops" },
      { label: "Bottoms", href: "/collections/pants" },
      { label: "Dresses", href: "/collections/dresses" },
      { label: "Jumpsuits", href: "/collections/jumpsuits" },
      { label: "Knitwear", href: "/collections/knitwear" },
      { label: "Jewelry", href: "/collections/jewelry" },
      { label: "Footwear", href: "/collections/footwear" },
      { label: "Gift Card", href: "/products/gift-card" },
    ],
  },
  {
    label: "Collections",
    links: [
      { label: "FW25", href: "/collections/fw25" },
      { label: "Resort '25", href: "/collections/resort-25" },
      { label: "SS25 Drop 2", href: "/collections/ss25-drop-ii" },
      { label: "SS25 Drop 1", href: "/collections/ss25" },
      { label: "Handbags", href: "/collections/handbags" },
      { label: "Bridal", href: "/collections/bridal" },
    ],
  },
  {
    label: "The Brand",
    links: [
      { label: "About", href: "/pages/about-us" },
      { label: "Hanifa Dream", href: "/pages/the-hanifa-dream" },
    ],
  },
];

export const FOOTER = {
  menu: [
    { label: "Search", href: "/search" },
    { label: "Size Chart", href: "/pages/sizing-chart" },
    { label: "Returns", href: "/pages/shipping-returns" },
    { label: "Careers", href: "/pages/careers", dead: true },
    { label: "Contact Us", href: "/pages/contact-us" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/policies/privacy-policy" },
    { label: "Terms of Service", href: "/policies/terms-of-service" },
  ],
  policies: [
    { label: "Refund Policy", href: "/policies/refund-policy" },
    { label: "Shipping Policy", href: "/pages/shipping-returns" },
    { label: "Store Policies", href: "/pages/store-policies" },
    { label: "FAQs", href: "/pages/faqs" },
    { label: "Bridal FAQ", href: "/pages/bridal-faq", dead: true },
  ],
  socials: [
    { label: "Twitter", href: "https://twitter.com/officialhanifa" },
    { label: "Instagram", href: "https://instagram.com/hanifaofficial" },
    { label: "TikTok", href: "https://www.tiktok.com/@officialhanifa" },
    { label: "YouTube", href: "https://www.youtube.com/channel/UCIgUZbvYoEICilGn_K7dIkQ" },
  ],
};
