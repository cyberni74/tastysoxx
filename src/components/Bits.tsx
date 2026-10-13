"use client";
import { COUNTRIES } from "@/lib/constants";
import { isOnline, stars, timeAgo } from "@/lib/format";
import { useT } from "@/i18n/client";
import { common } from "@/i18n/messages/common";

export function VerifiedBadge({ title }: { title?: string }) {
  const t = useT(common);
  title ??= t("verified");
  return <span title={title} aria-label={title} className="inline-grid size-4 shrink-0 place-items-center rounded-full bg-verified text-[10px] font-extrabold text-white">✓</span>;
}

export function Stars({ rating, count }: { rating: number; count?: number }) {
  const t = useT(common);
  return (
    <span className="text-sm">
      <span className="tracking-wider text-star" aria-label={t("starsLabel", { r: rating })}>{stars(rating)}</span>
      {count !== undefined && <span className="ml-1 text-muted">({count})</span>}
    </span>
  );
}

export function Flag({ country }: { country: string }) {
  return <span aria-label={country}>{COUNTRIES[country] ?? country}</span>;
}

export function LastActive({ iso }: { iso: string | null | undefined }) {
  return isOnline(iso)
    ? <span className="text-xs font-semibold text-ok">● {timeAgo(iso)}</span>
    : <span className="text-xs text-muted">{timeAgo(iso)}</span>;
}

export function Avatar({ url, name, size = 76 }: { url: string | null; name: string; size?: number }) {
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <div className="grid shrink-0 place-items-center rounded-full font-display font-extrabold text-white"
      style={{ width: size, height: size, fontSize: size / 2.8, background: `linear-gradient(135deg,hsl(${hue} 55% 55%),hsl(${(hue + 30) % 360} 55% 30%))` }}>
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

/** CSS fabric placeholder used when a listing has no photo. */
export function Swatch({ hue, className = "" }: { hue: number; className?: string }) {
  return (
    <div className={className} aria-hidden
      style={{
        backgroundColor: `hsl(${hue} 45% 55%)`,
        backgroundImage: `radial-gradient(circle at 30% 25%, rgba(255,255,255,.35), transparent 60%), repeating-linear-gradient(45deg, rgba(255,255,255,.18) 0 6px, transparent 6px 18px)`,
      }} />
  );
}

export function SetupNotice() {
  const t = useT(common);
  return (
    <div className="card border-dashed p-6 text-center text-muted">
      {t("setup")}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">{children}</div>;
}
