"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";

export type CartLine = {
  variantId: number;
  handle: string;
  title: string;
  variantTitle: string;
  price: number;
  image: string | null;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (variantId: number, qty: number) => void;
  remove: (variantId: number) => void;
};

const KEY = "hanifa-demo-cart";
const EMPTY: CartLine[] = [];

// Demo cart persisted in localStorage, exposed as an external store so server and first client render agree (empty).
let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) lines = JSON.parse(raw);
  } catch {}
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => {
  load();
  return lines;
};
const getServerSnapshot = () => EMPTY;

const Ctx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);

  const add = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    load();
    const found = lines.find((l) => l.variantId === line.variantId);
    commit(found ? lines.map((l) => (l.variantId === line.variantId ? { ...l, qty: l.qty + qty } : l)) : [...lines, { ...line, qty }]);
    setOpen(true);
  }, []);

  const setQty = useCallback((variantId: number, qty: number) => {
    commit(qty <= 0 ? lines.filter((l) => l.variantId !== variantId) : lines.map((l) => (l.variantId === variantId ? { ...l, qty } : l)));
  }, []);

  const remove = useCallback((variantId: number) => commit(lines.filter((l) => l.variantId !== variantId)), []);

  const value = useMemo<CartState>(
    () => ({
      lines: current,
      count: current.reduce((n, l) => n + l.qty, 0),
      subtotal: current.reduce((n, l) => n + l.qty * l.price, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
    }),
    [current, open, add, setQty, remove],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
