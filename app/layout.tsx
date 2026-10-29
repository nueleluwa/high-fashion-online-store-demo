import type { Metadata } from "next";
import "./globals.css";

import { CartProvider } from "@/lib/cart";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import CartDrawer from "@/components/commerce/CartDrawer";
import NewsletterPopup from "@/components/common/NewsletterPopup";

export const metadata: Metadata = {
  title: "SCHICK",
  description: "SCHICK — style beyond fashion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
