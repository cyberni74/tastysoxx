"use client";
import Link from "next/link";
import { useT } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import type { Profile } from "@/lib/types";
import { Avatar, Flag, LastActive, Stars, VerifiedBadge } from "./Bits";

export function SellerCard({ p, rating = 0, count = 0 }: { p: Profile; rating?: number; count?: number }) {
  const t = useT(common);
  return (
    <Link href={`/verkaeufer/${p.username}`} className="card grid grid-cols-[76px_1fr] gap-3.5 p-4 transition hover:border-accent">
      <Avatar url={p.avatar_url} name={p.username} />
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <b>{p.username}</b>{p.verified && <VerifiedBadge />}<Flag country={p.country} /><LastActive iso={p.last_active} />
        </div>
        <Stars rating={rating} count={count} />
        <div className="flex flex-wrap gap-1.5 text-xs">
          {p.age_range && <span className="rounded-md bg-surface-2 px-2 py-0.5">{t("age", { a: p.age_range })}</span>}
          {p.build && <span className="rounded-md bg-surface-2 px-2 py-0.5">{t(`build.${p.build as "normal"}`)}</span>}
          {p.shoe_size && <span className="rounded-md bg-surface-2 px-2 py-0.5">{t("shoeSize", { s: p.shoe_size })}</span>}
        </div>
        {p.bio && <p className="line-clamp-2 text-sm text-muted">{p.bio}</p>}
      </div>
    </Link>
  );
}
