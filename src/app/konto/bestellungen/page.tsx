import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Empty, SetupNotice } from "@/components/Bits";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { eur } from "@/lib/format";
import { getSession } from "@/lib/supabase/server";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";
import { OrderActions, ReviewForm } from "./OrderActions";

export const metadata: Metadata = { title: "Meine Bestellungen", robots: { index: false } };
export const dynamic = "force-dynamic";

type OrderRow = Order & {
  order_items: OrderItem[];
  seller: { username: string } | null;
};

const PILL: Record<OrderStatus, string> = {
  pending_payment: "bg-accent-soft text-fg",
  paid: "bg-surface-2 text-fg",
  shipped: "bg-surface-2 text-fg",
  completed: "bg-ok text-white",
  cancelled: "bg-surface-2 text-muted line-through",
};

const HINT: Partial<Record<OrderStatus, string>> = {
  pending_payment: "Die Verkäuferin schickt dir die Zahlungsdetails im Chat.",
  paid: "Zahlung bestätigt. Die Verkäuferin bereitet den Versand vor.",
  shipped: "Unterwegs zu dir. Bitte bestätige den Erhalt, sobald das Paket da ist.",
};

const dateFmt = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function OrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { supabase, user } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/konto/bestellungen");

  const [{ data: orderData, error }, { data: reviewData }] = await Promise.all([
    supabase
      .from("orders")
      .select("*, order_items(*), seller:profiles!orders_seller_id_fkey(username)")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("reviews").select("order_id").eq("buyer_id", user.id),
  ]);
  const orders = (orderData ?? []) as OrderRow[];
  const reviewed = new Set(((reviewData ?? []) as { order_id: string }[]).map((r) => r.order_id));

  return (
    <div className="wrap max-w-3xl py-8 sm:py-12">
      <Link href="/konto" className="text-sm font-semibold text-muted hover:text-fg">← Mein Konto</Link>
      <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Meine Bestellungen</h1>

      {sp.neu === "1" && (
        <p role="status" className="mt-6 rounded-2xl border border-ok/40 bg-accent-soft p-4 font-medium">
          Bestellung aufgegeben. Die Verkäuferin meldet sich mit den Zahlungsdetails im Chat.
        </p>
      )}

      {error && <p role="alert" className="mt-6 text-danger">Bestellungen konnten nicht geladen werden. Bitte lade die Seite neu.</p>}

      {!error && orders.length === 0 && (
        <div className="mt-6">
          <Empty>
            Du hast noch nichts bestellt.{" "}
            <Link href="/shop" className="font-semibold text-accent hover:underline">Zum Shop</Link>
          </Empty>
        </div>
      )}

      <ul className="mt-6 grid gap-4">
        {orders.map((o) => {
          const sellerName = o.seller?.username ?? "Verkäuferin";
          return (
            <li key={o.id} className="card grid gap-4 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-display text-lg font-bold">{o.number}</div>
                  <div className="text-sm text-muted">
                    {dateFmt.format(new Date(o.created_at))} · bei{" "}
                    {o.seller ? <Link href={`/verkaeufer/${encodeURIComponent(sellerName)}`} className="font-semibold text-fg hover:underline">{sellerName}</Link> : sellerName}
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${PILL[o.status]}`}>{ORDER_STATUS_LABEL[o.status]}</span>
              </div>

              <ul className="grid gap-1.5 text-sm">
                {o.order_items.map((it) => (
                  <li key={it.listing_id} className="flex justify-between gap-3">
                    <Link href={`/artikel/${it.listing_id}`} className="min-w-0 truncate hover:underline">{it.title}</Link>
                    <span className="shrink-0 tabular-nums">{eur(it.price_cents)}</span>
                  </li>
                ))}
              </ul>

              <dl className="grid gap-1 border-t border-line pt-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Zwischensumme</dt><dd className="tabular-nums">{eur(o.subtotal_cents)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Versand</dt><dd className="tabular-nums">{eur(o.shipping_cents)}</dd></div>
                <div className="flex justify-between font-bold"><dt>Gesamt</dt><dd className="tabular-nums">{eur(o.subtotal_cents + o.shipping_cents)}</dd></div>
              </dl>

              {HINT[o.status] && <p className="text-sm text-muted">{HINT[o.status]}</p>}

              <div className="flex flex-wrap items-center gap-3">
                <OrderActions orderId={o.id} status={o.status} />
                {o.status !== "cancelled" && (
                  <Link href="/nachrichten" className="text-sm font-semibold text-accent hover:underline">Zum Chat</Link>
                )}
              </div>

              {o.status === "completed" && !reviewed.has(o.id) && <ReviewForm orderId={o.id} sellerName={sellerName} />}
              {o.status === "completed" && reviewed.has(o.id) && <p className="text-sm text-muted">Bewertet – danke!</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
