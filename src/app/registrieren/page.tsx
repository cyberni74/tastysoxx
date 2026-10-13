import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupNotice } from "@/components/Bits";
import { getSession } from "@/lib/supabase/server";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Registrieren", robots: { index: false } };
export const dynamic = "force-dynamic";

function safeNext(v: unknown) {
  return typeof v === "string" && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : "/konto";
}

export default async function SignupPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const { supabase, user } = await getSession();
  if (user) redirect(next);

  return (
    <div className="wrap max-w-md py-10 sm:py-16">
      <p className="eyebrow">Neu hier</p>
      <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Konto erstellen</h1>
      <p className="mt-2 text-muted">Kostenlos und diskret. Nur für Erwachsene ab 18.</p>

      <div className="card mt-6 p-5 sm:p-6">
        {supabase ? <SignupForm next={next} /> : <SetupNotice />}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Schon registriert?{" "}
        <Link href={next !== "/konto" ? `/anmelden?next=${encodeURIComponent(next)}` : "/anmelden"} className="font-semibold text-accent hover:underline">
          Anmelden
        </Link>
      </p>
    </div>
  );
}
