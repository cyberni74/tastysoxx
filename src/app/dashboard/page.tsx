import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";
import { categoryById } from "@/lib/constants";
import { eur, wearLabel } from "@/lib/format";
import type { Listing, ListingStatus, Order } from "@/lib/types";
import { Empty, SetupNotice, Swatch } from "@/components/Bits";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const STATUS: Record<ListingStatus, { label: string; cls: string }> = {
  active: { label: "Aktiv", cls: "bg-accent-soft text-accent" },
  reserved: { label: "Reserviert", cls: "bg-surface-2 text-fg" },
  sold: { label: "Verkauft", cls: "bg-fg text-bg" },
  hidden: { label: "Versteckt", cls: "border border-line text-muted" },
};

export default async function DashboardPage() {
  const { supabase, user, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/dashboard");

  if (profile?.role !== "seller") {
    return (
      <div className="wrap max-w-xl py-10">
        <div className="card grid gap-3 p-6">
          <p className="eyebrow">Dashboard</p>
          <h1 className="text-2xl font-extrabold">Du bist noch nicht als Verkäuferin registriert</h1>
          <p className="text-muted">
            Das Dashboard ist für Verkäuferinnen. Stelle in deinem Konto die Rolle auf „Verkäuferin“ um,
            dann kannst du Artikel einstellen und Bestellungen verwalten.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/konto" className="btn-primary">Zum Konto</Link>
            <Link href="/verkaufen" className="btn-ghost">So funktioniert Verkaufen</Link>
          </div>
        </div>
      </div>
    );
  }

  const [{ data: listingsData }, { data: ordersData }] = await Promise.all([
    supabase.from("listings").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
    supabase.from("orders").select("status, subtotal_cents").eq("seller_id", user.id),
  ]);
  const listings = (listingsData ?? []) as Listing[];
  const orders = (ordersData ?? []) as Pick<Order, "status" | "subtotal_cents">[];

  const activeCount = listings.filter((l) => l.status === "active").length;
  const openOrders = orders.filter((o) => o.status === "pending_payment" || o.status === "paid").length;
  const revenue = orders
    .filter((o) => o.status === "paid" || o.status === "shipped" || o.status === "completed")
    .reduce((sum, o) => sum + o.subtotal_cents, 0);

  return (
    <div className="wrap grid gap-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="text-3xl font-extrabold">Hallo {profile.username}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/verkaeufe" className="btn-ghost">Verkäufe</Link>
          <Link href="/dashboard/artikel/neu" className="btn-primary">Neuer Artikel</Link>
        </div>
      </div>

      {!profile.verified && (
        <div className="rounded-2xl bg-accent-soft p-4 text-sm">
          <b>Noch nicht verifiziert.</b> Verifizierte Verkäuferinnen bekommen das blaue Häkchen und verkaufen
          deutlich mehr. Schreib uns über <Link href="/kontakt" className="font-semibold underline">Kontakt</Link>,
          um die Verifizierung zu starten.
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Stat label="Aktive Artikel" value={String(activeCount)} />
        <Stat label="Offene Bestellungen" value={String(openOrders)} href="/dashboard/verkaeufe" />
        <Stat label="Umsatz" value={eur(revenue)} />
      </div>

      <section className="grid gap-3">
        <h2 className="text-xl font-bold">Deine Artikel</h2>
        {listings.length === 0 ? (
          <Empty>
            Du hast noch keine Artikel eingestellt.{" "}
            <Link href="/dashboard/artikel/neu" className="font-semibold text-accent underline">Jetzt ersten Artikel anlegen</Link>
          </Empty>
        ) : (
          <ul className="card divide-y divide-line overflow-hidden">
            {listings.map((l) => {
              const cat = categoryById(l.category);
              const st = STATUS[l.status];
              return (
                <li key={l.id} className="flex items-center gap-3 p-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-xl">
                    {l.images[0]
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={l.images[0]} alt="" className="size-full object-cover" loading="lazy" />
                      : <Swatch hue={cat?.hue ?? 165} className="size-full" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{l.title}</div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                      <span className="font-semibold tabular-nums text-fg">{eur(l.price_cents)}</span>
                      <span>{cat?.short} · {wearLabel(l.wear_days)}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${st.cls}`}>{st.label}</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/artikel/${l.id}`} className="btn-ghost btn-sm shrink-0">Bearbeiten</Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <>
      <div className="text-xs text-muted sm:text-sm">{label}</div>
      <div className="mt-1 truncate font-display text-lg font-bold tabular-nums sm:text-2xl">{value}</div>
    </>
  );
  return href
    ? <Link href={href} className="card min-w-0 p-3 transition hover:border-accent sm:p-4">{inner}</Link>
    : <div className="card min-w-0 p-3 sm:p-4">{inner}</div>;
}
