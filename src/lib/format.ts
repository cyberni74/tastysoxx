import { INTL, type Locale } from "@/i18n/config";
import { common } from "@/i18n/messages/common";
import { translator } from "@/i18n/define";

export const eur = (cents: number, locale: Locale = "de") =>
  (cents / 100).toLocaleString(INTL[locale], { style: "currency", currency: "EUR" });

export const date = (iso: string, locale: Locale = "de") =>
  new Date(iso).toLocaleDateString(INTL[locale], { day: "numeric", month: "short", year: "numeric" });

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = translator(common);
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 10) return t("time.online");
  if (m < 60) return t("time.min", { n: m });
  if (m < 1440) return t("time.hours", { n: Math.round(m / 60) });
  if (m < 2880) return t("time.yesterday");
  return t("time.days", { n: Math.round(m / 1440) });
}

export const isOnline = (iso: string | null | undefined) =>
  !!iso && Date.now() - new Date(iso).getTime() < 10 * 60000;

export const stars = (r: number) => {
  const n = Math.max(0, Math.min(5, Math.round(r)));
  return "★".repeat(n) + "☆".repeat(5 - n);
};

export const wearLabel = (days: number) => {
  const t = translator(common);
  return days === 1 ? t("wearDays.one") : t("wearDays.many", { n: days });
};

export const AUTO_CONFIRM_DAYS = 14;

/** Date on which a shipped order is confirmed automatically (matches auto_complete_orders() in the DB). */
export const autoConfirmDate = (shippedAt: string | null | undefined) =>
  shippedAt ? new Date(new Date(shippedAt).getTime() + AUTO_CONFIRM_DAYS * 86400000) : null;
