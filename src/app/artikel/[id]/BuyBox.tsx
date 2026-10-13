"use client";
import Link from "next/link";
import { useCart, type CartItem } from "@/components/CartProvider";
import { useT } from "@/i18n/client";
import { browse } from "@/i18n/messages/browse";

export function BuyBox({ item, available, isOwner }: { item: CartItem; available: boolean; isOwner: boolean }) {
  const t = useT(browse);
  const { add, has } = useCart();
  const inCart = has(item.id);

  if (inCart) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="btn cursor-default bg-accent-soft text-accent" role="status">{t("item.inCart")}</span>
        <Link href="/warenkorb" className="btn-ghost">{t("item.toCart")}</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={() => add(item)} disabled={!available || isOwner} className="btn-primary w-full sm:w-auto">
        {t("item.addToCart")}
      </button>
      {isOwner && <p className="text-sm text-muted">{t("item.own")}</p>}
      {!isOwner && !available && <p className="text-sm text-muted">{t("item.unavailable")}</p>}
    </div>
  );
}
