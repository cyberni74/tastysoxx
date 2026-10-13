import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return { title: t("meta.sell"), description: t("meta.sellDesc") };
}

const WHY = [1, 2, 3] as const;
const STEPS = [1, 2, 3, 4] as const;
const TIPS = [1, 2, 3, 4, 5] as const;

export default async function SellPage() {
  const { t } = await getT(info);
  return (
    <div className="wrap grid gap-14 py-10">
      <section className="grid max-w-2xl gap-4">
        <p className="eyebrow">{t("sell.eyebrow")}</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">{t("sell.title")}</h1>
        <p className="text-lg text-muted">{t("sell.lead")}</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/registrieren" className="btn-primary">{t("sell.cta")}</Link>
          <Link href="/faq" className="btn-ghost">{t("sell.faq")}</Link>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-2xl font-bold">{t("sell.whyTitle")}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {WHY.map((n) => (
            <div key={n} className="card p-5">
              <h3 className="text-lg font-bold">{t(`sell.why${n}.t`)}</h3>
              <p className="mt-1 text-sm text-muted">{t(`sell.why${n}.d`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-2xl font-bold">{t("sell.howTitle")}</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((n) => (
            <li key={n} className="card grid content-start gap-2 p-5">
              <span className="grid size-9 place-items-center rounded-full bg-accent font-display font-bold text-accent-fg">{n}</span>
              <h3 className="text-lg font-bold">{t(`sell.step${n}.t`)}</h3>
              <p className="text-sm text-muted">{t(`sell.step${n}.d`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="card grid content-start gap-3 p-6">
          <h2 className="text-2xl font-bold">{t("sell.feesTitle")}</h2>
          <p className="font-display text-4xl font-extrabold text-accent">10 %</p>
          <p className="text-muted">{t("sell.feesText")}</p>
          <p className="rounded-xl bg-accent-soft p-3 text-sm">{t("sell.feesNote")}</p>
        </div>
        <div className="card grid content-start gap-3 p-6">
          <h2 className="text-2xl font-bold">{t("sell.tipsTitle")}</h2>
          <ul className="grid gap-2 text-sm">
            {TIPS.map((n) => (
              <li key={n} className="flex gap-2"><span className="text-ok" aria-hidden>✓</span><span>{t(`sell.tip${n}`)}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card grid justify-items-start gap-3 bg-accent-soft p-6 sm:p-8">
        <h2 className="text-2xl font-bold">{t("sell.readyTitle")}</h2>
        <p className="max-w-xl text-muted">{t("sell.readyText")}</p>
        <Link href="/registrieren" className="btn-primary">{t("sell.readyCta")}</Link>
      </section>
    </div>
  );
}
