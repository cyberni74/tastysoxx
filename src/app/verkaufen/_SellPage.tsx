import Link from "next/link";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { common } from "@/i18n/messages/common";
import { departmentById } from "@/lib/constants";
import type { Department } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import { FaqSection, type QA } from "../hilfe/_Guide";

/** Product-type specific copy for one sell sub-page, per locale. */
export type SellContent = {
  title: string;
  description: string;
  intro: string;
  listing: string[];
  photos: string[];
  pricing: { label: string; range: string }[];
  packaging: string[];
  notAllowed: string[];
  faq: QA[];
};

export const pickContent = (c: Record<Locale, SellContent>, locale: Locale) => c[locale] ?? c.de;

function List({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-1.5 text-muted">
      {items.map((i) => <li key={i} className="flex gap-2"><span className="text-accent" aria-hidden>•</span><span>{i}</span></li>)}
    </ul>
  );
}

export async function SellPage({ dept, content }: { dept: Department; content: Record<Locale, SellContent> }) {
  const { t, locale } = await getT(info);
  const { t: tc } = await getT(common);
  const c = pickContent(content, locale);
  const d = departmentById(dept);

  return (
    <article className="wrap grid max-w-3xl gap-10 py-10">
      <header className="grid gap-3">
        <Link href="/verkaufen" className="text-sm text-muted hover:text-accent">{t("sellSub.back")}</Link>
        <p className="eyebrow">{t("sellSub.eyebrow")}</p>
        <h1 className="text-4xl font-extrabold">{c.title}</h1>
        <p className="text-lg text-muted">{c.intro}</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/registrieren" className="btn-primary">{t("sellSub.cta")}</Link>
          {d && <Link href={d.path} className="btn-ghost">{t("sellSub.buyer")}: {tc(`deptShort.${dept}`)}</Link>}
        </div>
      </header>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("sellSub.listing")}</h2>
        <List items={c.listing} />
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("sellSub.photos")}</h2>
        <List items={c.photos} />
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("sellSub.pricing")}</h2>
        <div className="card divide-y divide-line overflow-hidden">
          {c.pricing.map((p) => (
            <div key={p.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-3.5">
              <span>{p.label}</span>
              <span className="font-display font-bold tabular-nums">{p.range}</span>
            </div>
          ))}
        </div>
        <p className="rounded-xl bg-accent-soft p-3 text-sm">{t("sellSub.pricingNote")}</p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("sellSub.packaging")}</h2>
        <List items={c.packaging} />
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("sellSub.notAllowed")}</h2>
        <ul className="grid gap-1.5 text-muted">
          {c.notAllowed.map((i) => <li key={i} className="flex gap-2"><span className="text-danger" aria-hidden>✕</span><span>{i}</span></li>)}
        </ul>
        <Link href="/hilfe/angebotsregeln" className="text-sm font-semibold text-accent underline">{t("sellSub.rules")}</Link>
      </section>

      <FaqSection title={t("sellSub.faq")} items={c.faq} />

      <section className="card grid justify-items-start gap-3 bg-accent-soft p-6">
        <h2 className="text-2xl font-bold">{t("sell.readyTitle")}</h2>
        <p className="text-muted">{t("sell.readyText")}</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/registrieren" className="btn-primary">{t("sellSub.cta")}</Link>
          {d && <Link href={d.path} className="btn-ghost">{t("sellSub.buyer")}: {tc(`deptShort.${dept}`)}</Link>}
        </div>
      </section>
    </article>
  );
}
