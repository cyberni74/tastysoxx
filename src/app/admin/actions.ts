"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/supabase/server";

const schema = z.object({ id: z.string().uuid(), verified: z.boolean() });

/** Admin-only: set a seller's verified flag (RLS + trigger enforce is_admin too). */
export async function setVerified(id: string, verified: boolean): Promise<void> {
  const parsed = schema.safeParse({ id, verified });
  if (!parsed.success) return;
  const { supabase, profile } = await getSession();
  if (!supabase || !profile?.is_admin) return;

  await supabase.from("profiles").update({ verified: parsed.data.verified }).eq("id", parsed.data.id);
  revalidatePath("/admin");
  revalidatePath("/verkaeufer/[username]", "page");
  revalidatePath("/marktplatz");
}
