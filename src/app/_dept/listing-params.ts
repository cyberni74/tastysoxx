import type { ShopFilters as Filters } from "@/lib/queries";
import type { Department } from "@/lib/types";

export type SearchParams = Record<string, string | string[] | undefined>;

export const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

/** Reads the listing filters from the URL; `dept` pins the department on landing pages. */
export function filtersFrom(sp: SearchParams, dept?: Department): Filters {
  return {
    abteilung: dept ?? str(sp.abteilung),
    kat: str(sp.kat),
    material: str(sp.material),
    farbe: str(sp.farbe),
    groesse: str(sp.groesse),
    zustand: str(sp.zustand),
    dauer: str(sp.dauer),
    verifiziert: str(sp.verifiziert),
    q: str(sp.q),
    sort: str(sp.sort),
  };
}

/** True when anything narrows the result set (sort alone does not). */
export const isFiltered = (f: Filters, dept?: Department) =>
  !!((!dept && f.abteilung) || f.kat || f.material || f.farbe || f.groesse || f.zustand || f.dauer || f.verifiziert || f.q);
