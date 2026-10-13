import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";
import { SetupNotice } from "@/components/Bits";
import { ListingForm } from "../ListingForm";
import { createListing } from "../actions";

export const metadata: Metadata = { title: "Neuer Artikel" };
export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  const { supabase, user, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect("/anmelden?next=/dashboard/artikel/neu");
  if (profile?.role !== "seller") redirect("/dashboard");

  return (
    <div className="wrap grid max-w-3xl gap-5 py-8">
      <div>
        <Link href="/dashboard" className="text-sm text-muted hover:text-accent">← Dashboard</Link>
        <h1 className="mt-1 text-3xl font-extrabold">Neuer Artikel</h1>
      </div>
      <ListingForm action={createListing} userId={user.id} />
    </div>
  );
}
