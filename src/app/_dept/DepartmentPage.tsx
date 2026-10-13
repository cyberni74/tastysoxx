import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/supabase/server";
import { departmentById } from "@/lib/constants";
import { hasParams, pageMeta, SITE_URL } from "@/lib/seo";
import type { Department } from "@/lib/types";
import { getT } from "@/i18n/server";
import { browse } from "@/i18n/messages/browse";
import { common } from "@/i18n/messages/common";
import { ShopFilters } from "./ShopFilters";
import { ListingResults } from "./ListingResults";
import { JsonLd, breadcrumbLd } from "./JsonLd";
import { filtersFrom, isFiltered, type SearchParams } from "./listing-params";

const FAQ = ["1", "2", "3", "4"] as const;

export async function departmentMetadata(id: Department, searchParams: Promise<SearchParams>): Promise<Metadata> {
  const dept = departmentById(id)!;
  const [sp, { t }] = await Promise.all([searchParams, getT(browse)]);
  return pageMeta({
    title: t(`d.${id}.metaTitle`),
    description: t(`d.${id}.metaDesc`),
    path: dept.path,
    noindex: hasParams(sp),
  });
}

/** SEO landing page for one department: intro, filters, listings, FAQ. */
export async function DepartmentPage({ id, searchParams }: { id: Department; searchParams: Promise<SearchParams> }) {
  const dept = departmentById(id)!;
  const [sp, { supabase }, { t }, { t: tc }] = await Promise.all([searchParams, getSession(), getT(browse), getT(common)]);
  const filters = filtersFrom(sp, id);

  return (
    <div className="wrap flex flex-col gap-8 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd([
        { name: t("crumb.home"), url: `${SITE_URL}/` },
        { name: tc("nav.marketplace"), url: `${SITE_URL}/marktplatz` },
        { name: tc(`deptShort.${id}`), url: `${SITE_URL}${dept.path}` },
      ])} />

      <nav aria-label={t("item.breadcrumb")} className="text-sm text-muted">
        <ol className="flex flex-wrap gap-1.5">
          <li><Link href="/" className="hover:text-fg">{t("crumb.home")}</Link> /</li>
          <li><Link href="/marktplatz" className="hover:text-fg">{tc("nav.marketplace")}</Link> /</li>
          <li aria-current="page" className="text-fg">{tc(`deptShort.${id}`)}</li>
        </ol>
      </nav>

      <header className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{t(`d.${id}.title`)}</h1>
        <p className="text-lg text-muted">{t(`d.${id}.intro`)}</p>
      </header>

      <Suspense fallback={null}>
        <ShopFilters dept={id} />
      </Suspense>

      <ListingResults supabase={supabase} filters={filters} filtered={isFiltered(filters, id)} title={t("dept.listTitle")} />

      <section aria-labelledby="faq-h" className="flex max-w-3xl flex-col gap-3">
        <h2 id="faq-h" className="text-2xl font-bold">{t("dept.faqTitle")}</h2>
        {FAQ.map((n) => (
          <details key={n} className="card group p-4">
            <summary className="cursor-pointer font-semibold marker:text-accent">{t(`d.${id}.q${n}`)}</summary>
            <p className="mt-2 text-muted">{t(`d.${id}.a${n}`)}</p>
          </details>
        ))}
        <p className="text-sm text-muted">
          {t("dept.rules")}{" "}
          <Link href="/hilfe/angebotsregeln" className="font-semibold text-accent hover:underline">{t("dept.rulesLink")}</Link>
        </p>
      </section>
    </div>
  );
}
