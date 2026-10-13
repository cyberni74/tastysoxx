"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Empty, Swatch } from "@/components/Bits";
import { useCart, type CartItem } from "@/components/CartProvider";
import { useLocale, useT } from "@/i18n/client";
import { account } from "@/i18n/messages/account";
import { SHIPPING_CENTS } from "@/lib/constants";
import { eur } from "@/lib/format";

function groupBySeller(items: CartItem[]) {
  const groups = new Map<string, { seller_id: string; seller_name: string; items: CartItem[] }>();
  for (const it of items) {
    const g = groups.get(it.seller_id) ?? { seller_id: it.seller_id, seller_name: it.seller_name, items: [] };
    g.items.push(it);
    groups.set(it.seller_id, g);
  }
  return [...groups.values()];
}

export function CartView() {
  const t = useT(account);
  const locale = useLocale();
  const { items, remove } = useCart();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) return <div className="card h-40 animate-pulse" aria-busy="true" aria-label={t("cart.loading")} />;
  if (items.length === 0) {
    return (
      <Empty>
        <p>{t("cart.empty")}</p>
        <Link href="/marktplatz" className="btn-primary mt-4">{t("cart.toShop")}</Link>
      </Empty>
    );
  }

  const groups = groupBySeller(items);
  const subtotal = items.reduce((s, i) => s + i.price_cents, 0);
  const shipping = groups.length * SHIPPING_CENTS;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      <div className="grid gap-4">
        {groups.map((g) => (
          <section key={g.seller_id} className="card p-4 sm:p-5">
            <h2 className="flex flex-wrap items-baseline justify-between gap-2 font-sans text-base font-semibold">
              <span>
                {t("cart.from")} <Link href={`/verkaeufer/${encodeURIComponent(g.seller_name)}`} className="hover:underline">{g.seller_name}</Link>
              </span>
              <span className="text-sm font-normal text-muted">{t("cart.shippingEach", { price: eur(SHIPPING_CENTS, locale) })}</span>
            </h2>
            <ul className="mt-3 grid gap-3">
              {g.items.map((it) => (
                <li key={it.id} className="flex items-center gap-3">
                  <Link href={`/artikel/${it.id}`} className="size-16 shrink-0 overflow-hidden rounded-xl">
                    {it.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={it.image} alt="" className="size-full object-cover" />
                      : <Swatch hue={165} className="size-full" />}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/artikel/${it.id}`} className="block truncate font-semibold hover:underline">{it.title}</Link>
                    <div className="truncate text-sm text-muted">{it.seller_name}</div>
                  </div>
                  <div className="grid shrink-0 justify-items-end gap-1">
                    <span className="font-semibold tabular-nums">{eur(it.price_cents, locale)}</span>
                    <button type="button" onClick={() => remove(it.id)} className="text-sm text-muted underline-offset-2 hover:text-danger hover:underline" aria-label={t("cart.removeLabel", { title: it.title })}>
                      {t("cart.remove")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <aside className="card grid gap-3 p-4 sm:p-5 lg:sticky lg:top-20">
        <dl className="grid gap-1.5 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-muted">{t("cart.subtotal", { n: items.length })}</dt><dd className="tabular-nums">{eur(subtotal, locale)}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">{t("cart.shipping", { n: groups.length, unit: groups.length === 1 ? t("cart.parcel") : t("cart.parcels") })}</dt><dd className="tabular-nums">{eur(shipping, locale)}</dd></div>
          <div className="mt-1 flex justify-between border-t border-line pt-2 text-base font-bold"><dt>{t("cart.total")}</dt><dd className="tabular-nums">{eur(subtotal + shipping, locale)}</dd></div>
        </dl>
        <p className="text-xs text-muted">{t("cart.priceNote")}</p>
        <Link href="/kasse" className="btn-primary">{t("cart.checkout")}</Link>
        <Link href="/marktplatz" className="text-center text-sm font-semibold text-accent hover:underline">{t("cart.continue")}</Link>
      </aside>
    </div>
  );
}
