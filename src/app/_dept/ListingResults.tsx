import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchListings, type ShopFilters as Filters } from "@/lib/queries";
import { departmentById } from "@/lib/constants";
import type { ListingWithSeller } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { Empty, SetupNotice } from "@/components/Bits";
import { getT } from "@/i18n/server";
import { browse } from "@/i18n/messages/browse";
import { common } from "@/i18n/messages/common";

/** Result count + listing grid + empty state, shared by /marktplatz and the department pages. */
export async function ListingResults({ supabase, filters, filtered, title }: {
  supabase: SupabaseClient | null; filters: Filters; filtered: boolean; title: string;
}) {
  const [{ t }, { t: tc }] = await Promise.all([getT(browse), getT(common)]);
  if (!supabase) return <SetupNotice />;

  let listings: ListingWithSeller[] = [];
  try {
    listings = await fetchListings(supabase, filters);
  } catch {
    return <Empty>{t("list.loadError")}</Empty>;
  }
  const dept = departmentById(filters.abteilung);

  return (
    <section aria-labelledby="ergebnis-h" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="ergebnis-h" className="text-2xl font-bold">{title}</h2>
        <p className="text-sm font-semibold text-muted tabular-nums" aria-live="polite">
          {listings.length === 1 ? t("list.countOne") : t("list.countMany", { n: listings.length })}
        </p>
      </div>
      {listings.length === 0 ? (
        <Empty>
          <p>{filtered ? t("list.emptyFiltered") : dept ? t("list.emptyDept") : t("list.empty")}</p>
          {dept && !filtered && (
            <Link href={dept.sellPath} className="btn-primary mt-4">{t("list.sellCta", { dept: tc(`deptShort.${dept.id}`) })}</Link>
          )}
        </Empty>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {listings.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
      )}
    </section>
  );
}
