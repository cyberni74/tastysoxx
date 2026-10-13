import Link from "next/link";
import type { ListingWithSeller } from "@/lib/types";
import { categoryById } from "@/lib/constants";
import { eur, wearLabel } from "@/lib/format";
import { Flag, Swatch, VerifiedBadge } from "./Bits";

export function ListingCard({ l }: { l: ListingWithSeller }) {
  const cat = categoryById(l.category);
  return (
    <Link href={`/artikel/${l.id}`} className="card group flex flex-col overflow-hidden transition hover:border-accent">
      <div className="relative aspect-square overflow-hidden">
        {l.images[0]
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={l.images[0]} alt={l.title} className="size-full object-cover transition group-hover:scale-[1.03]" loading="lazy" />
          : <Swatch hue={cat?.hue ?? 165} className="size-full" />}
        <span className="absolute left-2.5 top-2.5 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold">{cat?.short}</span>
        {l.status !== "active" && <span className="absolute right-2.5 top-2.5 rounded-full bg-fg px-2.5 py-1 text-xs font-semibold text-bg">{l.status === "sold" ? "Verkauft" : "Reserviert"}</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 p-3.5">
        {l.seller && (
          <div className="flex items-center gap-1.5 text-sm font-medium">
            {l.seller.verified && <VerifiedBadge />}<span className="truncate">{l.seller.username}</span><Flag country={l.seller.country} />
          </div>
        )}
        <h3 className="font-sans text-base font-semibold leading-snug">{l.title}</h3>
        <div className="text-sm text-muted">{l.material} · getragen {wearLabel(l.wear_days)}</div>
        <div className="mt-auto pt-2 font-display text-xl font-bold tabular-nums">{eur(l.price_cents)}</div>
      </div>
    </Link>
  );
}
