import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupNotice } from "@/components/Bits";
import { account } from "@/i18n/messages/account";
import { getT } from "@/i18n/server";
import { getSession } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(account);
  return { title: t("login.meta"), robots: { index: false } };
}

function safeNext(v: unknown) {
  return typeof v === "string" && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : "/konto";
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const { supabase, user } = await getSession();
  if (user) redirect(next);
  const { t } = await getT(account);

  return (
    <div className="wrap max-w-md py-10 sm:py-16">
      <p className="eyebrow">{t("login.eyebrow")}</p>
      <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{t("login.title")}</h1>
      <p className="mt-2 text-muted">{t("login.lead")}</p>

      {sp.fehler && (
        <p role="alert" className="mt-5 rounded-xl border border-danger/40 p-3 text-sm text-danger">{t("login.badLink")}</p>
      )}

      <div className="card mt-6 p-5 sm:p-6">
        {supabase ? <LoginForm next={next} /> : <SetupNotice />}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        {t("login.noAccount")}{" "}
        <Link href={next !== "/konto" ? `/registrieren?next=${encodeURIComponent(next)}` : "/registrieren"} className="font-semibold text-accent hover:underline">
          {t("login.signupLink")}
        </Link>
      </p>
    </div>
  );
}
