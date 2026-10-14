"use server";
import { cookies } from "next/headers";

const YEAR = 60 * 60 * 24 * 365;

/**
 * Remembers the age confirmation / cookie notice for visitors without an account.
 * Set by the server (not JS) so Safari's 7-day cap on script-written storage does not apply.
 */
export async function rememberConsent(kind: "age" | "cookie") {
  const jar = await cookies();
  jar.set(kind === "age" ? "ts-age" : "ts-cookie", "1", {
    path: "/",
    maxAge: YEAR,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
