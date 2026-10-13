"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/supabase/server";
import { SUPABASE_URL } from "@/lib/supabase/env";

export type FormState = { error?: string };

const BUCKET = "listing-images";

/** "12,50" | "12.50" | "1.234,50" | "12 €" → cents, or null when invalid. */
function parsePrice(raw: string): number | null {
  let s = raw.replace(/[\s€]/g, "");
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  return Math.round(Number(s) * 100);
}

const schema = z.object({
  title: z.string().trim().min(3, "Titel: mindestens 3 Zeichen").max(80, "Titel: höchstens 80 Zeichen"),
  description: z.string().trim().max(2000, "Beschreibung: höchstens 2000 Zeichen"),
  category: z.enum(["sneaker", "sport", "knie", "nylon"], { message: "Bitte eine Kategorie wählen" }),
  material: z.enum(["Baumwolle", "Wolle", "Nylon", "Synthetik"], { message: "Bitte ein Material wählen" }),
  wear_days: z.coerce.number({ message: "Tragedauer fehlt" }).int("Tragedauer: ganze Tage")
    .min(1, "Tragedauer: mindestens 1 Tag").max(30, "Tragedauer: höchstens 30 Tage"),
  price_cents: z.number({ message: "Preis bitte als Zahl angeben, z. B. 12,50" })
    .int().min(500, "Preis: mindestens 5,00 €").max(50000, "Preis: höchstens 500,00 €"),
  images: z.array(z.string().url("Ungültige Bild-URL")).max(6, "Höchstens 6 Bilder"),
});

async function requireSeller() {
  const { supabase, user, profile } = await getSession();
  if (!supabase) return { error: "Datenbank nicht verbunden." } as const;
  if (!user) return { error: "Bitte melde dich an." } as const;
  if (profile?.role !== "seller") return { error: "Nur Verkäuferinnen können Artikel verwalten." } as const;
  return { supabase, user } as const;
}

function parseForm(formData: FormData, uid: string) {
  let images: unknown = [];
  try {
    images = JSON.parse(String(formData.get("images") ?? "[]"));
  } catch {
    return { error: "Bilder konnten nicht gelesen werden." } as const;
  }
  const price = parsePrice(String(formData.get("price") ?? ""));
  const parsed = schema.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    category: formData.get("category"),
    material: formData.get("material"),
    wear_days: formData.get("wear_days"),
    price_cents: price ?? Number.NaN,
    images,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Eingaben prüfen." } as const;

  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${uid}/`;
  if (parsed.data.images.some((u) => !u.startsWith(prefix) || u.slice(prefix.length).includes(".."))) {
    return { error: "Bilder müssen über das Formular hochgeladen werden." } as const;
  }
  return { data: parsed.data } as const;
}

export async function createListing(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireSeller();
  if ("error" in ctx) return { error: ctx.error };
  const parsed = parseForm(formData, ctx.user.id);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await ctx.supabase.from("listings").insert({ ...parsed.data, seller_id: ctx.user.id });
  if (error) return { error: "Speichern fehlgeschlagen. Bitte versuche es erneut." };

  revalidatePath("/dashboard");
  revalidatePath("/shop");
  redirect("/dashboard");
}

export async function updateListing(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireSeller();
  if ("error" in ctx) return { error: ctx.error };
  const parsed = parseForm(formData, ctx.user.id);
  if ("error" in parsed) return { error: parsed.error };

  const { data, error } = await ctx.supabase
    .from("listings").update(parsed.data)
    .eq("id", id).eq("seller_id", ctx.user.id).in("status", ["active", "hidden"])
    .select("id");
  if (error) return { error: "Speichern fehlgeschlagen. Bitte versuche es erneut." };
  if (!data?.length) return { error: "Reservierte oder verkaufte Artikel können nicht mehr bearbeitet werden." };

  revalidatePath("/dashboard");
  revalidatePath(`/artikel/${id}`);
  revalidatePath("/shop");
  redirect("/dashboard");
}

export async function setListingHidden(id: string, hidden: boolean): Promise<FormState> {
  const ctx = await requireSeller();
  if ("error" in ctx) return { error: ctx.error };

  const { data, error } = await ctx.supabase
    .from("listings").update({ status: hidden ? "hidden" : "active" })
    .eq("id", id).eq("seller_id", ctx.user.id).eq("status", hidden ? "active" : "hidden")
    .select("id");
  if (error) return { error: "Status konnte nicht geändert werden." };
  if (!data?.length) return { error: "Nur aktive oder versteckte Artikel lassen sich umschalten." };

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/artikel/${id}`);
  revalidatePath(`/artikel/${id}`);
  revalidatePath("/shop");
  return {};
}

export async function deleteListing(id: string): Promise<FormState> {
  const ctx = await requireSeller();
  if ("error" in ctx) return { error: ctx.error };

  const { data, error } = await ctx.supabase
    .from("listings").delete()
    .eq("id", id).eq("seller_id", ctx.user.id).in("status", ["active", "hidden"])
    .select("images");
  if (error) {
    // order_items still reference listings that were ordered and cancelled
    return { error: "Dieser Artikel hat eine Bestellhistorie und kann nicht gelöscht werden. Blende ihn stattdessen aus." };
  }
  if (!data?.length) return { error: "Nur aktive oder versteckte Artikel können gelöscht werden." };

  // best-effort cleanup of the uploaded photos
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  const paths = ((data[0].images ?? []) as string[])
    .filter((u) => u.startsWith(`${prefix}${ctx.user.id}/`))
    .map((u) => u.slice(prefix.length));
  if (paths.length) await ctx.supabase.storage.from(BUCKET).remove(paths);

  revalidatePath("/dashboard");
  revalidatePath("/shop");
  redirect("/dashboard");
}
