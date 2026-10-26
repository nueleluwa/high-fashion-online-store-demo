"use client";

import { useState } from "react";

export default function ContactForm({ kind }: { kind: "contact-us" | "subscribe" }) {
  const [sent, setSent] = useState(false);
  if (sent) return <p className="mt-8 text-center text-[14px]">Thanks! (Demo form — nothing was sent.)</p>;
  const field = "h-[44px] w-full border border-black bg-transparent px-3 text-[12px] outline-none";
  return (
    <form
      className="mx-auto mt-8 flex max-w-[500px] flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {kind === "contact-us" && <input required aria-label="Name" placeholder="NAME" className={field} />}
      <input required type="email" aria-label="Email" placeholder="EMAIL" className={field} />
      {kind === "contact-us" && <textarea required aria-label="Message" placeholder="MESSAGE" rows={5} className={`${field} h-auto py-3`} />}
      <button type="submit" className="nav-label h-[44px] bg-black text-[12px] text-white">
        {kind === "contact-us" ? "Send" : "Subscribe"}
      </button>
    </form>
  );
}
