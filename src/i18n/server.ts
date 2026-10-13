import "server-only";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { translator, type Dict, type Messages } from "./define";

/** The site is German-only; English dictionaries are kept but no longer served. */
export async function getLocale(): Promise<Locale> {
  return DEFAULT_LOCALE;
}

/** Server Components / Actions: `const { t, locale } = await getT(messages)`. */
export async function getT<D extends Dict>(m: Messages<D>) {
  const locale = await getLocale();
  return { t: translator(m, locale), locale };
}
