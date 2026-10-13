import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { CopyEmail } from "./CopyEmail";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return { title: t("meta.contact") };
}

const NOTES = [1, 2, 3, 4] as const;

export default async function ContactPage() {
  const { t } = await getT(info);
  return (
    <div className="wrap grid max-w-2xl gap-6 py-10">
      <div>
        <p className="eyebrow">{t("contact.eyebrow")}</p>
        <h1 className="text-4xl font-extrabold">{t("contact.title")}</h1>
        <p className="mt-2 text-muted">{t("contact.lead")}</p>
      </div>
      <div className="card grid gap-3 p-5 sm:p-6">
        <h2 className="text-lg font-bold">{t("contact.email")}</h2>
        <CopyEmail email="support@tastysoxx.com" />
      </div>
      <div className="card grid gap-2 p-5 text-sm sm:p-6">
        <h2 className="text-lg font-bold">{t("contact.notesTitle")}</h2>
        <ul className="grid list-disc gap-1.5 pl-5 text-muted">
          {NOTES.map((n) => <li key={n}>{t(`contact.note${n}`)}</li>)}
        </ul>
        <p className="mt-2 text-muted">
          {t("contact.faq")} <Link href="/faq" className="font-semibold text-accent underline">{t("contact.faqLink")}</Link>.
        </p>
      </div>
    </div>
  );
}
