"use client";
import { useActionState, useState } from "react";
import { requestPasswordReset, signIn, type FormState } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [loginState, loginAction, loginPending] = useActionState<FormState, FormData>(signIn, {});
  const [resetState, resetAction, resetPending] = useActionState<FormState, FormData>(requestPasswordReset, {});

  if (mode === "reset") {
    return (
      <form action={resetAction} className="grid gap-4">
        <p className="text-sm text-muted">Gib deine E-Mail-Adresse ein. Wir schicken dir einen Link, mit dem du ein neues Passwort setzen kannst.</p>
        <label className="label">
          E-Mail
          <input className="input" type="email" name="email" autoComplete="email" required />
        </label>
        {resetState.error && <p role="alert" className="text-sm font-medium text-danger">{resetState.error}</p>}
        {resetState.ok && <p role="status" className="rounded-xl bg-accent-soft p-3 text-sm">{resetState.ok}</p>}
        <button className="btn-primary" disabled={resetPending}>{resetPending ? "Wird gesendet…" : "Link senden"}</button>
        <button type="button" className="text-sm font-semibold text-accent underline-offset-2 hover:underline" onClick={() => setMode("login")}>
          Zurück zur Anmeldung
        </button>
      </form>
    );
  }

  return (
    <form action={loginAction} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <label className="label">
        E-Mail
        <input className="input" type="email" name="email" autoComplete="email" required />
      </label>
      <label className="label">
        Passwort
        <input className="input" type="password" name="password" autoComplete="current-password" required />
      </label>
      <div className="-mt-2 text-right">
        <button type="button" className="text-sm font-semibold text-accent underline-offset-2 hover:underline" onClick={() => setMode("reset")}>
          Passwort vergessen?
        </button>
      </div>
      {loginState.error && <p role="alert" className="text-sm font-medium text-danger">{loginState.error}</p>}
      <button className="btn-primary" disabled={loginPending}>{loginPending ? "Wird angemeldet…" : "Anmelden"}</button>
    </form>
  );
}
