import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupNotice } from "@/components/Bits";
import { getSession } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Anmelden", robots: { index: false } };
export const dynamic = "force-dynamic";

function safeNext(v: unknown) {
  return typeof v === "string" && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : "/konto";
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const { supabase, user } = await getSession();
  if (user) redirect(next);

  return (
    <div className="wrap max-w-md py-10 sm:py-16">
      <p className="eyebrow">Konto</p>
      <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Anmelden</h1>
      <p className="mt-2 text-muted">Willkommen zurück bei TastySoxx.</p>

      {sp.fehler && (
        <p role="alert" className="mt-5 rounded-xl border border-danger/40 p-3 text-sm text-danger">
          Der Link ist ungültig oder abgelaufen. Bitte melde dich an oder fordere einen neuen Link an.
        </p>
      )}

      <div className="card mt-6 p-5 sm:p-6">
        {supabase ? <LoginForm next={next} /> : <SetupNotice />}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Noch kein Konto?{" "}
        <Link href={next !== "/konto" ? `/registrieren?next=${encodeURIComponent(next)}` : "/registrieren"} className="font-semibold text-accent hover:underline">
          Jetzt registrieren
        </Link>
      </p>
    </div>
  );
}
