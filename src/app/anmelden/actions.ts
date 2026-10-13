"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
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

const loginSchema = z.object({
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(1, "Bitte gib dein Passwort ein."),
});

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  if (!supabase) return { error: "Die Anmeldung ist gerade nicht verfügbar." };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("invalid login")) return { error: "E-Mail oder Passwort ist falsch." };
    if (msg.includes("not confirmed")) return { error: "Bitte bestätige zuerst deine E-Mail-Adresse. Der Link steht in der Mail, die wir dir geschickt haben." };
    if (msg.includes("rate limit") || error.status === 429) return { error: "Zu viele Versuche. Bitte warte kurz und versuche es dann erneut." };
    return { error: "Anmeldung fehlgeschlagen. Bitte versuche es erneut." };
  }
  redirect(safeNext(formData.get("next")));
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = z.string().trim().email().safeParse(formData.get("email"));
  if (!parsed.success) return { error: "Bitte gib eine gültige E-Mail-Adresse ein." };
  const supabase = await createClient();
  if (!supabase) return { error: "Die Funktion ist gerade nicht verfügbar." };

  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${origin}/auth/callback?next=/konto/passwort`,
  });
  if (error && (error.status === 429 || error.message.toLowerCase().includes("rate limit"))) {
    return { error: "Zu viele Anfragen. Bitte warte ein paar Minuten." };
  }
  // Same answer whether or not the address exists.
  return { ok: "Falls ein Konto mit dieser Adresse existiert, haben wir dir einen Link zum Zurücksetzen geschickt." };
}
