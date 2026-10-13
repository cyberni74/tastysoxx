import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupNotice, VerifiedBadge } from "@/components/Bits";
import { getSession } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = { title: "Mein Konto", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { supabase, user, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/konto");
  if (!profile) {
    return (
      <div className="wrap max-w-2xl py-10">
        <h1 className="text-3xl font-extrabold">Mein Konto</h1>
        <p className="card mt-6 p-5 text-muted">Dein Profil konnte nicht geladen werden. Bitte melde dich ab und erneut an.</p>
        <form action="/abmelden" method="post" className="mt-4"><button className="btn-ghost">Abmelden</button></form>
      </div>
    );
  }

  const isSeller = profile.role === "seller";
  const links = [
    { href: "/konto/bestellungen", label: "Meine Bestellungen", hint: "Status, Zahlung, Bewertungen" },
    { href: "/nachrichten", label: "Nachrichten", hint: "Chats mit Käufern und Verkäuferinnen" },
    ...(isSeller ? [{ href: "/dashboard", label: "Verkäufer-Dashboard", hint: "Angebote und Verkäufe verwalten" }] : []),
    ...(profile.is_admin ? [{ href: "/admin", label: "Admin", hint: "Verifizierung und Moderation" }] : []),
  ];

  return (
    <div className="wrap max-w-3xl py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">Mein Konto</p>
          <h1 className="mt-1 break-words text-3xl font-extrabold sm:text-4xl">Hallo, {profile.username}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-muted">
            <span className="chip">{isSeller ? "Verkäuferin" : "Käufer"}</span>
            {isSeller && profile.verified && <span className="inline-flex items-center gap-1.5 text-sm font-semibold"><VerifiedBadge /> Verifiziert</span>}
          </p>
        </div>
        <form action="/abmelden" method="post"><button className="btn-ghost btn-sm">Abmelden</button></form>
      </div>

      {isSeller && !profile.verified && (
        <p className="mt-6 rounded-2xl border border-line bg-accent-soft p-4 text-sm">
          <strong>Verifizierung: ausstehend</strong> – wir prüfen Ausweis und Selfie per E-Mail.
        </p>
      )}

      <nav className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Kontobereiche">
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
        <h2 className="text-xl font-extrabold">Profil</h2>
        <p className="mb-5 mt-1 text-sm text-muted">
          {isSeller ? "Diese Angaben sehen Käufer auf deinem Profil." : "Dein Profil ist für Verkäuferinnen sichtbar."}
        </p>
        <ProfileForm profile={profile} />
      </section>

      <p className="mt-6 text-sm text-muted">
        Angemeldet als <span className="break-all">{user.email}</span> ·{" "}
        <Link href="/konto/passwort" className="font-semibold text-accent hover:underline">Passwort ändern</Link>
      </p>
    </div>
  );
}
