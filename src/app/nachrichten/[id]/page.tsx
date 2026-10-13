import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";
import type { Conversation, Message, Profile } from "@/lib/types";
import { Avatar, LastActive, SetupNotice, VerifiedBadge } from "@/components/Bits";
import { ChatRoom } from "./ChatRoom";
import { getT } from "@/i18n/server";
import { seller } from "@/i18n/messages/seller";


export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(seller);
  return { title: t("meta.chat") };
}
export const dynamic = "force-dynamic";

type Party = Pick<Profile, "id" | "username" | "avatar_url" | "verified" | "role" | "last_active">;
type Row = Conversation & { buyer: Party | null; seller: Party | null; listing: { id: string; title: string } | null };

const PARTY = "id, username, avatar_url, verified, role, last_active";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect(`/anmelden?next=/nachrichten/${id}`);
  const { t } = await getT(seller);

  const { data } = await supabase
    .from("conversations")
    .select(`*, buyer:profiles!conversations_buyer_id_fkey(${PARTY}), seller:profiles!conversations_seller_id_fkey(${PARTY}), listing:listings(id, title)`)
    .eq("id", id)
    .maybeSingle();
  const conv = data as unknown as Row | null;
  if (!conv || (conv.buyer_id !== user.id && conv.seller_id !== user.id)) notFound();

  const { data: msgData } = await supabase
    .from("messages").select("*").eq("conversation_id", conv.id)
    .order("created_at", { ascending: false }).limit(100);
  const messages = ((msgData ?? []) as Message[]).reverse();

  const other = conv.buyer_id === user.id ? conv.seller : conv.buyer;
  const name = other?.username ?? t("unknown");
  const isSeller = other?.role === "seller" && other.id === conv.seller_id;

  return (
    <div className="wrap grid max-w-2xl gap-4 py-6">
      <Link href="/nachrichten" className="text-sm text-muted hover:text-accent">{t("chat.back")}</Link>
      <header className="card flex items-center gap-3 p-3.5">
        <Avatar url={other?.avatar_url ?? null} name={name} size={48} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 font-semibold">
            {isSeller
              ? <Link href={`/verkaeufer/${name}`} className="truncate hover:text-accent">{name}</Link>
              : <span className="truncate">{name}</span>}
            {other?.verified && <VerifiedBadge />}
          </div>
          <LastActive iso={other?.last_active} />
          {conv.listing && (
            <div className="truncate text-sm text-muted">
              {t("chat.about")} <Link href={`/artikel/${conv.listing.id}`} className="underline hover:text-accent">{conv.listing.title}</Link>
            </div>
          )}
        </div>
        {isSeller && <Link href={`/verkaeufer/${name}`} className="btn-ghost btn-sm hidden shrink-0 sm:inline-flex">{t("chat.profile")}</Link>}
      </header>
      <ChatRoom conversationId={conv.id} meId={user.id} initial={messages} />
    </div>
  );
}
