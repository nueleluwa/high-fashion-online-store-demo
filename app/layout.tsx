import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/lib/cart";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import CartDrawer from "@/components/commerce/CartDrawer";
import NewsletterPopup from "@/components/common/NewsletterPopup";

const outfit = Outfit({ subsets: ["latin"], weight: ["400"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "Hanifa",
  description: "Hanifa — for women without limits.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
          <NewsletterPopup />
        </CartProvider>
      </body>
    </html>
  );
}
