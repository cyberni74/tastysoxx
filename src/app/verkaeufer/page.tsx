import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/supabase/server";
import { fetchStats } from "@/lib/queries";
import type { Profile, SellerStats } from "@/lib/types";
import { SellerCard } from "@/components/SellerCard";
import { Empty, SetupNotice } from "@/components/Bits";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Verkäuferinnen" };

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

function href(verifiziert: boolean, sort: string) {
  const p = new URLSearchParams();
  if (verifiziert) p.set("verifiziert", "1");
  if (sort !== "aktiv") p.set("sort", sort);
  const qs = p.toString();
  return qs ? `/verkaeufer?${qs}` : "/verkaeufer";
}

export default async function VerkaeuferPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const verifiziert = str(sp.verifiziert) === "1";
  const sort = str(sp.sort) === "bewertungen" ? "bewertungen" : "aktiv";

  const { supabase } = await getSession();
  let sellers: Profile[] = [];
  let stats = new Map<string, SellerStats>();
  if (supabase) {
    let query = supabase.from("profiles").select("*").eq("role", "seller");
    if (verifiziert) query = query.eq("verified", true);
    const { data } = await query.order("last_active", { ascending: false }).limit(60);
    sellers = (data ?? []) as Profile[];
    stats = await fetchStats(supabase, sellers.map((s) => s.id));
    if (sort === "bewertungen") {
      sellers = [...sellers].sort((a, b) => {
        const sa = stats.get(a.id), sb = stats.get(b.id);
        return (sb?.review_count ?? 0) - (sa?.review_count ?? 0) || Number(sb?.rating ?? 0) - Number(sa?.rating ?? 0);
      });
    }
  }

  return (
    <div className="wrap flex flex-col gap-6 py-8 sm:py-12">
      <header>
        <p className="eyebrow">Verkäuferinnen</p>
        <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Verkäuferinnen entdecken</h1>
        <p className="mt-2 max-w-2xl text-muted">Sieh dir Profile, Bewertungen und Angebote an und schreib Verkäuferinnen direkt an.</p>
      </header>

      <nav aria-label="Filter" className="flex flex-wrap gap-2">
        <Link href={href(false, sort)} aria-current={!verifiziert ? "true" : undefined} className={!verifiziert ? "chip-on" : "chip"}>Alle</Link>
        <Link href={href(true, sort)} aria-current={verifiziert ? "true" : undefined} className={verifiziert ? "chip-on" : "chip"}>Nur verifizierte</Link>
        <span className="mx-1 hidden w-px self-stretch bg-line sm:block" aria-hidden />
        <Link href={href(verifiziert, "aktiv")} aria-current={sort === "aktiv" ? "true" : undefined} className={sort === "aktiv" ? "chip-on" : "chip"}>Zuletzt aktiv</Link>
        <Link href={href(verifiziert, "bewertungen")} aria-current={sort === "bewertungen" ? "true" : undefined} className={sort === "bewertungen" ? "chip-on" : "chip"}>Meiste Bewertungen</Link>
      </nav>

      {!supabase ? <SetupNotice /> : sellers.length === 0 ? (
        <Empty>{verifiziert ? "Noch keine verifizierten Verkäuferinnen." : "Noch keine Verkäuferinnen registriert."}</Empty>
      ) : (
        <section aria-labelledby="vk-liste-h">
          <h2 id="vk-liste-h" className="mb-3 font-sans text-sm font-semibold text-muted tabular-nums">
            {sellers.length === 1 ? "1 Verkäuferin" : `${sellers.length} Verkäuferinnen`}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {sellers.map((p) => {
              const s = stats.get(p.id);
              return <SellerCard key={p.id} p={p} rating={Number(s?.rating ?? 0)} count={s?.review_count ?? 0} />;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
