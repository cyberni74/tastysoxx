import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";
import type { Conversation, Profile } from "@/lib/types";
import { Avatar, Empty, SetupNotice, VerifiedBadge } from "@/components/Bits";
import { timeAgo } from "@/lib/format";

export const metadata: Metadata = { title: "Nachrichten" };
export const dynamic = "force-dynamic";

type Party = Pick<Profile, "id" | "username" | "avatar_url" | "verified">;
type Row = Conversation & { buyer: Party | null; seller: Party | null; listing: { title: string } | null };

const dateFmt = new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Berlin" });

export default async function MessagesPage() {
  const { supabase, user } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/nachrichten");

  const { data } = await supabase
    .from("conversations")
    .select(
      "*, buyer:profiles!conversations_buyer_id_fkey(id, username, avatar_url, verified)," +
      " seller:profiles!conversations_seller_id_fkey(id, username, avatar_url, verified), listing:listings(title)",
    )
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false });
  const rows = (data ?? []) as unknown as Row[];

  return (
    <div className="wrap grid max-w-2xl gap-5 py-8">
      <h1 className="text-3xl font-extrabold">Nachrichten</h1>
      {rows.length === 0 ? (
        <Empty>
          Noch keine Unterhaltungen. Auf jeder Artikelseite kannst du die Verkäuferin direkt anschreiben.{" "}
          <Link href="/shop" className="font-semibold text-accent underline">Zum Shop</Link>
        </Empty>
      ) : (
        <ul className="card divide-y divide-line overflow-hidden">
          {rows.map((c) => {
            const iAmBuyer = c.buyer_id === user.id;
            const other = iAmBuyer ? c.seller : c.buyer;
            const name = other?.username ?? "Unbekannt";
            return (
              <li key={c.id}>
                <Link href={`/nachrichten/${c.id}`} className="flex items-center gap-3 p-3.5 transition hover:bg-surface-2">
                  <Avatar url={other?.avatar_url ?? null} name={name} size={48} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span className="truncate">{name}</span>{other?.verified && <VerifiedBadge />}
                      <span className="ml-auto shrink-0 text-xs font-normal text-muted" title={dateFmt.format(new Date(c.last_message_at))}>
                        {timeAgo(c.last_message_at).replace("gerade aktiv", "gerade eben")}
                      </span>
                    </div>
                    <div className="truncate text-sm text-muted">
                      {iAmBuyer ? "Verkäuferin" : "Käufer:in"}{c.listing ? ` · ${c.listing.title}` : ""}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
