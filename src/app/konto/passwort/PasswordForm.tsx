"use client";
import Link from "next/link";
import { useActionState } from "react";
import { updatePassword, type PasswordState } from "./actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(updatePassword, {});

  if (state.ok) {
    return (
      <div className="grid gap-4" role="status">
        <p className="rounded-xl bg-accent-soft p-3 font-medium">{state.ok}</p>
        <Link href="/konto" className="btn-primary">Zum Konto</Link>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <label className="label">
        Neues Passwort
        <input className="input" type="password" name="password" autoComplete="new-password" required minLength={8} />
        <span className="text-xs font-normal text-muted">Mindestens 8 Zeichen.</span>
      </label>
      <label className="label">
        Passwort wiederholen
        <input className="input" type="password" name="confirm" autoComplete="new-password" required minLength={8} />
      </label>
      {state.error && <p role="alert" className="text-sm font-medium text-danger">{state.error}</p>}
      <button className="btn-primary" disabled={pending}>{pending ? "Wird gespeichert…" : "Passwort speichern"}</button>
    </form>
  );
}
