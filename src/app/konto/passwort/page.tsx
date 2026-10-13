import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupNotice } from "@/components/Bits";
import { account } from "@/i18n/messages/account";
import { getT } from "@/i18n/server";
import { getSession } from "@/lib/supabase/server";
import { PasswordForm } from "./PasswordForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(account);
  return { title: t("pw.meta"), robots: { index: false } };
}

export default async function PasswordPage() {
  const { supabase, user } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/konto/passwort");
  const { t } = await getT(account);

  return (
    <div className="wrap max-w-md py-10 sm:py-16">
      <Link href="/konto" className="text-sm font-semibold text-muted hover:text-fg">{t("konto.back")}</Link>
      <h1 className="mt-3 text-3xl font-extrabold">{t("pw.title")}</h1>
      <p className="mt-2 text-muted">{t("pw.lead")}</p>
      <div className="card mt-6 p-5 sm:p-6">
        <PasswordForm />
      </div>
    </div>
  );
}
