// Pure helpers with no data imports, safe for client components.
import type { Product } from "./catalog";

export const money = (n: number | string) => `₦${Number(n).toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
export const price = (p: Product) => Number(p.variants[0]?.price ?? 0);
export const compareAt = (p: Product) => Number(p.variants[0]?.compare_at_price ?? 0);
