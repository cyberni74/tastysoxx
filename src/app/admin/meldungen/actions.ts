"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/supabase/server";

async function requireAdmin() {
  const { supabase, profile } = await getSession();
  if (!supabase || !profile?.is_admin) throw new Error("Nicht erlaubt");
  return supabase;
}

const statusSchema = z.object({ id: z.string().uuid(), status: z.enum(["open", "reviewed", "closed"]) });

export async function setReportStatus(formData: FormData): Promise<void> {
  const parsed = statusSchema.safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) return;
  const supabase = await requireAdmin();
  const { error } = await supabase.from("reports").update({ status: parsed.data.status }).eq("id", parsed.data.id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/meldungen");
}

const hideSchema = z.object({ id: z.string().uuid(), listing_id: z.string().uuid() });

/** Hides the reported listing (admin_hide_listing RPC, see migration 0004) and marks the report reviewed. */
export async function hideReportedListing(formData: FormData): Promise<void> {
  const parsed = hideSchema.safeParse({ id: formData.get("id"), listing_id: formData.get("listing_id") });
  if (!parsed.success) return;
  const supabase = await requireAdmin();
  const { error } = await supabase.rpc("admin_hide_listing", { listing_id: parsed.data.listing_id });
  if (error) throw new Error(error.message);
  await supabase.from("reports").update({ status: "reviewed" }).eq("id", parsed.data.id).eq("status", "open");
  revalidatePath("/admin/meldungen");
  revalidatePath(`/artikel/${parsed.data.listing_id}`);
  revalidatePath("/marktplatz");
}
