"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Empty } from "@/components/Bits";
import { useCart } from "@/components/CartProvider";
import { useLocale, useT } from "@/i18n/client";
import { account } from "@/i18n/messages/account";
import { COUNTRIES, SHIPPING_CENTS } from "@/lib/constants";
import { eur } from "@/lib/format";
import { placeOrder, type CheckoutState } from "./actions";

export function CheckoutForm({ defaultCountry }: { defaultCountry: string }) {
  const t = useT(account);
  const locale = useLocale();
  const { items, clear } = useCart();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const [state, action, pending] = useActionState<CheckoutState, FormData>(async (prev, fd) => {
    const res = await placeOrder(prev, fd);
    if (res.ok) {
      clear();
      router.push("/konto/bestellungen?neu=1");
    }
    return res;
  }, {});

  if (!ready) return <div className="card h-40 animate-pulse" aria-busy="true" aria-label={t("cart.loading")} />;
  if (state.ok) return <p role="status" className="card p-5 text-muted">{t("checkout.finishing")}</p>;
  if (items.length === 0) {
    return (
      <Empty>
        <p>{t("cart.empty")}</p>
        <Link href="/shop" className="btn-primary mt-4">{t("cart.toShop")}</Link>
      </Empty>
    );
  }

  const sellers = new Set(items.map((i) => i.seller_id)).size;
  const subtotal = items.reduce((s, i) => s + i.price_cents, 0);
  const shipping = sellers * SHIPPING_CENTS;

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
      {items.map((i) => <input key={i.id} type="hidden" name="listing_id" value={i.id} />)}

      <div className="grid gap-6">
        <section className="card grid gap-4 p-4 sm:p-5">
          <h2 className="text-xl font-extrabold">{t("checkout.address")}</h2>
          <label className="label">
            {t("checkout.name")}
            <input className="input" name="ship_name" autoComplete="name" required minLength={2} maxLength={80} />
            <span className="text-xs font-normal text-muted">{t("checkout.nameHint")}</span>
          </label>
          <label className="label">
            {t("checkout.street")}
            <input className="input" name="ship_street" autoComplete="street-address" required minLength={3} maxLength={120} />
          </label>
          <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
            <label className="label">
              {t("checkout.zip")}
              <input className="input" name="ship_zip" autoComplete="postal-code" required maxLength={10} />
            </label>
            <label className="label">
              {t("checkout.city")}
              <input className="input" name="ship_city" autoComplete="address-level2" required maxLength={80} />
            </label>
          </div>
          <label className="label">
            {t("checkout.country")}
            <select className="input" name="ship_country" defaultValue={defaultCountry in COUNTRIES ? defaultCountry : "DE"}>
              {Object.entries(COUNTRIES).map(([code, flag]) => (
                <option key={code} value={code}>{flag} {t(`country.${code}` as `country.DE`)}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="card grid gap-2 p-4 sm:p-5">
          <h2 className="text-xl font-extrabold">{t("checkout.payment")}</h2>
          <p className="text-sm text-muted">{t("checkout.paymentText")}</p>
        </section>
      </div>

      <aside className="card grid gap-4 p-4 sm:p-5 lg:sticky lg:top-20">
        <h2 className="text-xl font-extrabold">{t("checkout.summary")}</h2>
        <ul className="grid gap-1.5 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span className="min-w-0 truncate">{i.title} <span className="text-muted">· {i.seller_name}</span></span>
              <span className="shrink-0 tabular-nums">{eur(i.price_cents, locale)}</span>
            </li>
          ))}
        </ul>
        <dl className="grid gap-1.5 border-t border-line pt-3 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-muted">{t("orders.subtotal")}</dt><dd className="tabular-nums">{eur(subtotal, locale)}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted">{t("cart.shipping", { n: sellers, unit: sellers === 1 ? t("cart.parcel") : t("cart.parcels") })}</dt><dd className="tabular-nums">{eur(shipping, locale)}</dd></div>
          <div className="flex justify-between text-base font-bold"><dt>{t("cart.total")}</dt><dd className="tabular-nums">{eur(subtotal + shipping, locale)}</dd></div>
        </dl>
        <p className="text-xs text-muted">{t("cart.priceNote")}</p>

        <label className="flex items-start gap-2.5 text-sm">
          <input type="checkbox" name="adult" required className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]" />
          <span>{t("checkout.adult")}</span>
        </label>

        {state.error && (
          <div role="alert" className="grid gap-2 rounded-xl border border-danger/40 p-3 text-sm">
            <p className="font-medium text-danger">{state.error}</p>
            <Link href="/warenkorb" className="font-semibold text-accent hover:underline">{t("checkout.backToCart")}</Link>
          </div>
        )}

        <button className="btn-primary" disabled={pending}>{pending ? t("checkout.pending") : t("checkout.submit")}</button>
      </aside>
    </form>
  );
}
