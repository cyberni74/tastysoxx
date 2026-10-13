"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
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

const schema = z.object({
  username: z.string().trim().regex(/^[A-Za-z0-9_.-]{3,24}$/, "Benutzername: 3–24 Zeichen, nur Buchstaben, Zahlen, Punkt, Unter- und Bindestrich."),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen haben.").max(72, "Das Passwort ist zu lang."),
  role: z.enum(["buyer", "seller"], { errorMap: () => ({ message: "Bitte wähle, ob du kaufen oder verkaufen möchtest." }) }),
  adult: z.literal("on", { errorMap: () => ({ message: "Du musst mindestens 18 Jahre alt sein." }) }),
  terms: z.literal("on", { errorMap: () => ({ message: "Bitte akzeptiere AGB und Datenschutzerklärung." }) }),
});

function mapError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("altersbestätigung")) return "Du musst bestätigen, dass du mindestens 18 Jahre alt bist.";
  if (m.includes("already registered") || m.includes("already been registered") || m.includes("user already exists"))
    return "Diese E-Mail-Adresse ist bereits registriert. Melde dich an oder setze dein Passwort zurück.";
  if (m.includes("password")) return "Das Passwort ist zu schwach. Nimm mindestens 8 Zeichen, gern mit Zahlen und Sonderzeichen.";
  if (m.includes("rate limit")) return "Zu viele Versuche. Bitte warte ein paar Minuten.";
  if (m.includes("username") || m.includes("profiles") || m.includes("duplicate"))
    return "Dieser Benutzername ist leider schon vergeben.";
  if (m.includes("database error")) return "Registrierung fehlgeschlagen. Bitte prüfe deine Angaben (Benutzername evtl. vergeben) und versuche es erneut.";
  return "Registrierung fehlgeschlagen. Bitte versuche es erneut.";
}

export async function signUp(_prev: SignupState, formData: FormData): Promise<SignupState> {
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
  if (!supabase) return { error: "Die Registrierung ist gerade nicht verfügbar." };

  // Case-insensitive check; escape LIKE wildcards (_ is allowed in usernames).
  const pattern = username.replace(/[\\%_]/g, (c) => `\\${c}`);
  const { data: taken } = await supabase.from("profiles").select("id").ilike("username", pattern).limit(1);
  if (taken && taken.length > 0) return { error: `Der Benutzername „${username}“ ist leider schon vergeben. Probier einen anderen.` };

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
    return { error: mapError("already registered") };
  }
  if (data.session) redirect(next);
  return { confirmEmail: email };
}
