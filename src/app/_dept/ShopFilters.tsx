"use client";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  COLORS, CONDITIONS, DEPARTMENTS, MATERIALS, SIZE_HINTS, SORTS, WEAR_FILTERS, categoriesOf,
} from "@/lib/constants";
import type { Department } from "@/lib/types";
import { useT } from "@/i18n/client";
import { browse } from "@/i18n/messages/browse";
import { common } from "@/i18n/messages/common";

const FILTER_KEYS = ["abteilung", "kat", "material", "farbe", "groesse", "zustand", "dauer", "verifiziert", "q", "sort"];

/**
 * Filter bar for listing grids. Works on any base path (it keeps the current pathname).
 * With `dept` the department is fixed (landing pages); without it a department select is shown.
 */
export function ShopFilters({ dept }: { dept?: Department }) {
  const t = useT(browse);
  const tc = useT(common);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [size, setSize] = useState(params.get("groesse") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
    setSize(params.get("groesse") ?? "");
  }, [params]);

  const abteilung = dept ?? (DEPARTMENTS.some((d) => d.id === params.get("abteilung")) ? (params.get("abteilung") as Department) : undefined);
  const kat = params.get("kat") ?? "";
  const cats = abteilung ? categoriesOf(abteilung) : [];
  const get = (k: string) => params.get(k) ?? "";
  const sort = params.get("sort") ?? "neu";
  const active = FILTER_KEYS.some((k) => params.get(k));

  function hrefWith(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function update(changes: Record<string, string | null>) {
    startTransition(() => router.replace(hrefWith(changes), { scroll: false }));
  }

  return (
    <div className="flex flex-col gap-4" aria-busy={pending}>
      {cats.length > 0 && (
        <nav aria-label={t("f.category")} className="-mx-4 overflow-x-auto px-4">
          <ul className="flex w-max gap-2">
            <li>
              <Link href={hrefWith({ kat: null })} replace scroll={false} aria-current={!kat ? "true" : undefined}
                className={!kat ? "chip-on" : "chip"}>{t("f.all")}</Link>
            </li>
            {cats.map((c) => (
              <li key={c.id}>
                <Link href={hrefWith({ kat: c.id })} replace scroll={false} aria-current={kat === c.id ? "true" : undefined}
                  className={kat === c.id ? "chip-on" : "chip"}>{tc(`cat.${c.id}`)}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <form
        role="search"
        onSubmit={(e) => { e.preventDefault(); update({ q: q.trim() || null, groesse: size.trim() || null }); }}
        className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[2fr_1fr_auto]"
      >
        <label className="label col-span-2 sm:col-span-1">
          {t("f.searchLabel")}
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={t("f.searchPlaceholder")} className="input" />
        </label>
        <label className="label">
          {tc("size")}
          <input type="text" value={size} onChange={(e) => setSize(e.target.value)} maxLength={12}
            placeholder={t("f.sizePlaceholder", { hint: SIZE_HINTS[abteilung ?? "socken"] })} className="input" />
        </label>
        <button type="submit" className="btn-primary self-end">{t("f.apply")}</button>
      </form>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {!dept && (
          <label className="label">
            {t("f.department")}
            <select value={abteilung ?? ""} onChange={(e) => update({ abteilung: e.target.value || null, kat: null })} className="input">
              <option value="">{t("f.any")}</option>
              {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{tc(`deptShort.${d.id}`)}</option>)}
            </select>
          </label>
        )}
        <label className="label">
          {tc("color")}
          <select value={get("farbe")} onChange={(e) => update({ farbe: e.target.value || null })} className="input">
            <option value="">{t("f.any")}</option>
            {COLORS.map((c) => <option key={c} value={c}>{tc(`color.${c}`)}</option>)}
          </select>
        </label>
        <label className="label">
          {tc("material")}
          <select value={get("material")} onChange={(e) => update({ material: e.target.value || null })} className="input">
            <option value="">{t("f.any")}</option>
            {MATERIALS.map((m) => <option key={m} value={m}>{tc(`mat.${m}`)}</option>)}
          </select>
        </label>
        <label className="label">
          {tc("condition")}
          <select value={get("zustand")} onChange={(e) => update({ zustand: e.target.value || null })} className="input">
            <option value="">{t("f.any")}</option>
            {CONDITIONS.map((c) => <option key={c} value={c}>{tc(`cond.${c}`)}</option>)}
          </select>
        </label>
        <label className="label">
          {t("f.wear")}
          <select value={get("dauer")} onChange={(e) => update({ dauer: e.target.value || null })} className="input">
            <option value="">{t("f.any")}</option>
            {WEAR_FILTERS.map((w) => <option key={w.id} value={w.id}>{tc(`wear.${w.id}`)}</option>)}
          </select>
        </label>
        <label className="label">
          {t("f.sort")}
          <select value={sort} onChange={(e) => update({ sort: e.target.value === "neu" ? null : e.target.value })} className="input">
            {SORTS.map((s) => <option key={s.id} value={s.id}>{tc(`sort.${s.id}`)}</option>)}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={get("verifiziert") === "1"} onChange={(e) => update({ verifiziert: e.target.checked ? "1" : null })}
            className="size-4 accent-[var(--accent)]" />
          {t("f.onlyVerified")}
        </label>
        {active && (
          <Link href={pathname} replace scroll={false} className="text-sm font-semibold text-accent hover:underline">{t("f.reset")}</Link>
        )}
      </div>
    </div>
  );
}
