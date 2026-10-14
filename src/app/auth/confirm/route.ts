import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const TYPES: EmailOtpType[] = ["signup", "email", "recovery", "invite", "magiclink", "email_change"];

function safeNext(v: string | null | undefined) {
  return v && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : "/konto";
}

/** GET (link in the mail) only forwards to the confirm page; verification happens on POST. */
export function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/auth/bestaetigen";
  return NextResponse.redirect(url);
}

/**
 * Verifies the one-time token from the e-mail. Uses token_hash (verifyOtp), which works in any
 * browser; the code-exchange flow needs the cookie from the browser where the form was submitted.
 * Requiring a POST keeps mail scanners that pre-fetch links from consuming the single-use token.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const tokenHash = String(form.get("token_hash") ?? "");
  const type = String(form.get("type") ?? "") as EmailOtpType;
  const next = safeNext(String(form.get("next") ?? ""));
  const fail = NextResponse.redirect(new URL("/anmelden?fehler=1", request.nextUrl.origin), 303);

  if (!tokenHash || !TYPES.includes(type)) return fail;
  const supabase = await createClient();
  if (!supabase) return fail;
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  if (error) return fail;
  return NextResponse.redirect(new URL(next, request.nextUrl.origin), 303);
}
