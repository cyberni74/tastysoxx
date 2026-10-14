"use client";
import { useState, useTransition } from "react";
import { rememberConsent } from "@/app/consent-actions";
import { useT } from "@/i18n/client";
import { common } from "@/i18n/messages/common";

/**
 * Age gate (18+) and cookie notice. Not rendered for signed-in users (they confirmed 18+ at
 * sign-up); visitors see each notice once, remembered for a year via a server-set cookie.
 */
export function ConsentBanner({ ageConfirmed, noticeSeen }: { ageConfirmed: boolean; noticeSeen: boolean }) {
  const t = useT(common);
  const [step, setStep] = useState<"age" | "cookie" | null>(!ageConfirmed ? "age" : !noticeSeen ? "cookie" : null);
  const [, start] = useTransition();

  const done = (kind: "age" | "cookie") => {
    start(() => { void rememberConsent(kind); });
    setStep(kind === "age" && !noticeSeen ? "cookie" : null);
  };

  if (step === "age") {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="age-title">
        <div className="card w-full max-w-md p-6 shadow-xl">
          <h2 id="age-title" className="text-2xl font-extrabold">{t("age.title")}</h2>
          <p className="mt-2 text-muted">{t("age.text")}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => done("age")}>{t("age.yes")}</button>
            <a className="btn-ghost" href="https://www.google.com">{t("age.no")}</a>
          </div>
        </div>
      </div>
    );
  }
  if (step === "cookie") {
    return (
      <div className="card fixed inset-x-4 bottom-4 z-40 mx-auto grid max-w-xl gap-3 p-4 text-sm shadow-xl">
        <div><b>{t("cookie.title")}</b><br />{t("cookie.text")}</div>
        <div className="flex gap-2">
          <button className="btn-primary btn-sm" onClick={() => done("cookie")}>{t("cookie.ok")}</button>
        </div>
      </div>
    );
  }
  return null;
}
