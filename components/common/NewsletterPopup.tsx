"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/common/Icons";

const KEY = "hanifa-demo-newsletter-dismissed";

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    // `?nopopup` lets automated visual comparisons skip the modal.
    if (new URLSearchParams(location.search).has("nopopup")) return;
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {}
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4" role="dialog" aria-label="Newsletter">
      <div className="fade-in relative w-full max-w-[600px] rounded-2xl bg-[#fdeeee] px-[45px] pb-[60px] pt-[60px] text-center">
        <button aria-label="Close dialog" className="absolute right-3 top-3" onClick={close}>
          <CloseIcon size={30} />
        </button>
        <h2 className="font-[family-name:var(--font-body)] text-[52px] font-normal leading-[50px] tracking-normal" style={{ fontFamily: "Poppins, Helvetica, sans-serif" }}>
          NEVER MISS
          <span className="block text-[38px] font-bold leading-[50px]">A LAUNCH AGAIN</span>
        </h2>
        <p className="mt-4 text-[16px] uppercase leading-[24px] tracking-normal">&amp; Save 10% off your first purchase</p>
        <p className="mt-3 text-[14px] leading-[22px] tracking-normal">
          You’ll get early access to new collections and exclusives.
          <br />
          Don’t worry, we’ll only send you the ones that matter.
        </p>
        {done ? (
          <p className="mt-10 text-[14px]">Thanks! (Demo — no email was sent.)</p>
        ) : (
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setDone(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL"
              aria-label="Email"
              className="h-[78px] w-full border border-[#4a2a3a] bg-transparent px-4 text-[14px] outline-none"
            />
            <button type="submit" className="nav-label mt-9 h-[54px] w-full bg-[#595555] text-[12px] tracking-[2px] text-white">
              Sign up now
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
