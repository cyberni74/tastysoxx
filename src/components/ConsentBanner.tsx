"use client";
import { useEffect, useState } from "react";

/** Age gate (18+) followed by cookie notice. Stored per browser. */
export function ConsentBanner() {
  const [step, setStep] = useState<"age" | "cookie" | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("ts-age") !== "yes") setStep("age");
      else if (!localStorage.getItem("ts-cookie")) setStep("cookie");
    } catch { setStep("age"); }
  }, []);

  const save = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} };

  if (step === "age") {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="age-title">
        <div className="card w-full max-w-md p-6 shadow-xl">
          <h2 id="age-title" className="text-2xl font-extrabold">Bist du mindestens 18 Jahre alt?</h2>
          <p className="mt-2 text-muted">TastySoxx richtet sich ausschließlich an Erwachsene. Mit „Ja“ bestätigst du, volljährig zu sein.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => { save("ts-age", "yes"); setStep(localStorage.getItem("ts-cookie") ? null : "cookie"); }}>Ja, ich bin 18+</button>
            <a className="btn-ghost" href="https://www.google.com">Nein, verlassen</a>
          </div>
        </div>
      </div>
    );
  }
  if (step === "cookie") {
    return (
      <div className="card fixed inset-x-4 bottom-4 z-40 mx-auto grid max-w-xl gap-3 p-4 text-sm shadow-xl">
        <div><b>Cookies</b><br />Wir verwenden nur technisch notwendige Cookies für Login und Warenkorb. Keine Tracking-Cookies.</div>
        <div className="flex gap-2">
          <button className="btn-primary btn-sm" onClick={() => { save("ts-cookie", "ok"); setStep(null); }}>Verstanden</button>
        </div>
      </div>
    );
  }
  return null;
}
