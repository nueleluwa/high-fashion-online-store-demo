import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in – SCHICK" };

// The reference redirects to Shopify's hosted customer accounts; there is no backend here to authenticate against.
export default function AccountPage() {
  return (
    <div className="mx-auto max-w-[500px] px-[17px] pb-12 pt-[17px] text-center">
      <h1 className="page-title">Sign in</h1>
      <p className="mt-6 text-[14px] leading-[20px]">
        Customer accounts are provided by Shopify on the live site and are not connected in this demo storefront.
      </p>
    </div>
  );
}
