import type { Metadata } from "next";
import { Suspense } from "react";
import { getSession } from "@/lib/supabase/server";
import { fetchListings, type ShopFilters as Filters } from "@/lib/queries";
import { categoryById } from "@/lib/constants";
import type { ListingWithSeller } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { Empty, SetupNotice } from "@/components/Bits";
import { ShopFilters } from "./ShopFilters";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Shop" };

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const filters: Filters = {
    kat: categoryById(str(sp.kat)) ? str(sp.kat) : undefined,
    q: str(sp.q),
    verifiziert: str(sp.verifiziert),
    dauer: str(sp.dauer),
    sort: str(sp.sort),
  };
  const cat = categoryById(filters.kat);

  const { supabase } = await getSession();
  let listings: ListingWithSeller[] = [];
  let failed = false;
  if (supabase) {
    try { listings = await fetchListings(supabase, filters); } catch { failed = true; }
  }
  const filtered = !!(filters.kat || filters.q || filters.verifiziert || filters.dauer);

  return (
    <div className="wrap flex flex-col gap-6 py-8 sm:py-12">
      <header>
        <p className="eyebrow">Shop</p>
        <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{cat ? cat.name : "Alle Angebote"}</h1>
      </header>

      <Suspense fallback={null}>
        <ShopFilters />
      </Suspense>

      {!supabase ? <SetupNotice /> : failed ? (
        <Empty>Die Angebote konnten gerade nicht geladen werden. Bitte versuche es gleich noch einmal.</Empty>
      ) : (
        <section aria-labelledby="ergebnis-h" className="flex flex-col gap-4">
          <h2 id="ergebnis-h" className="font-sans text-sm font-semibold text-muted tabular-nums" aria-live="polite">
            {listings.length === 1 ? "1 Angebot" : `${listings.length} Angebote`}
          </h2>
          {listings.length === 0 ? (
            <Empty>{filtered ? "Keine Angebote für diese Filter. Probier andere Einstellungen." : "Noch keine Angebote online."}</Empty>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
              {listings.map((l) => <ListingCard key={l.id} l={l} />)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
