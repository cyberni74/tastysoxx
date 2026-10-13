"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/supabase/server";

export type OrderActionState = { error?: string };

const schema = z.object({
  order_id: z.string().uuid(),
  status: z.enum(["paid", "cancelled", "shipped"]),
});

export async function setOrderStatus(_prev: OrderActionState, formData: FormData): Promise<OrderActionState> {
  const { supabase, user, profile } = await getSession();
  if (!supabase) return { error: "Datenbank nicht verbunden." };
  if (!user) return { error: "Bitte melde dich an." };
  if (profile?.role !== "seller") return { error: "Nur Verkäuferinnen können Bestellungen bearbeiten." };

  const parsed = schema.safeParse({ order_id: formData.get("order_id"), status: formData.get("status") });
  if (!parsed.success) return { error: "Ungültige Aktion." };

  const { error } = await supabase.rpc("set_order_status", {
    order_id: parsed.data.order_id,
    new_status: parsed.data.status,
  });
  if (error) {
    return { error: error.message.includes("nicht erlaubt") ? "Dieser Statuswechsel ist nicht möglich." : "Aktion fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/dashboard/verkaeufe");
  revalidatePath("/dashboard");
  return {};
}
