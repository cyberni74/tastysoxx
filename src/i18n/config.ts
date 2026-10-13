export const LOCALES = ["de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "de";
export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale);
/** Intl locale used for numbers, currency and dates. */
export const INTL: Record<Locale, string> = { de: "de-DE" };
