import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return pageMeta({ title: t("meta.help"), description: t("meta.helpDesc"), path: "/hilfe" });
}

const GUIDES = [
  { href: "/hilfe/kaufen-und-verkaufen", title: "guide.buySell", desc: "help.g1.d" },
  { href: "/hilfe/versand-zahlung-privatsphaere", title: "guide.ship", desc: "help.g2.d" },
  { href: "/hilfe/angebotsregeln", title: "guide.rules", desc: "help.g3.d" },
] as const;

export default async function HelpPage() {
  const { t } = await getT(info);
  return (
    <div className="wrap grid max-w-4xl gap-8 py-10">
      <div className="grid gap-3">
        <p className="eyebrow">{t("help.eyebrow")}</p>
        <h1 className="text-4xl font-extrabold">{t("help.title")}</h1>
        <p className="max-w-2xl text-lg text-muted">{t("help.lead")}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {GUIDES.map((g) => (
          <Link key={g.href} href={g.href} className="card grid content-start gap-2 p-5 transition hover:border-accent">
            <span className="eyebrow">{t("help.guide")}</span>
            <h2 className="text-xl font-bold">{t(g.title)}</h2>
            <p className="text-sm text-muted">{t(g.desc)}</p>
            <span className="text-sm font-semibold text-accent">{t("help.read")}</span>
          </Link>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="card grid content-start justify-items-start gap-2 p-5">
          <h2 className="text-xl font-bold">{t("help.contactTitle")}</h2>
          <p className="text-sm text-muted">{t("help.contactText")}</p>
          <Link href="/kontakt" className="btn-ghost btn-sm">{t("help.contactLink")}</Link>
        </div>
        <div className="card grid content-start justify-items-start gap-2 p-5">
          <h2 className="text-xl font-bold">{t("help.reportTitle")}</h2>
          <p className="text-sm text-muted">{t("help.reportText")}</p>
          <Link href="/melden" className="btn-ghost btn-sm">{t("help.reportLink")}</Link>
        </div>
      </div>
    </div>
  );
}
