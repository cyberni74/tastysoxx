"use client";
import Link from "next/link";
import { useActionState } from "react";
import { useT } from "@/i18n/client";
import { account } from "@/i18n/messages/account";
import { updatePassword, type PasswordState } from "./actions";

export function PasswordForm() {
  const t = useT(account);
  const [state, action, pending] = useActionState<PasswordState, FormData>(updatePassword, {});

  if (state.ok) {
    return (
      <div className="grid gap-4" role="status">
        <p className="rounded-xl bg-accent-soft p-3 font-medium">{state.ok}</p>
        <Link href="/konto" className="btn-primary">{t("pw.toAccount")}</Link>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <label className="label">
        {t("pw.new")}
        <input className="input" type="password" name="password" autoComplete="new-password" required minLength={8} />
        <span className="text-xs font-normal text-muted">{t("form.minPw")}</span>
      </label>
      <label className="label">
        {t("pw.repeat")}
        <input className="input" type="password" name="confirm" autoComplete="new-password" required minLength={8} />
      </label>
      {state.error && <p role="alert" className="text-sm font-medium text-danger">{state.error}</p>}
      <button className="btn-primary" disabled={pending}>{pending ? t("pw.saving") : t("pw.save")}</button>
    </form>
  );
}
