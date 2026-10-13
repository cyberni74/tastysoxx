import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupNotice, VerifiedBadge } from "@/components/Bits";
import { account } from "@/i18n/messages/account";
import { getT } from "@/i18n/server";
import { getSession } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(account);
  return { title: t("konto.meta"), robots: { index: false } };
}

export default async function AccountPage() {
  const { supabase, user, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/konto");
  const { t } = await getT(account);
  if (!profile) {
    return (
      <div className="wrap max-w-2xl py-10">
        <h1 className="text-3xl font-extrabold">{t("konto.meta")}</h1>
        <p className="card mt-6 p-5 text-muted">{t("konto.noProfile")}</p>
        <form action="/abmelden" method="post" className="mt-4"><button className="btn-ghost">{t("konto.signOut")}</button></form>
      </div>
    );
  }

  const isSeller = profile.role === "seller";
  const links = [
    { href: "/konto/bestellungen", label: t("konto.orders"), hint: t("konto.ordersHint") },
    { href: "/nachrichten", label: t("konto.messages"), hint: t("konto.messagesHint") },
    ...(isSeller ? [{ href: "/dashboard", label: t("konto.dashboard"), hint: t("konto.dashboardHint") }] : []),
    ...(profile.is_admin ? [{ href: "/admin", label: t("konto.admin"), hint: t("konto.adminHint") }] : []),
  ];

  return (
    <div className="wrap max-w-3xl py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{t("konto.eyebrow")}</p>
          <h1 className="mt-1 break-words text-3xl font-extrabold sm:text-4xl">{t("konto.hello", { name: profile.username })}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-muted">
            <span className="chip">{isSeller ? t("konto.roleSeller") : t("konto.roleBuyer")}</span>
            {isSeller && profile.verified && <span className="inline-flex items-center gap-1.5 text-sm font-semibold"><VerifiedBadge /> {t("konto.verified")}</span>}
          </p>
        </div>
        <form action="/abmelden" method="post"><button className="btn-ghost btn-sm">{t("konto.signOut")}</button></form>
      </div>

      {isSeller && !profile.verified && (
        <p className="mt-6 rounded-2xl border border-line bg-accent-soft p-4 text-sm">
          <strong>{t("konto.pendingStrong")}</strong> {t("konto.pendingText")}
        </p>
      )}

      <nav className="mt-6 grid gap-3 sm:grid-cols-2" aria-label={t("konto.navLabel")}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="card flex items-center justify-between gap-3 p-4 transition hover:border-accent">
            <span className="min-w-0">
              <span className="block font-semibold">{l.label}</span>
              <span className="block text-sm text-muted">{l.hint}</span>
            </span>
            <span aria-hidden className="text-muted">→</span>
          </Link>
        ))}
      </nav>

      <section className="card mt-8 p-5 sm:p-6">
        <h2 className="text-xl font-extrabold">{t("konto.profile")}</h2>
        <p className="mb-5 mt-1 text-sm text-muted">{isSeller ? t("konto.profileSeller") : t("konto.profileBuyer")}</p>
        <ProfileForm profile={profile} />
      </section>

      <p className="mt-6 text-sm text-muted">
        {t("konto.signedInAs")} <span className="break-all">{user.email}</span> ·{" "}
        <Link href="/konto/passwort" className="font-semibold text-accent hover:underline">{t("konto.changePw")}</Link>
      </p>
    </div>
  );
}
