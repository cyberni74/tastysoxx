import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/supabase/server";
import { DEPARTMENTS } from "@/lib/constants";
import { hasParams, pageMeta } from "@/lib/seo";
import Image from "next/image";
import { getT } from "@/i18n/server";
import { browse } from "@/i18n/messages/browse";
import { common } from "@/i18n/messages/common";
import { ShopFilters } from "@/app/_dept/ShopFilters";
import { ListingResults } from "@/app/_dept/ListingResults";
import { filtersFrom, isFiltered, type SearchParams } from "@/app/_dept/listing-params";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const [sp, { t }] = await Promise.all([searchParams, getT(browse)]);
  return pageMeta({ title: t("mp.metaTitle"), description: t("mp.metaDesc"), path: "/marktplatz", noindex: hasParams(sp) });
}

export default async function MarktplatzPage({ searchParams }: Props) {
  const [sp, { supabase }, { t }, { t: tc }] = await Promise.all([searchParams, getSession(), getT(browse), getT(common)]);
  const filters = filtersFrom(sp);

  return (
    <div className="wrap flex flex-col gap-8 py-8 sm:py-12">
      <header className="flex max-w-3xl flex-col gap-2">
        <p className="eyebrow">{t("mp.eyebrow")}</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{t("mp.title")}</h1>
        <p className="text-lg text-muted">{t("mp.lead")}</p>
      </header>

      <nav aria-label={t("mp.deptsLabel")}>
        <ul className="grid gap-3 sm:grid-cols-3">
          {DEPARTMENTS.map((d) => (
            <li key={d.id}>
              <Link href={d.path} className="group relative flex h-28 items-end overflow-hidden rounded-2xl sm:h-36">
                <Image src={d.image.src} alt={tc(`deptImg.${d.id}`)} width={d.image.width} height={d.image.height} sizes="(min-width: 1180px) 380px, (min-width: 640px) 33vw, 100vw"
                  className="absolute inset-0 size-full object-cover transition duration-300 group-hover:scale-105" />
                <span className="relative w-full bg-black/30 px-3.5 py-2.5 font-display text-lg font-bold text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.55)]">
                  {tc(`dept.${d.id}`)} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Suspense fallback={null}>
        <ShopFilters />
      </Suspense>

      <ListingResults supabase={supabase} filters={filters} filtered={isFiltered(filters)} title={t("mp.listTitle")} />
    </div>
  );
}
