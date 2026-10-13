import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getSession } from "@/lib/supabase/server";
import { fetchStats, LISTING_SELECT } from "@/lib/queries";
import { SHIPPING_CENTS, categoryById, departmentById } from "@/lib/constants";
import { eur, wearLabel } from "@/lib/format";
import { pageMeta, SITE_URL } from "@/lib/seo";
import type { ListingWithSeller } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { Avatar, Flag, LastActive, SetupNotice, Stars, VerifiedBadge } from "@/components/Bits";
import { startConversation } from "@/app/nachrichten/actions";
import { JsonLd, breadcrumbLd } from "@/app/_dept/JsonLd";
import { getT } from "@/i18n/server";
import { browse } from "@/i18n/messages/browse";
import { common } from "@/i18n/messages/common";
import { BuyBox } from "./BuyBox";
import { Gallery } from "./Gallery";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const loadListing = cache(async (id: string) => {
  const session = await getSession();
  if (!session.supabase || !UUID.test(id)) return { ...session, listing: null };
  const { data } = await session.supabase.from("listings").select(LISTING_SELECT).eq("id", id).maybeSingle();
  return { ...session, listing: (data as unknown as ListingWithSeller | null) ?? null };
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const [{ listing }, { t, locale }, { t: tc }] = await Promise.all([loadListing(id), getT(browse), getT(common)]);
  if (!listing) return pageMeta({ title: t("item.metaFallback"), path: `/artikel/${id}`, noindex: true });
  return pageMeta({
    title: listing.title,
    description: t("item.metaDesc", {
      title: listing.title,
      cat: tc(`cat.${listing.category}`),
      price: eur(listing.price_cents, locale),
      wear: wearLabel(listing.wear_days),
      seller: listing.seller?.username ?? t("item.seller"),
    }),
    path: `/artikel/${listing.id}`,
    noindex: listing.status === "hidden" || listing.status === "sold",
  });
}

export default async function ArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ supabase, user, listing }, { t, locale }, { t: tc }] = await Promise.all([loadListing(id), getT(browse), getT(common)]);

  if (!supabase) {
    return (
      <div className="wrap py-12">
        <h1 className="mb-6 text-3xl font-extrabold">{t("item.metaFallback")}</h1>
        <SetupNotice />
      </div>
    );
  }
  if (!listing) notFound();

  const cat = categoryById(listing.category);
  const dept = departmentById(listing.department ?? cat?.dept);
  const seller = listing.seller;
  const isOwner = !!user && user.id === listing.seller_id;
  const url = `${SITE_URL}/artikel/${listing.id}`;

  const [statsMap, moreRes] = await Promise.all([
    fetchStats(supabase, [listing.seller_id]),
    supabase.from("listings").select(LISTING_SELECT).eq("seller_id", listing.seller_id).eq("status", "active")
      .neq("id", listing.id).order("created_at", { ascending: false }).limit(4),
  ]);
  const stats = statsMap.get(listing.seller_id);
  const more = (moreRes.data ?? []) as unknown as ListingWithSeller[];

  const crumbs = [
    { name: tc("nav.marketplace"), href: "/marktplatz" },
    ...(dept ? [{ name: tc(`deptShort.${dept.id}`), href: dept.path }] : []),
    ...(dept && cat ? [{ name: tc(`cat.${cat.id}`), href: `${dept.path}?kat=${cat.id}` }] : []),
  ];

  const details: { k: string; v: string }[] = [
    ...(dept ? [{ k: t("item.department"), v: tc(`deptShort.${dept.id}`) }] : []),
    { k: t("item.category"), v: tc(`cat.${listing.category}`) },
    ...(listing.size ? [{ k: tc("size"), v: listing.size }] : []),
    ...(listing.color ? [{ k: tc("color"), v: tc(`color.${listing.color}`) }] : []),
    { k: tc("condition"), v: tc(`cond.${listing.condition}`) },
    { k: tc("material"), v: tc(`mat.${listing.material}`) },
    { k: t("item.worn"), v: wearLabel(listing.wear_days) },
  ];

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    ...(listing.description ? { description: listing.description } : {}),
    ...(listing.images.length ? { image: listing.images } : {}),
    category: tc(`cat.${listing.category}`),
    offers: {
      "@type": "Offer",
      price: (listing.price_cents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: listing.status === "active" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      url,
      ...(seller ? { seller: { "@type": "Person", name: seller.username } } : {}),
    },
  };

  return (
    <div className="wrap flex flex-col gap-12 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd([
        { name: t("crumb.home"), url: `${SITE_URL}/` },
        ...crumbs.map((c) => ({ name: c.name, url: `${SITE_URL}${c.href}` })),
        { name: listing.title, url },
      ])} />
      <JsonLd data={productLd} />

      <nav aria-label={t("item.breadcrumb")} className="text-sm text-muted">
        <ol className="flex flex-wrap gap-1.5">
          {crumbs.map((c) => (
            <li key={c.href}><Link href={c.href} className="hover:text-fg">{c.name}</Link> /</li>
          ))}
          <li aria-current="page" className="min-w-0 truncate text-fg">{listing.title}</li>
        </ol>
      </nav>

      <article className="grid gap-8 md:grid-cols-2 md:gap-10">
        <Gallery images={listing.images} title={listing.title} hue={cat?.hue ?? 165} />

        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${listing.status === "active" ? "bg-accent-soft text-accent" : "bg-fg text-bg"}`}>
              {listing.status === "active" ? t("item.statusActive") : tc(`listing.${listing.status}`)}
            </span>
            <h1 className="break-words text-3xl font-extrabold sm:text-4xl">{listing.title}</h1>
            <p className="font-display text-3xl font-bold tabular-nums">{eur(listing.price_cents, locale)}</p>
            <p className="text-sm text-muted">{t("item.shipping", { price: eur(SHIPPING_CENTS, locale) })}</p>
          </div>

          <section aria-labelledby="details-h">
            <h2 id="details-h" className="sr-only">{t("item.details")}</h2>
            <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              {details.map((d) => (
                <div key={d.k} className="min-w-0 rounded-xl bg-surface-2 p-3">
                  <dt className="text-muted">{d.k}</dt>
                  <dd className="break-words font-semibold">{d.v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <BuyBox
            item={{
              id: listing.id,
              title: listing.title,
              price_cents: listing.price_cents,
              image: listing.images[0] ?? null,
              seller_id: listing.seller_id,
              seller_name: seller?.username ?? t("item.seller"),
            }}
            available={listing.status === "active"}
            isOwner={isOwner}
          />

          {listing.description && (
            <section aria-labelledby="beschr-h">
              <h2 id="beschr-h" className="mb-2 text-lg font-bold">{t("item.description")}</h2>
              <p className="whitespace-pre-line break-words text-muted">{listing.description}</p>
            </section>
          )}

          {seller && (
            <section aria-labelledby="vk-h" className="card flex flex-col gap-4 p-4">
              <h2 id="vk-h" className="sr-only">{t("item.seller")}</h2>
              <Link href={`/verkaeufer/${seller.username}`} className="flex items-center gap-3.5 hover:text-accent">
                <Avatar url={seller.avatar_url} name={seller.username} size={56} />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <b className="truncate">{seller.username}</b>
                    {seller.verified && <VerifiedBadge />}
                    <Flag country={seller.country} />
                  </div>
                  <Stars rating={Number(stats?.rating ?? 0)} count={stats?.review_count ?? 0} />
                  <LastActive iso={seller.last_active} />
                </div>
              </Link>
              {!isOwner && (
                <form action={startConversation.bind(null, listing.seller_id, listing.id)}>
                  <button type="submit" className="btn-ghost w-full">{t("item.contact")}</button>
                </form>
              )}
            </section>
          )}

          {!isOwner && (
            <p className="text-sm">
              <Link href={`/melden?artikel=${listing.id}`} rel="nofollow" className="text-muted underline-offset-2 hover:text-danger hover:underline">
                ⚑ {t("item.report")}
              </Link>
            </p>
          )}
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="mehr-h">
          <h2 id="mehr-h" className="mb-5 text-2xl font-bold">{t("item.moreFrom", { name: seller?.username ?? t("item.seller") })}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {more.map((l) => <ListingCard key={l.id} l={l} />)}
          </div>
        </section>
      )}
    </div>
  );
}
