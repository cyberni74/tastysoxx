"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { COUNTRIES } from "@/lib/constants";
import { getSession } from "@/lib/supabase/server";

export type CheckoutState = { error?: string; ok?: boolean };

const schema = z.object({
  listing_ids: z.array(z.string().uuid()).min(1, "Dein Warenkorb ist leer.").max(50, "Zu viele Artikel auf einmal."),
  ship_name: z.string().trim().min(2, "Bitte gib einen Namen für das Paket an.").max(80, "Der Name ist zu lang."),
  ship_street: z.string().trim().min(3, "Bitte gib Straße und Hausnummer an.").max(120, "Die Straße ist zu lang."),
  ship_zip: z.string().trim().regex(/^[A-Za-z0-9 -]{3,10}$/, "Bitte gib eine gültige PLZ an."),
  ship_city: z.string().trim().min(2, "Bitte gib den Ort an.").max(80, "Der Ort ist zu lang."),
  ship_country: z.string().refine((c) => c in COUNTRIES, "Bitte wähle ein Land."),
  adult: z.literal("on", { errorMap: () => ({ message: "Bitte bestätige, dass du mindestens 18 Jahre alt bist." }) }),
});

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
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
  if (!supabase || !user) return { error: "Bitte melde dich an, um zu bestellen." };

  const { listing_ids, ship_name, ship_street, ship_zip, ship_city, ship_country } = parsed.data;
  // Only ids go to the DB; prices are read there.
  const { error } = await supabase.rpc("create_orders", { listing_ids, ship_name, ship_street, ship_zip, ship_city, ship_country });
  if (error) return { error: error.message || "Bestellung fehlgeschlagen. Bitte versuche es erneut." };

  revalidatePath("/konto/bestellungen");
  revalidatePath("/shop");
  return { ok: true };
}
