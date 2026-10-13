"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { account } from "@/i18n/messages/account";
import { getT } from "@/i18n/server";
import { AGE_RANGES, BUILDS, COUNTRIES } from "@/lib/constants";
import { SUPABASE_URL } from "@/lib/supabase/env";
import { getSession } from "@/lib/supabase/server";

export type ProfileState = { error?: string; ok?: string };

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const { t } = await getT(account);
  const { supabase, user, profile } = await getSession();
  if (!supabase || !user || !profile) return { error: t("err.relogin") };

  const choice = { errorMap: () => ({ message: t("profile.errChoice") }) };
  const schema = z.object({
    bio: z.string().trim().max(600, t("profile.errBio")),
    country: z.string().refine((c) => c in COUNTRIES, t("profile.errCountry")),
    age_range: z.preprocess(emptyToNull, z.enum(AGE_RANGES, choice).nullable()),
    build: z.preprocess(emptyToNull, z.enum(BUILDS, choice).nullable()),
    shoe_size: z.preprocess(emptyToNull, z.string().trim().max(5, t("profile.errShoeLen")).regex(/^[0-9½.,/\- ]+$/, t("profile.errShoe")).nullable()),
  });
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
  if (error) return { error: t("profile.errSave") };

  revalidatePath("/konto");
  revalidatePath("/", "layout");
  return { ok: t("profile.saved") };
}

/** Stores the public URL of an avatar the client already uploaded to the user's own folder. */
export async function saveAvatar(url: string): Promise<ProfileState> {
  const { t } = await getT(account);
  const { supabase, user } = await getSession();
  if (!supabase || !user) return { error: t("err.relogin") };
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}/`;
  if (typeof url !== "string" || !url.startsWith(prefix) || url.length > 500) return { error: t("profile.errUrl") };

  const { error } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
  if (error) return { error: t("profile.errAvatarSave") };
  revalidatePath("/konto");
  revalidatePath("/", "layout");
  return { ok: t("profile.avatarOk") };
}
