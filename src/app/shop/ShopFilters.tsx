"use client";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, SORTS, WEAR_FILTERS } from "@/lib/constants";
import { useT } from "@/i18n/client";
import { browse } from "@/i18n/messages/browse";
import { common } from "@/i18n/messages/common";

export function ShopFilters() {
  const t = useT(browse);
  const tc = useT(common);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => setQ(params.get("q") ?? ""), [params]);

  const kat = params.get("kat") ?? "";
  const verifiziert = params.get("verifiziert") === "1";
  const dauer = params.get("dauer") ?? "";
  const sort = params.get("sort") ?? "neu";

  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  return (
    <div className="flex flex-col gap-4" aria-busy={pending}>
      <form
        role="search"
        onSubmit={(e) => { e.preventDefault(); update({ q: q.trim() || null }); }}
        className="flex gap-2"
      >
        <label htmlFor="shop-q" className="sr-only">{t("shop.searchLabel")}</label>
        <input id="shop-q" type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder={t("shop.searchPlaceholder")} className="input min-w-0 flex-1" />
        <button type="submit" className="btn-primary shrink-0">{t("shop.searchBtn")}</button>
      </form>

      <div className="-mx-4 overflow-x-auto px-4">
        <div role="group" aria-label={t("shop.category")} className="flex w-max gap-2">
          <button type="button" onClick={() => update({ kat: null })} aria-pressed={!kat} className={!kat ? "chip-on" : "chip"}>{t("shop.allChip")}</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" onClick={() => update({ kat: c.id })} aria-pressed={kat === c.id}
              className={kat === c.id ? "chip-on" : "chip"}>{tc(`cat.${c.id}`)}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex items-center gap-2 py-2.5 text-sm font-semibold">
          <input type="checkbox" checked={verifiziert} onChange={(e) => update({ verifiziert: e.target.checked ? "1" : null })}
            className="size-4 accent-[var(--accent)]" />
          {t("shop.onlyVerified")}
        </label>
        <label className="label min-w-[9rem] flex-1 sm:flex-none">
          {t("shop.wear")}
          <select value={dauer} onChange={(e) => update({ dauer: e.target.value || null })} className="input">
            <option value="">{t("shop.wearAll")}</option>
            {WEAR_FILTERS.map((w) => <option key={w.id} value={w.id}>{tc(`wear.${w.id}`)}</option>)}
          </select>
        </label>
        <label className="label min-w-[9rem] flex-1 sm:flex-none">
          {t("shop.sort")}
          <select value={sort} onChange={(e) => update({ sort: e.target.value === "neu" ? null : e.target.value })} className="input">
            {SORTS.map((s) => <option key={s.id} value={s.id}>{tc(`sort.${s.id}`)}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}
