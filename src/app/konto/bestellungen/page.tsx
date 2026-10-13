import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Empty, SetupNotice } from "@/components/Bits";
import { account } from "@/i18n/messages/account";
import { common } from "@/i18n/messages/common";
import { getT } from "@/i18n/server";
import { date, eur } from "@/lib/format";
import { getSession } from "@/lib/supabase/server";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";
import { OrderActions, ReviewForm } from "./OrderActions";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(account);
  return { title: t("orders.meta"), robots: { index: false } };
}

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

const HINT_KEY = {
  pending_payment: "orders.hint.pending_payment",
  paid: "orders.hint.paid",
  shipped: "orders.hint.shipped",
} as const;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { supabase, user } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/konto/bestellungen");
  const { t, locale } = await getT(account);
  const { t: tc } = await getT(common);

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
      <Link href="/konto" className="text-sm font-semibold text-muted hover:text-fg">{t("konto.back")}</Link>
      <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{t("orders.title")}</h1>

      {sp.neu === "1" && (
        <p role="status" className="mt-6 rounded-2xl border border-ok/40 bg-accent-soft p-4 font-medium">{t("orders.new")}</p>
      )}

      {error && <p role="alert" className="mt-6 text-danger">{t("orders.loadError")}</p>}

      {!error && orders.length === 0 && (
        <div className="mt-6">
          <Empty>
            {t("orders.empty")}{" "}
            <Link href="/shop" className="font-semibold text-accent hover:underline">{t("orders.toShop")}</Link>
          </Empty>
        </div>
      )}

      <ul className="mt-6 grid gap-4">
        {orders.map((o) => {
          const sellerName = o.seller?.username ?? t("orders.sellerFallback");
          const hint = o.status in HINT_KEY ? HINT_KEY[o.status as keyof typeof HINT_KEY] : null;
          return (
            <li key={o.id} className="card grid gap-4 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-display text-lg font-bold">{o.number}</div>
                  <div className="text-sm text-muted">
                    {date(o.created_at, locale)} · {t("orders.from")}{" "}
                    {o.seller ? <Link href={`/verkaeufer/${encodeURIComponent(sellerName)}`} className="font-semibold text-fg hover:underline">{sellerName}</Link> : sellerName}
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${PILL[o.status]}`}>{tc(`status.${o.status}`)}</span>
              </div>

              <ul className="grid gap-1.5 text-sm">
                {o.order_items.map((it) => (
                  <li key={it.listing_id} className="flex justify-between gap-3">
                    <Link href={`/artikel/${it.listing_id}`} className="min-w-0 truncate hover:underline">{it.title}</Link>
                    <span className="shrink-0 tabular-nums">{eur(it.price_cents, locale)}</span>
                  </li>
                ))}
              </ul>

              <dl className="grid gap-1 border-t border-line pt-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted">{t("orders.subtotal")}</dt><dd className="tabular-nums">{eur(o.subtotal_cents, locale)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">{t("orders.shipping")}</dt><dd className="tabular-nums">{eur(o.shipping_cents, locale)}</dd></div>
                <div className="flex justify-between font-bold"><dt>{t("orders.total")}</dt><dd className="tabular-nums">{eur(o.subtotal_cents + o.shipping_cents, locale)}</dd></div>
              </dl>

              {hint && <p className="text-sm text-muted">{t(hint)}</p>}

              <div className="flex flex-wrap items-center gap-3">
                <OrderActions orderId={o.id} status={o.status} />
                {o.status !== "cancelled" && (
                  <Link href="/nachrichten" className="text-sm font-semibold text-accent hover:underline">{t("orders.chat")}</Link>
                )}
              </div>

              {o.status === "completed" && !reviewed.has(o.id) && <ReviewForm orderId={o.id} sellerName={sellerName} />}
              {o.status === "completed" && reviewed.has(o.id) && <p className="text-sm text-muted">{t("orders.reviewed")}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
