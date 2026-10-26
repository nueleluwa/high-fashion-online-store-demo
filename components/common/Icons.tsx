type P = { className?: string; size?: number };
const base = (size = 24) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true as const });

export const UserIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" /></svg>
);
export const SearchIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
export const BagIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3 8h18l-1 13H4z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></svg>
);
export const ChevronDown = ({ className, size = 12 }: P) => (
  <svg {...base(size)} className={className}><path d="m4 9 8 8 8-8" /></svg>
);
export const CloseIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3 3l18 18M21 3 3 21" /></svg>
);
export const MenuIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M2 6h20M2 12h20M2 18h20" /></svg>
);
export const ArrowLeft = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M21 12H3m7-7-7 7 7 7" /></svg>
);
export const ArrowRight = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M3 12h18m-7-7 7 7-7 7" /></svg>
);
export const Plus = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}><path d="M12 4v16M4 12h16" /></svg>
);
export const Minus = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}><path d="M4 12h16" /></svg>
);

const fill = (size = 22) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true as const });
export const TwitterIcon = ({ className, size }: P) => (
  <svg {...fill(size)} className={className}><path d="M22 5.9c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.7 11.7 0 0 1 3.4 4.600a4.100 4.100 0 0 0 1.300 5.500c-.7 0-1.300-.2-1.900-.5 0 2 1.400 3.700 3.300 4.100-.6.2-1.200.2-1.800.1.500 1.600 2 2.800 3.800 2.900A8.200 8.200 0 0 1 2 18.400 11.600 11.600 0 0 0 8.300 20.200c7.500 0 11.700-6.300 11.700-11.700v-.5c.8-.6 1.500-1.300 2-2.100z" /></svg>
);
export const InstagramIcon = ({ className, size }: P) => (
  <svg {...base(size ?? 22)} className={className}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.500" cy="6.500" r="1" fill="currentColor" stroke="none" /></svg>
);
export const TikTokIcon = ({ className, size }: P) => (
  <svg {...fill(size)} className={className}><path d="M16.600 3c.3 2.300 1.600 3.700 3.900 3.800v3a6.700 6.700 0 0 1-3.800-1.200v6.200a5.800 5.800 0 1 1-5-5.700v3.100a2.800 2.800 0 1 0 2 2.700V3z" /></svg>
);
export const YouTubeIcon = ({ className, size }: P) => (
  <svg {...fill(size)} className={className}><path d="M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z" /></svg>
);
