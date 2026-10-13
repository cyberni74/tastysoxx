"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Empty } from "@/components/Bits";
import { useCart } from "@/components/CartProvider";
import { COUNTRIES, SHIPPING_CENTS } from "@/lib/constants";
import { eur } from "@/lib/format";
import { placeOrder, type CheckoutState } from "./actions";

const COUNTRY_NAMES: Record<string, string> = {
  DE: "Deutschland", AT: "Österreich", CH: "Schweiz", NL: "Niederlande", FR: "Frankreich",
  ES: "Spanien", IT: "Italien", PL: "Polen", GB: "Großbritannien", US: "USA",
};

export function CheckoutForm({ defaultCountry }: { defaultCountry: string }) {
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

  if (!ready) return <div className="card h-40 animate-pulse" aria-busy="true" />;
  if (state.ok) return <p role="status" className="card p-5 text-muted">Bestellung wird abgeschlossen…</p>;
  if (items.length === 0) {
    return (
      <Empty>
        <p>Dein Warenkorb ist leer.</p>
        <Link href="/shop" className="btn-primary mt-4">Zum Shop</Link>
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
          <h2 className="text-xl font-extrabold">Lieferadresse</h2>
          <label className="label">
            Name auf dem Paket
            <input className="input" name="ship_name" autoComplete="name" required minLength={2} maxLength={80} />
            <span className="text-xs font-normal text-muted">Hinweis: Initialen oder Alias reichen.</span>
          </label>
          <label className="label">
            Straße &amp; Nr.
            <input className="input" name="ship_street" autoComplete="street-address" required minLength={3} maxLength={120} />
          </label>
          <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
            <label className="label">
              PLZ
              <input className="input" name="ship_zip" autoComplete="postal-code" required maxLength={10} inputMode="text" />
            </label>
            <label className="label">
              Ort
              <input className="input" name="ship_city" autoComplete="address-level2" required maxLength={80} />
            </label>
          </div>
          <label className="label">
            Land
            <select className="input" name="ship_country" defaultValue={defaultCountry in COUNTRIES ? defaultCountry : "DE"}>
              {Object.entries(COUNTRIES).map(([code, flag]) => (
                <option key={code} value={code}>{flag} {COUNTRY_NAMES[code] ?? code}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="card grid gap-2 p-4 sm:p-5">
          <h2 className="text-xl font-extrabold">Bezahlung</h2>
          <p className="text-sm text-muted">
            Nach der Bestellung sendet dir die Verkäuferin die Zahlungsdetails im Chat. Deine Bestellung ist reserviert, bis die Zahlung bestätigt ist.
          </p>
        </section>
      </div>

      <aside className="card grid gap-4 p-4 sm:p-5 lg:sticky lg:top-20">
        <h2 className="text-xl font-extrabold">Übersicht</h2>
        <ul className="grid gap-1.5 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span className="min-w-0 truncate">{i.title} <span className="text-muted">· {i.seller_name}</span></span>
              <span className="shrink-0 tabular-nums">{eur(i.price_cents)}</span>
            </li>
          ))}
        </ul>
        <dl className="grid gap-1.5 border-t border-line pt-3 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Zwischensumme</dt><dd className="tabular-nums">{eur(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Versand ({sellers} {sellers === 1 ? "Paket" : "Pakete"})</dt><dd className="tabular-nums">{eur(shipping)}</dd></div>
          <div className="flex justify-between text-base font-bold"><dt>Gesamt</dt><dd className="tabular-nums">{eur(subtotal + shipping)}</dd></div>
        </dl>
        <p className="text-xs text-muted">Der endgültige Preis wird beim Bestellen geprüft.</p>

        <label className="flex items-start gap-2.5 text-sm">
          <input type="checkbox" name="adult" required className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]" />
          <span>Ich bestätige, dass ich mindestens 18 Jahre alt bin.</span>
        </label>

        {state.error && (
          <div role="alert" className="grid gap-2 rounded-xl border border-danger/40 p-3 text-sm">
            <p className="font-medium text-danger">{state.error}</p>
            <Link href="/warenkorb" className="font-semibold text-accent hover:underline">Zurück zum Warenkorb</Link>
          </div>
        )}

        <button className="btn-primary" disabled={pending}>{pending ? "Wird bestellt…" : "Verbindlich bestellen"}</button>
      </aside>
    </form>
  );
}
