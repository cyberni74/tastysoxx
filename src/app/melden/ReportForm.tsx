"use client";
import Link from "next/link";
import { useActionState } from "react";
import { useT } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { report } from "@/i18n/messages/report";
import { REPORT_REASONS } from "@/lib/constants";
import { submitReport, type ReportState } from "./actions";

export type ReportTarget =
  | { kind: "listing"; id: string; title: string; seller: string | null }
  | { kind: "profile"; username: string }
  | null;

export function ReportForm({ target }: { target: ReportTarget }) {
  const t = useT(report);
  const tc = useT(common);
  const [state, action, pending] = useActionState<ReportState, FormData>(submitReport, {});

  if (state.ok) {
    return (
      <div className="grid gap-4" role="status">
        <h2 className="text-2xl font-extrabold">{t("success.title")}</h2>
        <p>{t("success.text")}</p>
        <div className="flex flex-wrap gap-3">
          {state.back && (
            <Link href={state.back.href} className="btn-primary">
              {state.back.kind === "listing" ? t("success.backListing") : t("success.backProfile")}
            </Link>
          )}
          <Link href="/" className="btn-ghost">{t("success.home")}</Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      {target?.kind === "listing" && <input type="hidden" name="listing_id" value={target.id} />}
      {target?.kind === "profile" && <input type="hidden" name="username" value={target.username} />}

      {target ? (
        <div className="rounded-xl bg-surface-2 p-3 text-sm">
          <span className="text-muted">{target.kind === "listing" ? t("target.listing") : t("target.profile")}</span>
          <div className="mt-0.5 break-words font-semibold">
            {target.kind === "listing" ? <>„{target.title}“{target.seller && <span className="font-normal text-muted"> · {target.seller}</span>}</> : target.username}
          </div>
          <Link href="/melden" className="mt-1 inline-block text-xs font-semibold text-accent hover:underline">{t("target.change")}</Link>
        </div>
      ) : (
        <label className="label">
          {t("target.input")}
          <input className="input" name="target" required maxLength={300} autoComplete="off" />
          <span className="text-xs font-normal text-muted">{t("target.inputHint")}</span>
        </label>
      )}

      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-semibold">{t("reason")}</legend>
        {REPORT_REASONS.map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-medium has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
            <input type="radio" name="reason" value={r} required className="accent-[var(--accent)]" />
            {tc(`reason.${r}`)}
          </label>
        ))}
      </fieldset>

      <label className="label">
        {t("details")}
        <textarea name="details" rows={5} maxLength={1000} className="input resize-y" placeholder={t("detailsPh")} />
        <span className="text-xs font-normal text-muted">{t("detailsHint")}</span>
      </label>

      <label className="label">
        <span>{t("contact")} <span className="font-normal text-muted">{t("optional")}</span></span>
        <input className="input" type="email" name="contact_email" maxLength={200} autoComplete="email" />
        <span className="text-xs font-normal text-muted">{t("contactHint")}</span>
      </label>

      {state.error && <p role="alert" className="text-sm font-medium text-danger">{state.error}</p>}
      <div>
        <button className="btn-primary" disabled={pending}>{pending ? t("pending") : t("submit")}</button>
      </div>
    </form>
  );
}
