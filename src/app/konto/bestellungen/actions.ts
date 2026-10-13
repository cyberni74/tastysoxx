"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { account } from "@/i18n/messages/account";
import { common, dbErrorKey } from "@/i18n/messages/common";
import { getT } from "@/i18n/server";
import { getSession } from "@/lib/supabase/server";

export type ActionState = { error?: string; ok?: string };

const statusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["cancelled", "completed"]),
});

/** Buyer-side status changes; the set_order_status RPC enforces who may do what. */
export async function changeOrderStatus(orderId: string, status: "cancelled" | "completed"): Promise<ActionState> {
  const { t } = await getT(account);
  const parsed = statusSchema.safeParse({ orderId, status });
  if (!parsed.success) return { error: t("err.invalid") };
  const { supabase, user } = await getSession();
  if (!supabase || !user) return { error: t("err.relogin") };

  const { error } = await supabase.rpc("set_order_status", { order_id: parsed.data.orderId, new_status: parsed.data.status });
  if (error) {
    const key = dbErrorKey(error.message);
    if (key === "err.statusNotAllowed") return { error: t("orders.errStep") };
    const { t: tc } = await getT(common);
    return { error: tc(key) };
  }

  revalidatePath("/konto/bestellungen");
  return { ok: parsed.data.status === "cancelled" ? t("orders.cancelled") : t("orders.received") };
}

export async function submitReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { t } = await getT(account);
  const schema = z.object({
    order_id: z.string().uuid(t("err.invalid")),
    rating: z.coerce.number().int(t("review.errRating")).min(1, t("review.errRating")).max(5, t("review.errRating")),
    body: z.string().trim().max(1000, t("review.errBody")),
  });
  const parsed = schema.safeParse({
    order_id: formData.get("order_id"),
    rating: formData.get("rating") ?? 0,
    body: formData.get("body") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase, user } = await getSession();
  if (!supabase || !user) return { error: t("err.relogin") };

  // seller_id comes from the DB, not the form; RLS checks buyer + completed status.
  const { data: order } = await supabase
    .from("orders").select("id, seller_id, status").eq("id", parsed.data.order_id).eq("buyer_id", user.id).maybeSingle();
  if (!order) {
    const { t: tc } = await getT(common);
    return { error: tc("err.orderNotFound") };
  }
  if (order.status !== "completed") return { error: t("review.errNotCompleted") };

  const { error } = await supabase.from("reviews").insert({
    order_id: order.id,
    buyer_id: user.id,
    seller_id: order.seller_id,
    rating: parsed.data.rating,
    body: parsed.data.body,
  });
  if (error) return { error: error.code === "23505" ? t("review.errDuplicate") : t("review.errSave") };
  revalidatePath("/konto/bestellungen");
  return { ok: t("review.ok") };
}
