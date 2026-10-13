import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return { title: t("meta.notFound"), robots: { index: false } };
}

export default async function NotFound() {
  const { t } = await getT(info);
  return (
    <div className="wrap grid max-w-xl justify-items-center gap-4 py-20 text-center">
      <p className="font-display text-7xl font-extrabold text-accent">404</p>
      <h1 className="text-3xl font-extrabold">{t("nf.title")}</h1>
      <p className="text-muted">{t("nf.text")}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/marktplatz" className="btn-primary">{t("nf.shop")}</Link>
        <Link href="/" className="btn-ghost">{t("nf.home")}</Link>
      </div>
    </div>
  );
}
