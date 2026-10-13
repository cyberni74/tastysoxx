import Link from "next/link";
import type { Profile } from "@/lib/types";
import { Avatar, Flag, LastActive, Stars, VerifiedBadge } from "./Bits";

export function SellerCard({ p, rating = 0, count = 0 }: { p: Profile; rating?: number; count?: number }) {
  return (
    <Link href={`/verkaeufer/${p.username}`} className="card grid grid-cols-[76px_1fr] gap-3.5 p-4 transition hover:border-accent">
      <Avatar url={p.avatar_url} name={p.username} />
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <b>{p.username}</b>{p.verified && <VerifiedBadge />}<Flag country={p.country} /><LastActive iso={p.last_active} />
        </div>
        <Stars rating={rating} count={count} />
        <div className="flex flex-wrap gap-1.5 text-xs">
          {p.age_range && <span className="rounded-md bg-surface-2 px-2 py-0.5">{p.age_range} J.</span>}
          {p.build && <span className="rounded-md bg-surface-2 px-2 py-0.5">{p.build}</span>}
          {p.shoe_size && <span className="rounded-md bg-surface-2 px-2 py-0.5">Schuhgr. {p.shoe_size}</span>}
        </div>
        {p.bio && <p className="line-clamp-2 text-sm text-muted">{p.bio}</p>}
      </div>
    </Link>
  );
}
