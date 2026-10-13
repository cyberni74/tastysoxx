"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { account } from "@/i18n/messages/account";
import { common, dbErrorKey } from "@/i18n/messages/common";
import { getT } from "@/i18n/server";
import { createClient } from "@/lib/supabase/server";

export type SignupState = { error?: string; confirmEmail?: string };

function safeNext(v: unknown, fallback = "/konto") {
  return typeof v === "string" && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : fallback;
}

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) return `${h.get("x-forwarded-proto") ?? "https"}://${host}`;
  return h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
}

export async function signUp(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const { t } = await getT(account);
  const { t: tc } = await getT(common);

  const mapError = (message: string): string => {
    if (dbErrorKey(message) !== "err.generic") return tc(dbErrorKey(message));
    const m = message.toLowerCase();
    if (m.includes("already registered") || m.includes("already been registered") || m.includes("user already exists"))
      return t("signup.errExists");
    if (m.includes("password")) return t("err.passwordWeak");
    if (m.includes("rate limit")) return t("err.rateLimit");
    if (m.includes("username") || m.includes("profiles") || m.includes("duplicate")) return t("signup.errTakenShort");
    if (m.includes("database error")) return t("signup.errDb");
    return t("signup.errGeneric");
  };

  const schema = z.object({
    username: z.string().trim().regex(/^[A-Za-z0-9_.-]{3,24}$/, t("signup.errUsername")),
    email: z.string().trim().email(t("err.email")),
    password: z.string().min(8, t("err.passwordMin")).max(72, t("err.passwordLong")),
    role: z.enum(["buyer", "seller"], { errorMap: () => ({ message: t("signup.errRole") }) }),
    adult: z.literal("on", { errorMap: () => ({ message: t("signup.errAdult") }) }),
    terms: z.literal("on", { errorMap: () => ({ message: t("signup.errTerms") }) }),
  });
  const parsed = schema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    adult: formData.get("adult"),
    terms: formData.get("terms"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { username, email, password, role } = parsed.data;

  const supabase = await createClient();
  if (!supabase) return { error: t("err.unavailable") };

  // Case-insensitive check; escape LIKE wildcards (_ is allowed in usernames).
  const pattern = username.replace(/[\\%_]/g, (c) => `\\${c}`);
  const { data: taken } = await supabase.from("profiles").select("id").ilike("username", pattern).limit(1);
  if (taken && taken.length > 0) return { error: t("signup.errTaken", { name: username }) };

  const next = safeNext(formData.get("next"));
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, role, adult_confirmed: true },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { error: mapError(error.message) };
  // With email confirmation on, an existing address returns a user without identities.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { error: t("signup.errExists") };
  }
  if (data.session) redirect(next);
  return { confirmEmail: email };
}
