"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { account } from "@/i18n/messages/account";
import { getT } from "@/i18n/server";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; ok?: string };

function safeNext(v: unknown, fallback = "/konto") {
  return typeof v === "string" && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : fallback;
}

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) return `${h.get("x-forwarded-proto") ?? "https"}://${host}`;
  return h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getT(account);
  const schema = z.object({
    email: z.string().trim().email(t("err.email")),
    password: z.string().min(1, t("login.errPassword")),
  });
  const parsed = schema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  if (!supabase) return { error: t("err.unavailable") };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("invalid login")) return { error: t("login.errInvalid") };
    if (msg.includes("not confirmed")) return { error: t("login.errNotConfirmed") };
    if (msg.includes("rate limit") || error.status === 429) return { error: t("err.rateLimit") };
    return { error: t("login.errGeneric") };
  }
  redirect(safeNext(formData.get("next")));
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getT(account);
  const parsed = z.string().trim().email().safeParse(formData.get("email"));
  if (!parsed.success) return { error: t("err.email") };
  const supabase = await createClient();
  if (!supabase) return { error: t("err.unavailable") };

  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${origin}/auth/callback?next=/konto/passwort`,
  });
  if (error && (error.status === 429 || error.message.toLowerCase().includes("rate limit"))) {
    return { error: t("err.rateLimit") };
  }
  // Same answer whether or not the address exists.
  return { ok: t("reset.ok") };
}
