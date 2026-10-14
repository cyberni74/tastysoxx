"use server";
import { redirect } from "next/navigation";
import { account } from "@/i18n/messages/account";
import { getT } from "@/i18n/server";
import { getSession } from "@/lib/supabase/server";

export type DeleteState = { error?: string };

const OPEN_STATUSES = ["pending_payment", "paid", "shipped"];
const BUCKETS = ["avatars", "listing-images"];

/**
 * Deletes the signed-in user's account. Steps: re-check password, refuse while orders are open,
 * remove uploaded files (the Storage API must do this, SQL would leave orphaned files), then call
 * delete_my_account() which removes the profile, listings and chats and pseudonymises orders/reviews.
 */
export async function deleteAccount(_prev: DeleteState, formData: FormData): Promise<DeleteState> {
  const { t } = await getT(account);
  const { supabase, user } = await getSession();
  if (!supabase || !user?.email) return { error: t("err.relogin") };

  const password = String(formData.get("password") ?? "");
  if (formData.get("confirm") !== "on" || !password) return { error: t("delete.errConfirm") };

  const check = await supabase.auth.signInWithPassword({ email: user.email, password });
  if (check.error) return { error: t("delete.errPassword") };

  const { count, error: countError } = await supabase
    .from("orders").select("id", { count: "exact", head: true }).in("status", OPEN_STATUSES);
  if (countError) return { error: t("err.unavailable") };
  if ((count ?? 0) > 0) return { error: t("delete.errOpenOrders") };

  for (const bucket of BUCKETS) {
    const { data: files } = await supabase.storage.from(bucket).list(user.id, { limit: 1000 });
    if (files && files.length > 0) {
      await supabase.storage.from(bucket).remove(files.map((f) => `${user.id}/${f.name}`));
    }
  }

  const { error } = await supabase.rpc("delete_my_account");
  if (error) return { error: error.message.includes("Offene") ? t("delete.errOpenOrders") : t("err.unavailable") };

  await supabase.auth.signOut({ scope: "local" });
  redirect("/geloescht");
}
