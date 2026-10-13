import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupNotice } from "@/components/Bits";
import { getSession } from "@/lib/supabase/server";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = { title: "Passwort ändern", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PasswordPage() {
  const { supabase, user } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/konto/passwort");

  return (
    <div className="wrap max-w-md py-10 sm:py-16">
      <Link href="/konto" className="text-sm font-semibold text-muted hover:text-fg">← Mein Konto</Link>
      <h1 className="mt-3 text-3xl font-extrabold">Neues Passwort</h1>
      <p className="mt-2 text-muted">Wähle ein neues Passwort für dein Konto.</p>
      <div className="card mt-6 p-5 sm:p-6">
        <PasswordForm />
      </div>
    </div>
  );
}
