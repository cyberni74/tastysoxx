import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/supabase/server";
import { fetchListings, fetchStats } from "@/lib/queries";
import { DEPARTMENTS } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";
import { getT } from "@/i18n/server";
import { browse } from "@/i18n/messages/browse";
import { common } from "@/i18n/messages/common";
import type { ListingWithSeller, Profile, SellerStats } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { SellerCard } from "@/components/SellerCard";
import { Empty, SetupNotice } from "@/components/Bits";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(browse);
  return pageMeta({ title: t("home.metaTitle"), description: t("home.metaDesc"), path: "/", absoluteTitle: true });
}

const FEATURES = [
  { key: "f1", icon: <path d="M3 7h18v10H3zM3 11h18M7 15h3" /> },
  { key: "f2", icon: <path d="M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8" /> },
  { key: "f3", icon: <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5" /> },
  { key: "f4", icon: <path d="M12 3v18M17 7.5c-.8-1.5-2.6-2.5-5-2.5-2.8 0-4.5 1.4-4.5 3.3 0 4.4 10 2.2 10 6.9 0 2-1.9 3.3-5 3.3-2.6 0-4.5-1.1-5.3-2.7" /> },
] as const;

const STEPS = ["s1", "s2", "s3", "s4", "s5"] as const;

async function loadHome() {
  const { supabase } = await getSession();
  if (!supabase) return null;
  try {
    const [listings, sellersRes] = await Promise.all([
      fetchListings(supabase, {}, 8),
      supabase.from("profiles").select("*").eq("role", "seller").order("last_active", { ascending: false }).limit(4),
    ]);
    const sellers = (sellersRes.data ?? []) as Profile[];
    const stats = await fetchStats(supabase, sellers.map((s) => s.id));
    return { listings, sellers, stats };
  } catch {
    return { listings: [] as ListingWithSeller[], sellers: [] as Profile[], stats: new Map<string, SellerStats>() };
  }
}

export default async function Home() {
  const [data, { t }, { t: tc }] = await Promise.all([loadHome(), getT(browse), getT(common)]);

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="wrap grid items-center gap-8 pb-10 pt-5 md:grid-cols-[1.15fr_1fr] md:gap-10 md:pb-16 md:pt-10">
        <div className="flex flex-col gap-5">
          <p className="eyebrow">{t("home.eyebrow")}</p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {t("home.heroBefore")}<span className="text-accent">{t("home.heroAccent")}</span>{t("home.heroAfter")}
          </h1>
          <p className="max-w-xl text-lg text-muted">
            {t("home.lead")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/marktplatz" className="btn-primary">{t("home.ctaBuy")}</Link>
            <Link href="/verkaufen" className="btn-ghost">{t("home.ctaSell")}</Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg overflow-x-clip md:overflow-visible">
          <div aria-hidden className="pointer-events-none absolute -left-6 top-1/4 size-48 rounded-full bg-blue/40 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -right-6 top-1/3 size-48 rounded-full bg-accent/40 blur-3xl" />
          <Image src="/brand/logo-768.webp" alt={t("home.logoAlt")} width={768} height={512} priority className="relative h-auto w-full max-w-full rounded-3xl" />
        </div>
      </section>

      {/* Feature strip */}
      <section aria-label={t("home.featuresLabel")} className="border-y border-line bg-surface">
        <ul className="wrap grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <li key={f.key} className="flex gap-3">
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${i % 2 ? "bg-blue/15 text-blue" : "bg-accent-soft text-accent"}`}>
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {f.icon}
                </svg>
              </span>
              <div>
                <h2 className="font-sans text-base font-semibold">{t(`home.${f.key}Title`)}</h2>
                <p className="text-sm text-muted">{t(`home.${f.key}Text`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Promo band */}
      <section className="wrap pt-12">
        <div className="relative isolate flex flex-col items-start gap-4 overflow-hidden rounded-3xl bg-accent px-6 py-8 text-accent-fg sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-16">
          {/* decorative photo at 25 % opacity, text stays on top */}
          <Image src="/images/mit-verkaeuferinnen-chatten-getragene-waesche.webp" alt="" aria-hidden width={1024} height={541}
            sizes="(min-width: 1180px) 1152px, 100vw"
            className="pointer-events-none absolute inset-0 -z-10 size-full object-cover object-[50%_28%] opacity-25" />
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{t("home.promoTitle")}</h2>
            <p className="mt-1 opacity-85">{t("home.promoText")}</p>
          </div>
          <Link href="/verkaeufer" className="btn shrink-0 bg-accent-fg text-accent hover:opacity-90">{t("home.promoCta")}</Link>
        </div>
      </section>

      {/* Departments */}
      <section className="wrap pt-12" aria-labelledby="abt-h">
        <h2 id="abt-h" className="mb-5 text-2xl font-bold sm:text-3xl">{t("home.deptsTitle")}</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {DEPARTMENTS.map((d) => (
            <li key={d.id} className="card flex flex-col overflow-hidden">
              <Link href={d.path} className="group relative block aspect-[16/9] overflow-hidden">
                <Image src={d.image.src} alt={tc(`deptImg.${d.id}`)} width={d.image.width} height={d.image.height} sizes="(min-width: 1180px) 380px, (min-width: 640px) 33vw, 100vw"
                  className="absolute inset-0 size-full object-cover transition duration-300 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-black/30 px-3.5 py-3 font-display text-xl font-bold text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.55)]">
                  {tc(`dept.${d.id}`)}
                </span>
              </Link>
              <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 text-sm font-semibold">
                <Link href={d.path} className="text-accent hover:underline">{t("home.deptBrowse")} →</Link>
                <Link href={d.sellPath} className="text-blue hover:underline">{t("home.deptSell", { dept: tc(`deptShort.${d.id}`) })}</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* New listings */}
      <section className="wrap pt-12" aria-labelledby="neu-h">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 id="neu-h" className="text-2xl font-bold sm:text-3xl">{t("home.newTitle")}</h2>
          <Link href="/marktplatz" className="text-sm font-semibold text-accent hover:underline">{t("home.allListings")}</Link>
        </div>
        {!data ? <SetupNotice /> : data.listings.length === 0 ? (
          <Empty>{t("home.noListings")}</Empty>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {data.listings.map((l) => <ListingCard key={l.id} l={l} />)}
          </div>
        )}
      </section>

      {/* Active sellers */}
      <section className="wrap pt-12" aria-labelledby="aktiv-h">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 id="aktiv-h" className="text-2xl font-bold sm:text-3xl">{t("home.activeTitle")}</h2>
          <Link href="/verkaeufer" className="text-sm font-semibold text-blue hover:underline">{t("home.allSellers")}</Link>
        </div>
        {!data ? <SetupNotice /> : data.sellers.length === 0 ? (
          <Empty>{t("home.noSellers")}</Empty>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.sellers.map((p) => {
              const s = data.stats.get(p.id);
              return <SellerCard key={p.id} p={p} rating={Number(s?.rating ?? 0)} count={s?.review_count ?? 0} />;
            })}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="wrap pt-12" aria-labelledby="sofunk-h">
        <h2 id="sofunk-h" className="mb-5 text-2xl font-bold sm:text-3xl">{t("home.howTitle")}</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s} className="card flex flex-col gap-2 p-5">
              <span className={`grid size-8 place-items-center rounded-full font-display font-bold tabular-nums ${i % 2 ? "bg-blue/15 text-blue" : "bg-accent-soft text-accent"}`}>{i + 1}</span>
              <h3 className="font-sans text-base font-semibold">{t(`home.${s}Title`)}</h3>
              <p className="text-sm text-muted">{t(`home.${s}Text`)}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
