"use client";
import { useActionState, useState } from "react";
import { useT } from "@/i18n/client";
import { account } from "@/i18n/messages/account";
import { requestPasswordReset, signIn, type FormState } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const t = useT(account);
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [loginState, loginAction, loginPending] = useActionState<FormState, FormData>(signIn, {});
  const [resetState, resetAction, resetPending] = useActionState<FormState, FormData>(requestPasswordReset, {});

  if (mode === "reset") {
    return (
      <form action={resetAction} className="grid gap-4">
        <p className="text-sm text-muted">{t("reset.lead")}</p>
        <label className="label">
          {t("form.email")}
          <input className="input" type="email" name="email" autoComplete="email" required />
        </label>
        {resetState.error && <p role="alert" className="text-sm font-medium text-danger">{resetState.error}</p>}
        {resetState.ok && <p role="status" className="rounded-xl bg-accent-soft p-3 text-sm">{resetState.ok}</p>}
        <button className="btn-primary" disabled={resetPending}>{resetPending ? t("reset.pending") : t("reset.submit")}</button>
        <button type="button" className="text-sm font-semibold text-accent underline-offset-2 hover:underline" onClick={() => setMode("login")}>
          {t("reset.back")}
        </button>
      </form>
    );
  }

  return (
    <form action={loginAction} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="label">
        {t("form.email")}
        <input className="input" type="email" name="email" autoComplete="email" required />
      </label>
      <label className="label">
        {t("form.password")}
        <input className="input" type="password" name="password" autoComplete="current-password" required />
      </label>
      <div className="-mt-2 text-right">
        <button type="button" className="text-sm font-semibold text-accent underline-offset-2 hover:underline" onClick={() => setMode("reset")}>
          {t("login.forgot")}
        </button>
      </div>
      {loginState.error && <p role="alert" className="text-sm font-medium text-danger">{loginState.error}</p>}
      <button className="btn-primary" disabled={loginPending}>{loginPending ? t("login.pending") : t("login.submit")}</button>
    </form>
  );
}
