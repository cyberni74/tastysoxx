"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/** Snapshot for display only; prices are re-read from the DB at checkout. */
export interface CartItem {
  id: string;
  title: string;
  price_cents: number;
  image: string | null;
  seller_id: string;
  seller_name: string;
}

interface CartCtx {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "tastysoxx-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && typeof i.id === "string"));
    } catch {}
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }, []);

  const value = useMemo<CartCtx>(() => ({
    items,
    add: (item) => { if (!items.some((i) => i.id === item.id)) persist([...items, item]); },
    remove: (id) => persist(items.filter((i) => i.id !== id)),
    clear: () => persist([]),
    has: (id) => items.some((i) => i.id === id),
  }), [items, persist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
