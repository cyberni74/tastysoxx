import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SetupNotice } from "@/components/Bits";
import { account } from "@/i18n/messages/account";
import { getT } from "@/i18n/server";
import { getSession } from "@/lib/supabase/server";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(account);
  return { title: t("checkout.meta"), robots: { index: false } };
}

export default async function CheckoutPage() {
  const { supabase, user, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/kasse");
  const { t } = await getT(account);

  return (
    <div className="wrap py-8 sm:py-12">
      <Link href="/warenkorb" className="text-sm font-semibold text-muted hover:text-fg">{t("checkout.back")}</Link>
      <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{t("checkout.title")}</h1>
      <p className="mb-6 mt-2 text-muted">{t("checkout.lead")}</p>
      <CheckoutForm defaultCountry={profile?.country ?? "DE"} />
    </div>
  );
}
