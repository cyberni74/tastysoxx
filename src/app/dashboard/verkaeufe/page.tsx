import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";
import { autoConfirmDate, date, eur } from "@/lib/format";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";
import { Empty, SetupNotice } from "@/components/Bits";
import { OrderActions } from "./OrderActions";
import { getT } from "@/i18n/server";
import { seller } from "@/i18n/messages/seller";
import { common } from "@/i18n/messages/common";
import { INTL } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(seller);
  return { title: t("meta.sales") };
}
export const dynamic = "force-dynamic";

type Row = Order & { items: OrderItem[] | null; buyer: { username: string } | null };

const PILL: Record<OrderStatus, string> = {
  pending_payment: "bg-accent-soft text-accent",
  paid: "bg-accent text-accent-fg",
  shipped: "bg-surface-2 text-fg",
  completed: "bg-fg text-bg",
  cancelled: "border border-line text-muted",
};


export default async function SalesPage() {
  const { supabase, user, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/dashboard/verkaeufe");
  if (profile?.role !== "seller") redirect("/dashboard");
  const { t, locale } = await getT(seller);
  const { t: tc } = await getT(common);
  const dateFmt = new Intl.DateTimeFormat(INTL[locale], { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" });

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
        <Link href="/dashboard" className="text-sm text-muted hover:text-accent">{t("back.dashboard")}</Link>
        <h1 className="mt-1 text-3xl font-extrabold">{t("sales.title")}</h1>
        <p className="mt-1 text-sm text-muted">
          {t("sales.intro")}
        </p>
      </div>

      {orders.length === 0 ? (
        <Empty>{t("sales.empty")}</Empty>
      ) : (
        <ul className="grid gap-4">
          {orders.map((o) => {
            const convId = o.buyer_id ? convByBuyer.get(o.buyer_id) : undefined;
            return (
              <li key={o.id} className="card grid gap-4 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-display text-lg font-bold">{o.number}</div>
                    <div className="text-sm text-muted">
                      {dateFmt.format(new Date(o.created_at))} · {t("sales.from")} <b className="text-fg">{o.buyer?.username ?? t("unknown")}</b>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${PILL[o.status]}`}>{tc(`status.${o.status}`)}</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid content-start gap-1 text-sm">
                    <div className="eyebrow mb-1">{t("sales.items")}</div>
                    {(o.items ?? []).map((it, i) => (
                      <div key={`${it.listing_id ?? "x"}-${i}`} className="flex justify-between gap-3">
                        <span className="min-w-0 truncate">{it.title}</span>
                        <span className="shrink-0 tabular-nums">{eur(it.price_cents, locale)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-3 text-muted">
                      <span>{t("sales.shipping")}</span><span className="tabular-nums">{eur(o.shipping_cents, locale)}</span>
                    </div>
                    <div className="mt-1 flex justify-between gap-3 border-t border-line pt-1 font-semibold">
                      <span>{t("sales.total")}</span><span className="tabular-nums">{eur(o.subtotal_cents + o.shipping_cents, locale)}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="eyebrow mb-1">{t("sales.address")}</div>
                    <address className="rounded-xl bg-surface-2 p-3 not-italic leading-relaxed break-words">
                      {o.ship_name}<br />
                      {o.ship_street}<br />
                      {o.ship_zip} {o.ship_city}<br />
                      {o.ship_country}
                    </address>
                  </div>
                </div>

                {o.status === "shipped" && o.shipped_at && (
                  <p className="text-sm text-muted">{t("sales.autoConfirm", { date: date(autoConfirmDate(o.shipped_at)!.toISOString(), locale) })}</p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <OrderActions orderId={o.id} status={o.status} />
                  {convId && <Link href={`/nachrichten/${convId}`} className="btn-ghost btn-sm">{t("sales.message")}</Link>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
