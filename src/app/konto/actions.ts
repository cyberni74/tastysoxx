"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AGE_RANGES, BUILDS, COUNTRIES } from "@/lib/constants";
import { SUPABASE_URL } from "@/lib/supabase/env";
import { getSession } from "@/lib/supabase/server";

export type ProfileState = { error?: string; ok?: string };

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);

const schema = z.object({
  bio: z.string().trim().max(600, "Die Beschreibung darf höchstens 600 Zeichen haben."),
  country: z.string().refine((c) => c in COUNTRIES, "Bitte wähle ein Land aus der Liste."),
  age_range: z.preprocess(emptyToNull, z.enum(AGE_RANGES).nullable()),
  build: z.preprocess(emptyToNull, z.enum(BUILDS).nullable()),
  shoe_size: z.preprocess(emptyToNull, z.string().trim().max(5, "Schuhgröße: höchstens 5 Zeichen.").regex(/^[0-9½.,/\- ]+$/, "Schuhgröße: bitte nur Zahlen, z. B. 38 oder 38,5.").nullable()),
});

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const { supabase, user, profile } = await getSession();
  if (!supabase || !user || !profile) return { error: "Bitte melde dich erneut an." };

  const parsed = schema.safeParse({
    bio: formData.get("bio") ?? "",
    country: formData.get("country"),
    age_range: formData.get("age_range"),
    build: formData.get("build"),
    shoe_size: formData.get("shoe_size"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { bio, country, age_range, build, shoe_size } = parsed.data;
  const patch = profile.role === "seller" ? { bio, country, age_range, build, shoe_size } : { bio, country };
  const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
  if (error) return { error: "Speichern fehlgeschlagen. Bitte versuche es erneut." };

  revalidatePath("/konto");
  revalidatePath("/", "layout");
  return { ok: "Gespeichert." };
}

/** Stores the public URL of an avatar the client already uploaded to the user's own folder. */
export async function saveAvatar(url: string): Promise<ProfileState> {
  const { supabase, user } = await getSession();
  if (!supabase || !user) return { error: "Bitte melde dich erneut an." };
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}/`;
  if (typeof url !== "string" || !url.startsWith(prefix) || url.length > 500) return { error: "Ungültige Bild-Adresse." };

  const { error } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
  if (error) return { error: "Profilbild konnte nicht gespeichert werden." };
  revalidatePath("/konto");
  revalidatePath("/", "layout");
  return { ok: "Profilbild aktualisiert." };
}
