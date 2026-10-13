import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";
import { getT } from "@/i18n/server";
import { seller } from "@/i18n/messages/seller";
import { SetupNotice } from "@/components/Bits";
import { ListingForm } from "../ListingForm";
import { createListing } from "../actions";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(seller);
  return { title: t("meta.new") };
}
export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  const { supabase, user, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/dashboard/artikel/neu");
  if (profile?.role !== "seller") redirect("/dashboard");
  const { t } = await getT(seller);

  return (
    <div className="wrap grid max-w-3xl gap-5 py-8">
      <div>
        <Link href="/dashboard" className="text-sm text-muted hover:text-accent">{t("back.dashboard")}</Link>
        <h1 className="mt-1 text-3xl font-extrabold">{t("meta.new")}</h1>
      </div>
      <ListingForm action={createListing} userId={user.id} />
    </div>
  );
}
