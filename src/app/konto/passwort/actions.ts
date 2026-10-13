"use server";
import { z } from "zod";
import { account } from "@/i18n/messages/account";
import { getT } from "@/i18n/server";
import { getSession } from "@/lib/supabase/server";

export type PasswordState = { error?: string; ok?: string };

export async function updatePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const { t } = await getT(account);
  const schema = z
    .object({
      password: z.string().min(8, t("err.passwordMin")).max(72, t("err.passwordLong")),
      confirm: z.string(),
    })
    .refine((d) => d.password === d.confirm, { message: t("pw.errMismatch") });
  const parsed = schema.safeParse({ password: formData.get("password"), confirm: formData.get("confirm") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase, user } = await getSession();
  if (!supabase || !user) return { error: t("pw.errSession") };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes("different from the old")) return { error: t("pw.errSame") };
    if (m.includes("reauthentication") || m.includes("recent")) return { error: t("pw.errReauth") };
    if (m.includes("password")) return { error: t("err.passwordWeak") };
    return { error: t("pw.errGeneric") };
  }
  return { ok: t("pw.ok") };
}
