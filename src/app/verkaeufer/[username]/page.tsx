import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getSession } from "@/lib/supabase/server";
import { fetchStats, LISTING_SELECT } from "@/lib/queries";
import type { ListingWithSeller, Profile, Review } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { Avatar, Empty, Flag, LastActive, SetupNotice, Stars, VerifiedBadge } from "@/components/Bits";
import { startConversation } from "@/app/nachrichten/actions";
import { date } from "@/lib/format";
import { BUILDS } from "@/lib/constants";
import { getT } from "@/i18n/server";
import { browse } from "@/i18n/messages/browse";
import { common } from "@/i18n/messages/common";

export const dynamic = "force-dynamic";

const loadSeller = cache(async (username: string) => {
  const session = await getSession();
  if (!session.supabase) return { ...session, seller: null };
  const { data } = await session.supabase.from("profiles").select("*").eq("username", username).maybeSingle<Profile>();
  return { ...session, seller: data && data.role === "seller" ? data : null };
});

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const [{ seller }, { t }] = await Promise.all([loadSeller(decodeURIComponent(username)), getT(browse)]);
  return { title: seller ? t("profile.metaTitle", { name: seller.username }) : t("profile.metaFallback") };
}

export default async function SellerProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const [{ supabase, user, seller }, { t, locale }, { t: tc }] = await Promise.all([
    loadSeller(decodeURIComponent(username)), getT(browse), getT(common),
  ]);

  if (!supabase) {
    return (
      <div className="wrap py-12">
        <h1 className="mb-6 text-3xl font-extrabold">{t("profile.metaFallback")}</h1>
        <SetupNotice />
      </div>
    );
  }
  if (!seller) notFound();

  const isSelf = user?.id === seller.id;
  const [statsMap, listingsRes, reviewsRes] = await Promise.all([
    fetchStats(supabase, [seller.id]),
    supabase.from("listings").select(LISTING_SELECT).eq("seller_id", seller.id).in("status", ["active", "reserved", "sold"])
      .order("created_at", { ascending: false }).limit(60),
    supabase.from("reviews").select("*").eq("seller_id", seller.id).order("created_at", { ascending: false }).limit(50),
  ]);
  const stats = statsMap.get(seller.id);
  const order = { active: 0, reserved: 1, sold: 2, hidden: 3 } as const;
  const listings = ((listingsRes.data ?? []) as unknown as ListingWithSeller[])
    .sort((a, b) => order[a.status] - order[b.status]);
  const reviews = (reviewsRes.data ?? []) as Review[];
  const attrs = [
    seller.age_range && { k: t("profile.age"), v: tc("age", { a: seller.age_range }) },
    seller.build && {
      k: t("profile.build"),
      v: (BUILDS as readonly string[]).includes(seller.build) ? tc(`build.${seller.build as (typeof BUILDS)[number]}`) : seller.build,
    },
    seller.shoe_size && { k: t("profile.shoeSize"), v: seller.shoe_size },
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <div className="wrap flex flex-col gap-12 py-8 sm:py-12">
      <header className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-7">
        <Avatar url={seller.avatar_url} name={seller.username} size={96} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h1 className="break-words text-3xl font-extrabold">{seller.username}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {seller.verified
              ? <span className="flex items-center gap-1.5 font-semibold text-verified"><VerifiedBadge /> {t("profile.verified")}</span>
              : <span className="text-muted">{t("profile.notVerified")}</span>}
            <Flag country={seller.country} />
            <LastActive iso={seller.last_active} />
          </div>
          <Stars rating={Number(stats?.rating ?? 0)} count={stats?.review_count ?? 0} />
          {attrs.length > 0 && (
            <dl className="flex flex-wrap gap-2 text-sm">
              {attrs.map((a) => (
                <div key={a.k} className="rounded-md bg-surface-2 px-2.5 py-1">
                  <dt className="inline text-muted">{a.k}: </dt><dd className="inline font-semibold">{a.v}</dd>
                </div>
              ))}
            </dl>
          )}
          {seller.bio && <p className="max-w-2xl whitespace-pre-line break-words text-muted">{seller.bio}</p>}
        </div>
        {!isSelf && (
          <form action={startConversation.bind(null, seller.id, undefined)} className="shrink-0">
            <button type="submit" className="btn-primary w-full sm:w-auto">{t("profile.message")}</button>
          </form>
        )}
      </header>

      <section aria-labelledby="angebote-h">
        <h2 id="angebote-h" className="mb-5 text-2xl font-bold">
          {t("profile.listings")} <span className="font-sans text-base font-semibold text-muted tabular-nums">({listings.length})</span>
        </h2>
        {listings.length === 0 ? (
          <Empty>{t("profile.noListings", { name: seller.username })}</Empty>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {listings.map((l) => <ListingCard key={l.id} l={l} />)}
          </div>
        )}
      </section>

      <section aria-labelledby="bew-h">
        <h2 id="bew-h" className="mb-5 text-2xl font-bold">
          {t("profile.reviews")} <span className="font-sans text-base font-semibold text-muted tabular-nums">({reviews.length})</span>
        </h2>
        {reviews.length === 0 ? (
          <Empty>{t("profile.noReviews")}</Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {reviews.map((r) => (
              <li key={r.id} className="card flex flex-col gap-1.5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Stars rating={r.rating} />
                  <time dateTime={r.created_at} className="text-xs text-muted">{date(r.created_at, locale)}</time>
                </div>
                {r.body ? <p className="whitespace-pre-line break-words">{r.body}</p> : <p className="text-sm text-muted">{t("profile.noComment")}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
