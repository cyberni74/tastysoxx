import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupNotice } from "@/components/Bits";
import { getSession } from "@/lib/supabase/server";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Kasse", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const { supabase, user, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/kasse");

  return (
    <div className="wrap py-8 sm:py-12">
      <Link href="/warenkorb" className="text-sm font-semibold text-muted hover:text-fg">← Warenkorb</Link>
      <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Kasse</h1>
      <p className="mb-6 mt-2 text-muted">Diskreter Versand in neutraler Verpackung.</p>
      <CheckoutForm defaultCountry={profile?.country ?? "DE"} />
    </div>
  );
}
