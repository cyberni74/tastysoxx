"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { account } from "@/i18n/messages/account";
import { common, dbErrorKey } from "@/i18n/messages/common";
import { getT } from "@/i18n/server";
import { COUNTRIES } from "@/lib/constants";
import { getSession } from "@/lib/supabase/server";

export type CheckoutState = { error?: string; ok?: boolean };

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const { t } = await getT(account);
  const { t: tc } = await getT(common);
  const schema = z.object({
    listing_ids: z.array(z.string().uuid(t("err.invalid"))).min(1, tc("err.emptyCart")).max(50, t("checkout.errTooMany")),
    ship_name: z.string().trim().min(2, t("checkout.errName")).max(80, t("checkout.errName")),
    ship_street: z.string().trim().min(3, t("checkout.errStreet")).max(120, t("checkout.errStreet")),
    ship_zip: z.string().trim().regex(/^[A-Za-z0-9 -]{3,10}$/, t("checkout.errZip")),
    ship_city: z.string().trim().min(2, t("checkout.errCity")).max(80, t("checkout.errCity")),
    ship_country: z.string().refine((c) => c in COUNTRIES, t("checkout.errCountry")),
    adult: z.literal("on", { errorMap: () => ({ message: tc("err.ageMissing") }) }),
  });
  const parsed = schema.safeParse({
    listing_ids: [...new Set(formData.getAll("listing_id").map(String))],
    ship_name: formData.get("ship_name"),
    ship_street: formData.get("ship_street"),
    ship_zip: formData.get("ship_zip"),
    ship_city: formData.get("ship_city"),
    ship_country: formData.get("ship_country"),
    adult: formData.get("adult"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { supabase, user } = await getSession();
  if (!supabase || !user) return { error: t("checkout.errLogin") };

  const { listing_ids, ship_name, ship_street, ship_zip, ship_city, ship_country } = parsed.data;
  // Only ids go to the DB; prices are read there.
  const { error } = await supabase.rpc("create_orders", { listing_ids, ship_name, ship_street, ship_zip, ship_city, ship_country });
  if (error) return { error: tc(dbErrorKey(error.message)) };

  revalidatePath("/konto/bestellungen");
  revalidatePath("/marktplatz");
  return { ok: true };
}
