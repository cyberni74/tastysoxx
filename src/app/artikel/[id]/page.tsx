import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getSession } from "@/lib/supabase/server";
import { fetchStats, LISTING_SELECT } from "@/lib/queries";
import { categoryById } from "@/lib/constants";
import { eur, wearLabel } from "@/lib/format";
import type { ListingWithSeller } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { Avatar, Flag, LastActive, SetupNotice, Stars, VerifiedBadge } from "@/components/Bits";
import { startConversation } from "@/app/nachrichten/actions";
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
  const { listing } = await loadListing(id);
  return { title: listing?.title ?? "Artikel" };
}

const STATUS_LABEL = { active: "Verfügbar", reserved: "Reserviert", sold: "Verkauft", hidden: "Ausgeblendet" } as const;

export default async function ArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user, listing } = await loadListing(id);

  if (!supabase) {
    return (
      <div className="wrap py-12">
        <h1 className="mb-6 text-3xl font-extrabold">Artikel</h1>
        <SetupNotice />
      </div>
    );
  }
  if (!listing) notFound();

  const cat = categoryById(listing.category);
  const seller = listing.seller;
  const isOwner = !!user && user.id === listing.seller_id;

  const [statsMap, moreRes] = await Promise.all([
    fetchStats(supabase, [listing.seller_id]),
    supabase.from("listings").select(LISTING_SELECT).eq("seller_id", listing.seller_id).eq("status", "active")
      .neq("id", listing.id).order("created_at", { ascending: false }).limit(4),
  ]);
  const stats = statsMap.get(listing.seller_id);
  const more = (moreRes.data ?? []) as unknown as ListingWithSeller[];

  return (
    <div className="wrap flex flex-col gap-12 py-8 sm:py-12">
      <nav aria-label="Brotkrumen" className="text-sm text-muted">
        <Link href="/shop" className="hover:text-fg">Shop</Link>
        {cat && <> / <Link href={`/shop?kat=${cat.id}`} className="hover:text-fg">{cat.name}</Link></>}
      </nav>

      <article className="grid gap-8 md:grid-cols-2 md:gap-10">
        <Gallery images={listing.images} title={listing.title} hue={cat?.hue ?? 165} />

        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${listing.status === "active" ? "bg-accent-soft text-accent" : "bg-fg text-bg"}`}>
              {STATUS_LABEL[listing.status]}
            </span>
            <h1 className="text-3xl font-extrabold break-words sm:text-4xl">{listing.title}</h1>
            <p className="font-display text-3xl font-bold tabular-nums">{eur(listing.price_cents)}</p>
            <p className="text-sm text-muted">zzgl. Versand</p>
          </div>

          <dl className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-xl bg-surface-2 p-3"><dt className="text-muted">Kategorie</dt><dd className="font-semibold">{cat?.name ?? listing.category}</dd></div>
            <div className="rounded-xl bg-surface-2 p-3"><dt className="text-muted">Material</dt><dd className="font-semibold">{listing.material}</dd></div>
            <div className="rounded-xl bg-surface-2 p-3"><dt className="text-muted">Getragen</dt><dd className="font-semibold">{wearLabel(listing.wear_days)}</dd></div>
          </dl>

          <BuyBox
            item={{
              id: listing.id,
              title: listing.title,
              price_cents: listing.price_cents,
              image: listing.images[0] ?? null,
              seller_id: listing.seller_id,
              seller_name: seller?.username ?? "Verkäuferin",
            }}
            available={listing.status === "active"}
            isOwner={isOwner}
          />

          {listing.description && (
            <section aria-labelledby="beschr-h">
              <h2 id="beschr-h" className="mb-2 text-lg font-bold">Beschreibung</h2>
              <p className="whitespace-pre-line break-words text-muted">{listing.description}</p>
            </section>
          )}

          {seller && (
            <section aria-labelledby="vk-h" className="card flex flex-col gap-4 p-4">
              <h2 id="vk-h" className="sr-only">Verkäuferin</h2>
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
                  <button type="submit" className="btn-ghost w-full">Verkäuferin anschreiben</button>
                </form>
              )}
            </section>
          )}
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="mehr-h">
          <h2 id="mehr-h" className="mb-5 text-2xl font-bold">Weitere Artikel von {seller?.username ?? "dieser Verkäuferin"}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {more.map((l) => <ListingCard key={l.id} l={l} />)}
          </div>
        </section>
      )}
    </div>
  );
}
