import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Empty, SetupNotice } from "@/components/Bits";
import { INTL } from "@/i18n/config";
import { common } from "@/i18n/messages/common";
import { report } from "@/i18n/messages/report";
import { getT } from "@/i18n/server";
import { getSession } from "@/lib/supabase/server";
import type { ListingStatus, Report } from "@/lib/types";
import { hideReportedListing, setReportStatus } from "./actions";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(report);
  return { title: t("admin.meta"), robots: { index: false } };
}

type Row = Report & {
  listing: { id: string; title: string; status: ListingStatus } | null;
  profile: { username: string } | null;
};

const ORDER: Record<Report["status"], number> = { open: 0, reviewed: 1, closed: 2 };
const PILL: Record<Report["status"], string> = {
  open: "bg-danger text-white",
  reviewed: "bg-accent-soft text-fg",
  closed: "bg-surface-2 text-muted",
};

export default async function ReportsAdminPage() {
  const { supabase, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!profile?.is_admin) notFound();
  const { t, locale } = await getT(report);
  const { t: tc } = await getT(common);
  const dateFmt = new Intl.DateTimeFormat(INTL[locale], { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" });

  const { data } = await supabase
    .from("reports")
    .select("*, listing:listings(id, title, status), profile:profiles!reports_profile_id_fkey(username)")
    .order("created_at", { ascending: false })
    .limit(300);
  const reports = ((data ?? []) as Row[]).sort((a, b) => ORDER[a.status] - ORDER[b.status]);
  const open = reports.filter((r) => r.status === "open").length;

  return (
    <div className="wrap grid max-w-3xl gap-5 py-8">
      <div>
        <Link href="/admin" className="text-sm font-semibold text-muted hover:text-fg">{t("admin.back")}</Link>
        <p className="eyebrow mt-3">{t("admin.eyebrow")}</p>
        <h1 className="text-3xl font-extrabold">{t("admin.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("admin.summary", { n: reports.length, open })}</p>
      </div>

      {reports.length === 0 ? <Empty>{t("admin.empty")}</Empty> : (
        <ul className="grid gap-4">
          {reports.map((r) => (
            <li key={r.id} className={`card grid gap-3 p-4 sm:p-5 ${r.status === "closed" ? "opacity-70" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold">{tc(`reason.${r.reason}`)}</div>
                  <div className="text-sm text-muted">{dateFmt.format(new Date(r.created_at))}</div>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${PILL[r.status]}`}>{t(`admin.status.${r.status}`)}</span>
              </div>

              <div className="text-sm">
                {r.listing_id ? (
                  <>
                    <span className="text-muted">{t("admin.listing")}: </span>
                    <Link href={`/artikel/${r.listing_id}`} className="break-words font-semibold text-accent hover:underline">
                      {r.listing?.title ?? t("admin.listingGone")}
                    </Link>
                    {r.listing?.status === "hidden" && <span className="text-muted"> ({t("admin.listingHidden")})</span>}
                  </>
                ) : r.profile ? (
                  <>
                    <span className="text-muted">{t("admin.profile")}: </span>
                    <Link href={`/verkaeufer/${encodeURIComponent(r.profile.username)}`} className="font-semibold text-accent hover:underline">{r.profile.username}</Link>
                  </>
                ) : null}
              </div>

              <p className="whitespace-pre-wrap break-words rounded-xl bg-surface-2 p-3 text-sm">{r.details || <span className="text-muted">{t("admin.noDetails")}</span>}</p>

              <div className="grid gap-0.5 text-xs text-muted">
                {r.contact_email && (
                  <span>{t("admin.contact")}: <a href={`mailto:${r.contact_email}`} className="break-all font-semibold text-fg hover:underline">{r.contact_email}</a></span>
                )}
                <span>{r.reporter_id ? t("admin.reporter") : t("admin.anon")}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {r.status === "open" && (
                  <form action={setReportStatus}>
                    <input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value="reviewed" />
                    <button className="btn-ghost btn-sm">{t("admin.markReviewed")}</button>
                  </form>
                )}
                {r.status !== "closed" ? (
                  <form action={setReportStatus}>
                    <input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value="closed" />
                    <button className="btn-ghost btn-sm">{t("admin.close")}</button>
                  </form>
                ) : (
                  <form action={setReportStatus}>
                    <input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value="open" />
                    <button className="btn-ghost btn-sm">{t("admin.reopen")}</button>
                  </form>
                )}
                {r.listing_id && r.listing?.status !== "hidden" && (
                  <form action={hideReportedListing}>
                    <input type="hidden" name="id" value={r.id} /><input type="hidden" name="listing_id" value={r.listing_id} />
                    <button className="btn-sm btn border-danger text-danger hover:bg-surface-2">{t("admin.hide")}</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
