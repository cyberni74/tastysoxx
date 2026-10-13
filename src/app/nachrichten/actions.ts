"use server";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";

/** Opens (or reuses) the buyer↔seller conversation and redirects into it. */
export async function startConversation(sellerId: string, listingId?: string) {
  const { supabase, user } = await getSession();
  if (!supabase || !user) redirect(`/anmelden?next=/nachrichten`);
  if (user.id === sellerId) redirect("/nachrichten");

  const { data: existing } = await supabase
    .from("conversations").select("id").eq("buyer_id", user.id).eq("seller_id", sellerId).maybeSingle();
  if (existing) redirect(`/nachrichten/${existing.id}`);

  const { data, error } = await supabase
    .from("conversations").insert({ buyer_id: user.id, seller_id: sellerId, listing_id: listingId ?? null })
    .select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Chat konnte nicht gestartet werden");
  redirect(`/nachrichten/${data.id}`);
}
