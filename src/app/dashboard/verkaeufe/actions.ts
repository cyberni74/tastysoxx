"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/supabase/server";
import { getT } from "@/i18n/server";
import { seller } from "@/i18n/messages/seller";
import { common, dbErrorKey } from "@/i18n/messages/common";

export type OrderActionState = { error?: string };

const schema = z.object({
  order_id: z.string().uuid(),
  status: z.enum(["paid", "cancelled", "shipped"]),
});

export async function setOrderStatus(_prev: OrderActionState, formData: FormData): Promise<OrderActionState> {
  const { t } = await getT(seller);
  const { t: tc } = await getT(common);
  const { supabase, user, profile } = await getSession();
  if (!supabase) return { error: t("act.noDb") };
  if (!user) return { error: tc("err.notLoggedIn") };
  if (profile?.role !== "seller") return { error: t("order.sellerOnly") };

  const parsed = schema.safeParse({ order_id: formData.get("order_id"), status: formData.get("status") });
  if (!parsed.success) return { error: t("order.invalid") };

  const { error } = await supabase.rpc("set_order_status", {
    order_id: parsed.data.order_id,
    new_status: parsed.data.status,
  });
  if (error) return { error: tc(dbErrorKey(error.message)) };

  revalidatePath("/dashboard/verkaeufe");
  revalidatePath("/dashboard");
  return {};
}
