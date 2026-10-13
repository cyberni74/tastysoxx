"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/supabase/server";

export type ActionState = { error?: string; ok?: string };

const statusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["cancelled", "completed"]),
});

/** Buyer-side status changes; the set_order_status RPC enforces who may do what. */
export async function changeOrderStatus(orderId: string, status: "cancelled" | "completed"): Promise<ActionState> {
  const parsed = statusSchema.safeParse({ orderId, status });
  if (!parsed.success) return { error: "Ungültige Anfrage." };
  const { supabase, user } = await getSession();
  if (!supabase || !user) return { error: "Bitte melde dich erneut an." };

  const { error } = await supabase.rpc("set_order_status", { order_id: parsed.data.orderId, new_status: parsed.data.status });
  if (error) return { error: error.message.includes("nicht erlaubt") ? "Dieser Schritt ist bei dieser Bestellung nicht mehr möglich." : error.message };

  revalidatePath("/konto/bestellungen");
  return { ok: parsed.data.status === "cancelled" ? "Bestellung storniert." : "Danke! Erhalt bestätigt." };
}

const reviewSchema = z.object({
  order_id: z.string().uuid(),
  rating: z.coerce.number().int().min(1, "Bitte wähle 1 bis 5 Sterne.").max(5, "Bitte wähle 1 bis 5 Sterne."),
  body: z.string().trim().max(1000, "Die Bewertung darf höchstens 1000 Zeichen haben."),
});

export async function submitReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = reviewSchema.safeParse({
    order_id: formData.get("order_id"),
    rating: formData.get("rating") ?? 0,
    body: formData.get("body") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase, user } = await getSession();
  if (!supabase || !user) return { error: "Bitte melde dich erneut an." };

  // seller_id comes from the DB, not the form; RLS checks buyer + completed status.
  const { data: order } = await supabase
    .from("orders").select("id, seller_id, status").eq("id", parsed.data.order_id).eq("buyer_id", user.id).maybeSingle();
  if (!order) return { error: "Bestellung nicht gefunden." };
  if (order.status !== "completed") return { error: "Bewerten kannst du erst nach bestätigtem Erhalt." };

  const { error } = await supabase.from("reviews").insert({
    order_id: order.id,
    buyer_id: user.id,
    seller_id: order.seller_id,
    rating: parsed.data.rating,
    body: parsed.data.body,
  });
  if (error) {
    if (error.code === "23505") return { error: "Du hast diese Bestellung bereits bewertet." };
    return { error: "Bewertung konnte nicht gespeichert werden." };
  }
  revalidatePath("/konto/bestellungen");
  return { ok: "Danke für deine Bewertung!" };
}
