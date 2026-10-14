"use client";
import Link from "next/link";
import { useActionState } from "react";
import { useT } from "@/i18n/client";
import { account } from "@/i18n/messages/account";
import { signUp, type SignupState } from "./actions";

export function SignupForm({ next }: { next: string }) {
  const t = useT(account);
  const [state, action, pending] = useActionState<SignupState, FormData>(signUp, {});

  if (state.confirmEmail) {
    return (
      <div className="grid gap-3 text-center" role="status">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-accent-soft text-2xl" aria-hidden>✉</div>
        <h2 className="text-2xl font-extrabold">{t("signup.confirmTitle")}</h2>
        <p className="text-muted">
          {t("signup.confirmA")} <strong className="break-all text-fg">{state.confirmEmail}</strong>{t("signup.confirmB").startsWith(".") ? "" : " "}{t("signup.confirmB")}
        </p>
        <Link href="/anmelden" className="btn-ghost mt-2">{t("signup.toLogin")}</Link>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="label">
        {t("signup.username")}
        <input className="input" name="username" autoComplete="username" required minLength={3} maxLength={24}
          pattern="[A-Za-z0-9_.\-]{3,24}" title={t("signup.usernameTitle")} />
        <span className="text-xs font-normal text-muted">{t("signup.usernameHint")}</span>
      </label>
      <label className="label">
        {t("form.email")}
        <input className="input" type="email" name="email" autoComplete="email" required />
      </label>
      <label className="label">
        {t("form.password")}
        <input className="input" type="password" name="password" autoComplete="new-password" required minLength={8} />
        <span className="text-xs font-normal text-muted">{t("form.minPw")}</span>
      </label>

      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-semibold">{t("signup.roleLegend")}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {([
            ["buyer", t("signup.roleBuyer")],
            ["seller", t("signup.roleSeller")],
          ] as const).map(([value, text]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-3 font-medium has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
              <input type="radio" name="role" value={value} defaultChecked={value === "buyer"} className="accent-[var(--accent)]" required />
              {text}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-2.5 text-sm">
        <input type="checkbox" name="adult" required className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]" />
        <span>{t("signup.adult")}</span>
      </label>
      <label className="flex items-start gap-2.5 text-sm">
        <input type="checkbox" name="sensitive" required className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]" />
        <span>{t("signup.sensitive")}</span>
      </label>
      <label className="flex items-start gap-2.5 text-sm">
        <input type="checkbox" name="terms" required className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]" />
        <span>
          {t("signup.termsA")} <Link href="/agb" target="_blank" className="font-semibold text-accent underline">{t("signup.terms")}</Link>{" "}
          {t("signup.termsAnd")} <Link href="/datenschutz" target="_blank" className="font-semibold text-accent underline">{t("signup.privacy")}</Link>.
        </span>
      </label>

      {state.error && <p role="alert" className="text-sm font-medium text-danger">{state.error}</p>}
      <button className="btn-primary" disabled={pending}>{pending ? t("signup.pending") : t("signup.submit")}</button>
    </form>
  );
}
