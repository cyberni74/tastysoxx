import type { Metadata } from "next";
import { Suspense } from "react";
import { getSession } from "@/lib/supabase/server";
import { fetchListings, type ShopFilters as Filters } from "@/lib/queries";
import { categoryById } from "@/lib/constants";
import type { ListingWithSeller } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { Empty, SetupNotice } from "@/components/Bits";
import { ShopFilters } from "./ShopFilters";
import { getT } from "@/i18n/server";
import { browse } from "@/i18n/messages/browse";
import { common } from "@/i18n/messages/common";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(browse);
  return { title: t("shop.metaTitle") };
}

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
  const [{ t }, { t: tc }] = await Promise.all([getT(browse), getT(common)]);

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
        <p className="eyebrow">{t("shop.eyebrow")}</p>
        <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{cat ? tc(`cat.${cat.id}`) : t("shop.all")}</h1>
      </header>

      <Suspense fallback={null}>
        <ShopFilters />
      </Suspense>

      {!supabase ? <SetupNotice /> : failed ? (
        <Empty>{t("shop.loadError")}</Empty>
      ) : (
        <section aria-labelledby="ergebnis-h" className="flex flex-col gap-4">
          <h2 id="ergebnis-h" className="font-sans text-sm font-semibold text-muted tabular-nums" aria-live="polite">
            {listings.length === 1 ? t("shop.countOne") : t("shop.countMany", { n: listings.length })}
          </h2>
          {listings.length === 0 ? (
            <Empty>{filtered ? t("shop.emptyFiltered") : t("shop.empty")}</Empty>
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
