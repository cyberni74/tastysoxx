import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { eur } from "@/lib/format";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";
import { Empty, SetupNotice } from "@/components/Bits";
import { OrderActions } from "./OrderActions";

export const metadata: Metadata = { title: "Verkäufe" };
export const dynamic = "force-dynamic";

type Row = Order & { items: OrderItem[] | null; buyer: { username: string } | null };

const PILL: Record<OrderStatus, string> = {
  pending_payment: "bg-accent-soft text-accent",
  paid: "bg-accent text-accent-fg",
  shipped: "bg-surface-2 text-fg",
  completed: "bg-fg text-bg",
  cancelled: "border border-line text-muted",
};

const dateFmt = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" });

export default async function SalesPage() {
  const { supabase, user, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/dashboard/verkaeufe");
  if (profile?.role !== "seller") redirect("/dashboard");

  const [{ data: ordersData }, { data: convData }] = await Promise.all([
    supabase.from("orders")
      .select("*, items:order_items(*), buyer:profiles!orders_buyer_id_fkey(username)")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("conversations").select("id, buyer_id").eq("seller_id", user.id),
  ]);
  const orders = (ordersData ?? []) as Row[];
  const convByBuyer = new Map(((convData ?? []) as { id: string; buyer_id: string }[]).map((c) => [c.buyer_id, c.id]));

  return (
    <div className="wrap grid max-w-4xl gap-5 py-8">
      <div>
        <Link href="/dashboard" className="text-sm text-muted hover:text-accent">← Dashboard</Link>
        <h1 className="mt-1 text-3xl font-extrabold">Verkäufe</h1>
        <p className="mt-1 text-sm text-muted">
          Schick der Käuferin bzw. dem Käufer deine Zahlungsdetails im Chat. Sobald das Geld da ist: „Zahlung erhalten“, nach dem Versand: „Als versendet markieren“.
        </p>
      </div>

      {orders.length === 0 ? (
        <Empty>Noch keine Bestellungen. Sobald jemand kauft, erscheint die Bestellung hier.</Empty>
      ) : (
        <ul className="grid gap-4">
          {orders.map((o) => {
            const convId = convByBuyer.get(o.buyer_id);
            return (
              <li key={o.id} className="card grid gap-4 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-display text-lg font-bold">{o.number}</div>
                    <div className="text-sm text-muted">
                      {dateFmt.format(new Date(o.created_at))} · von <b className="text-fg">{o.buyer?.username ?? "Unbekannt"}</b>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${PILL[o.status]}`}>{ORDER_STATUS_LABEL[o.status]}</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid content-start gap-1 text-sm">
                    <div className="eyebrow mb-1">Artikel</div>
                    {(o.items ?? []).map((it) => (
                      <div key={it.listing_id} className="flex justify-between gap-3">
                        <span className="min-w-0 truncate">{it.title}</span>
                        <span className="shrink-0 tabular-nums">{eur(it.price_cents)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-3 text-muted">
                      <span>Versand</span><span className="tabular-nums">{eur(o.shipping_cents)}</span>
                    </div>
                    <div className="mt-1 flex justify-between gap-3 border-t border-line pt-1 font-semibold">
                      <span>Gesamt</span><span className="tabular-nums">{eur(o.subtotal_cents + o.shipping_cents)}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="eyebrow mb-1">Lieferadresse</div>
                    <address className="rounded-xl bg-surface-2 p-3 not-italic leading-relaxed break-words">
                      {o.ship_name}<br />
                      {o.ship_street}<br />
                      {o.ship_zip} {o.ship_city}<br />
                      {o.ship_country}
                    </address>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <OrderActions orderId={o.id} status={o.status} />
                  {convId && <Link href={`/nachrichten/${convId}`} className="btn-ghost btn-sm">Käufer anschreiben</Link>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
