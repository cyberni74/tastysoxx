import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { getT } from "@/i18n/server";
import { common } from "@/i18n/messages/common";
import { Logo } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";

export async function Footer() {
  const { t } = await getT(common);
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="wrap grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="grid content-start gap-3">
          <Logo size="lg" />
          <p className="max-w-[36ch] text-sm text-muted">{t("footer.tagline")}</p>
          <LanguageSwitch className="w-fit" />
        </div>
        <div>
          <h4 className="eyebrow mb-3">{t("footer.shop")}</h4>
          <ul className="grid gap-1.5 text-sm">
            {CATEGORIES.map((c) => <li key={c.id}><Link href={`/shop?kat=${c.id}`} className="hover:text-accent">{t(`cat.${c.id}`)}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-3">{t("footer.info")}</h4>
          <ul className="grid gap-1.5 text-sm">
            <li><Link href="/faq" className="hover:text-accent">{t("footer.faq")}</Link></li>
            <li><Link href="/verkaufen" className="hover:text-accent">{t("footer.sell")}</Link></li>
            <li><Link href="/kontakt" className="hover:text-accent">{t("footer.contact")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-3">{t("footer.legal")}</h4>
          <ul className="grid gap-1.5 text-sm">
            <li><Link href="/impressum" className="hover:text-accent">{t("footer.imprint")}</Link></li>
            <li><Link href="/agb" className="hover:text-accent">{t("footer.terms")}</Link></li>
            <li><Link href="/datenschutz" className="hover:text-accent">{t("footer.privacy")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap flex flex-wrap justify-between gap-3 border-t border-line py-4 text-sm text-muted">
        <span>© {new Date().getFullYear()} TastySoxx</span>
        <span>{t("footer.badges")}</span>
      </div>
    </footer>
  );
}
