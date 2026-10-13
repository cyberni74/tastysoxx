"use server";
import { z } from "zod";
import { getSession } from "@/lib/supabase/server";

export type PasswordState = { error?: string; ok?: string };

const schema = z
  .object({
    password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen haben.").max(72, "Das Passwort ist zu lang."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Die Passwörter stimmen nicht überein." });

export async function updatePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const parsed = schema.safeParse({ password: formData.get("password"), confirm: formData.get("confirm") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase, user } = await getSession();
  if (!supabase || !user) return { error: "Deine Sitzung ist abgelaufen. Bitte fordere einen neuen Link an." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes("different from the old")) return { error: "Das neue Passwort muss sich vom alten unterscheiden." };
    if (m.includes("reauthentication") || m.includes("recent")) return { error: "Bitte melde dich erneut an oder fordere einen neuen Link an." };
    if (m.includes("password")) return { error: "Das Passwort ist zu schwach." };
    return { error: "Passwort konnte nicht geändert werden. Bitte versuche es erneut." };
  }
  return { ok: "Dein Passwort wurde geändert." };
}
