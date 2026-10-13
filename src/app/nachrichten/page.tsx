import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";
import type { Conversation, Profile } from "@/lib/types";
import { Avatar, Empty, SetupNotice, VerifiedBadge } from "@/components/Bits";
import { isOnline, timeAgo } from "@/lib/format";
import { getT } from "@/i18n/server";
import { seller } from "@/i18n/messages/seller";
import { INTL } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(seller);
  return { title: t("meta.messages") };
}
export const dynamic = "force-dynamic";

type Party = Pick<Profile, "id" | "username" | "avatar_url" | "verified">;
type Row = Conversation & { buyer: Party | null; seller: Party | null; listing: { title: string } | null };


export default async function MessagesPage() {
  const { supabase, user } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/nachrichten");
  const { t, locale } = await getT(seller);
  const dateFmt = new Intl.DateTimeFormat(INTL[locale], { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Berlin" });

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
      <h1 className="text-3xl font-extrabold">{t("msg.title")}</h1>
      {rows.length === 0 ? (
        <Empty>
          {t("msg.empty")}{" "}
          <Link href="/marktplatz" className="font-semibold text-accent underline">{t("msg.emptyLink")}</Link>
        </Empty>
      ) : (
        <ul className="card divide-y divide-line overflow-hidden">
          {rows.map((c) => {
            const iAmBuyer = c.buyer_id === user.id;
            const other = iAmBuyer ? c.seller : c.buyer;
            const name = other?.username ?? t("unknown");
            return (
              <li key={c.id}>
                <Link href={`/nachrichten/${c.id}`} className="flex items-center gap-3 p-3.5 transition hover:bg-surface-2">
                  <Avatar url={other?.avatar_url ?? null} name={name} size={48} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span className="truncate">{name}</span>{other?.verified && <VerifiedBadge />}
                      <span className="ml-auto shrink-0 text-xs font-normal text-muted" title={dateFmt.format(new Date(c.last_message_at))}>
                        {isOnline(c.last_message_at) ? t("msg.justNow") : timeAgo(c.last_message_at)}
                      </span>
                    </div>
                    <div className="truncate text-sm text-muted">
                      {iAmBuyer ? t("msg.roleSeller") : t("msg.roleBuyer")}{c.listing ? ` · ${c.listing.title}` : ""}
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
