import "server-only";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./config";
import { translator, type Dict, type Messages } from "./define";

export async function getLocale(): Promise<Locale> {
  const c = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(c)) return c;
  const accept = (await headers()).get("accept-language") ?? "";
  const first = accept.split(",")[0]?.trim().slice(0, 2).toLowerCase();
  return first === "en" ? "en" : DEFAULT_LOCALE;
}

/** Server Components / Actions: `const { t, locale } = await getT(messages)`. */
export async function getT<D extends Dict>(m: Messages<D>) {
  const locale = await getLocale();
  return { t: translator(m, locale), locale };
}
