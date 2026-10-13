import Link from "next/link";
import { DEPARTMENTS } from "@/lib/constants";
import { getT } from "@/i18n/server";
import { common } from "@/i18n/messages/common";
import { Logo } from "./Logo";

const HELP = [
  { href: "/hilfe/kaufen-und-verkaufen", de: "So funktioniert Kaufen und Verkaufen" },
  { href: "/hilfe/versand-zahlung-privatsphaere", de: "Versand, Zahlung und Privatsphäre" },
  { href: "/hilfe/angebotsregeln", de: "Produktinformationen und Angebotsregeln" },
];

export async function Footer() {
  const { t } = await getT(common);
  const link = "hover:text-accent";
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="wrap grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="grid content-start gap-3">
          <Logo size="lg" />
          <p className="max-w-[36ch] text-sm text-muted">{t("footer.tagline")}</p>
        </div>
        <nav aria-label={t("nav.marketplace")}>
          <h4 className="eyebrow mb-3">{t("nav.marketplace")}</h4>
          <ul className="grid gap-1.5 text-sm">
            {DEPARTMENTS.map((d) => <li key={d.id}><Link href={d.path} className={link}>{t(`dept.${d.id}`)}</Link></li>)}
            <li><Link href="/verkaeufer" className={link}>{t("nav.sellers")}</Link></li>
          </ul>
        </nav>
        <nav aria-label={t("nav.sell")}>
          <h4 className="eyebrow mb-3">{t("nav.sell")}</h4>
          <ul className="grid gap-1.5 text-sm">
            <li><Link href="/verkaufen" className={link}>{t("nav.sell")}</Link></li>
            {DEPARTMENTS.map((d) => (
              <li key={d.id}><Link href={d.sellPath} className={link}>
                Getragene {t(`deptShort.${d.id}`)} verkaufen
              </Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t("nav.help")}>
          <h4 className="eyebrow mb-3">{t("nav.help")}</h4>
          <ul className="grid gap-1.5 text-sm">
            {HELP.map((h) => <li key={h.href}><Link href={h.href} className={link}>{h.de}</Link></li>)}
            <li><Link href="/kontakt" className={link}>{t("footer.contact")}</Link></li>
          </ul>
        </nav>
        <nav aria-label={t("footer.legal")}>
          <h4 className="eyebrow mb-3">{t("footer.legal")}</h4>
          <ul className="grid gap-1.5 text-sm">
            <li><Link href="/impressum" className={link}>{t("footer.imprint")}</Link></li>
            <li><Link href="/agb" className={link}>{t("footer.terms")}</Link></li>
            <li><Link href="/datenschutz" className={link}>{t("footer.privacy")}</Link></li>
            <li><Link href="/melden" className={link}>{t("report")}</Link></li>
          </ul>
        </nav>
      </div>
      <div className="wrap flex flex-wrap justify-between gap-3 border-t border-line py-4 text-sm text-muted">
        <span>© {new Date().getFullYear()} TastySoxx</span>
        <span>{t("footer.badges")}</span>
      </div>
    </footer>
  );
}
