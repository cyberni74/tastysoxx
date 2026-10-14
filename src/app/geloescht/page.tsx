import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { account } from "@/i18n/messages/account";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(account);
  return pageMeta({ title: t("deleted.title"), path: "/geloescht", noindex: true });
}

export default async function DeletedPage() {
  const { t } = await getT(account);
  return (
    <div className="wrap max-w-md py-16 text-center">
      <h1 className="text-3xl font-extrabold">{t("deleted.title")}</h1>
      <p className="mt-3 text-muted">{t("deleted.text")}</p>
      <Link href="/" className="btn-primary mt-6">{t("deleted.home")}</Link>
    </div>
  );
}
