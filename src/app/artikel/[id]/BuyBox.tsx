"use client";
import Link from "next/link";
import { useCart, type CartItem } from "@/components/CartProvider";

export function BuyBox({ item, available, isOwner }: { item: CartItem; available: boolean; isOwner: boolean }) {
  const { add, has } = useCart();
  const inCart = has(item.id);

  if (inCart) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="btn cursor-default bg-accent-soft text-accent" role="status">✓ Im Warenkorb</span>
        <Link href="/warenkorb" className="btn-ghost">Zum Warenkorb</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={() => add(item)} disabled={!available || isOwner} className="btn-primary w-full sm:w-auto">
        In den Warenkorb
      </button>
      {isOwner && <p className="text-sm text-muted">Das ist dein eigenes Angebot.</p>}
      {!isOwner && !available && <p className="text-sm text-muted">Dieser Artikel ist nicht mehr verfügbar.</p>}
    </div>
  );
}
