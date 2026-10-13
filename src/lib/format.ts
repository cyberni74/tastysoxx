export const eur = (cents: number) =>
  (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 10) return "gerade aktiv";
  if (m < 60) return `vor ${m} Min.`;
  if (m < 1440) return `vor ${Math.round(m / 60)} Std.`;
  if (m < 2880) return "gestern";
  return `vor ${Math.round(m / 1440)} Tagen`;
}

export const isOnline = (iso: string | null | undefined) =>
  !!iso && Date.now() - new Date(iso).getTime() < 10 * 60000;

export const stars = (r: number) => {
  const n = Math.max(0, Math.min(5, Math.round(r)));
  return "★".repeat(n) + "☆".repeat(5 - n);
};

export const wearLabel = (days: number) => (days === 1 ? "1 Tag" : `${days} Tage`);
