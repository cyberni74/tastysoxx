import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/server";
import type { Listing } from "@/lib/types";
import { SetupNotice } from "@/components/Bits";
import { ListingControls, ListingForm } from "../ListingForm";
import { deleteListing, setListingHidden, updateListing } from "../actions";

export const metadata: Metadata = { title: "Artikel bearbeiten" };
export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!user) redirect(`/anmelden?next=/dashboard/artikel/${id}`);
  if (profile?.role !== "seller") redirect("/dashboard");

  const { data } = await supabase.from("listings").select("*").eq("id", id).eq("seller_id", user.id).maybeSingle();
  const listing = data as Listing | null;
  if (!listing) notFound();

  const editable = listing.status === "active" || listing.status === "hidden";

  return (
    <div className="wrap grid max-w-3xl gap-5 py-8">
      <div>
        <Link href="/dashboard" className="text-sm text-muted hover:text-accent">← Dashboard</Link>
        <h1 className="mt-1 text-3xl font-extrabold">Artikel bearbeiten</h1>
        {listing.status !== "hidden" && (
          <Link href={`/artikel/${listing.id}`} className="text-sm font-semibold text-accent underline">Im Shop ansehen</Link>
        )}
      </div>
      {editable ? (
        <>
          <ListingForm action={updateListing.bind(null, listing.id)} userId={user.id} listing={listing} />
          <ListingControls
            status={listing.status as "active" | "hidden"}
            toggle={setListingHidden.bind(null, listing.id, listing.status === "active")}
            remove={deleteListing.bind(null, listing.id)}
          />
        </>
      ) : (
        <div className="card p-5 text-muted">
          Dieser Artikel ist {listing.status === "sold" ? "verkauft" : "reserviert"} und kann nicht mehr bearbeitet werden.{" "}
          <Link href="/dashboard/verkaeufe" className="font-semibold text-accent underline">Zu den Verkäufen</Link>
        </div>
      )}
    </div>
  );
}
