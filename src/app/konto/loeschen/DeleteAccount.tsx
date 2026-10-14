"use client";
import { useActionState } from "react";
import { useT } from "@/i18n/client";
import { account } from "@/i18n/messages/account";
import { deleteAccount, type DeleteState } from "./actions";

export function DeleteAccount() {
  const t = useT(account);
  const [state, action, pending] = useActionState<DeleteState, FormData>(deleteAccount, {});

  return (
    <section className="card mt-8 border-danger/50 p-5 sm:p-6" aria-labelledby="delete-title">
      <details>
        <summary id="delete-title" className="cursor-pointer text-xl font-extrabold text-danger">{t("delete.title")}</summary>
        <div className="mt-4 grid gap-4">
          <p className="text-muted">{t("delete.intro")}</p>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <div className="eyebrow mb-1.5">{t("delete.removedTitle")}</div>
              <ul className="grid list-disc gap-1 pl-5 text-muted marker:text-danger">
                <li>{t("delete.removed1")}</li><li>{t("delete.removed2")}</li><li>{t("delete.removed3")}</li><li>{t("delete.removed4")}</li>
              </ul>
            </div>
            <div>
              <div className="eyebrow mb-1.5">{t("delete.keptTitle")}</div>
              <ul className="grid list-disc gap-1 pl-5 text-muted marker:text-accent">
                <li>{t("delete.kept1")}</li><li>{t("delete.kept2")}</li>
              </ul>
            </div>
          </div>
          <p className="text-sm font-semibold">{t("delete.irreversible")}</p>

          <form action={action} className="grid gap-3">
            <label className="label" htmlFor="delete-password">
              {t("delete.password")}
              <input id="delete-password" name="password" type="password" required autoComplete="current-password" className="input" />
            </label>
            <label className="flex items-start gap-2.5 text-sm">
              <input type="checkbox" name="confirm" required className="mt-0.5 size-4 shrink-0 accent-[var(--danger)]" />
              <span>{t("delete.confirm")}</span>
            </label>
            {state.error && <p role="alert" className="text-sm font-medium text-danger">{state.error}</p>}
            <div>
              <button className="btn border-danger bg-danger text-bg hover:opacity-90" disabled={pending}>
                {pending ? t("delete.pending") : t("delete.submit")}
              </button>
            </div>
          </form>
        </div>
      </details>
    </section>
  );
}
