"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/supabase/server";
import { SUPABASE_URL } from "@/lib/supabase/env";
import { getT } from "@/i18n/server";
import { seller } from "@/i18n/messages/seller";
import { common } from "@/i18n/messages/common";
import type { T } from "@/i18n/define";

export type FormState = { error?: string };
type ST = T<(typeof seller)["de"]>;

const BUCKET = "listing-images";

/** "12,50" | "12.50" | "1.234,50" | "12 €" → cents, or null when invalid. */
function parsePrice(raw: string): number | null {
  let s = raw.replace(/[\s€]/g, "");
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  return Math.round(Number(s) * 100);
}

const makeSchema = (t: ST) => z.object({
  title: z.string().trim().min(3, t("v.titleMin")).max(80, t("v.titleMax")),
  description: z.string().trim().max(2000, t("v.descMax")),
  category: z.enum(["sneaker", "sport", "knie", "nylon"], { message: t("v.category") }),
  material: z.enum(["Baumwolle", "Wolle", "Nylon", "Synthetik"], { message: t("v.material") }),
  wear_days: z.coerce.number({ message: t("v.wearMissing") }).int(t("v.wearInt"))
    .min(1, t("v.wearMin")).max(30, t("v.wearMax")),
  price_cents: z.number({ message: t("v.price") }).int().min(500, t("v.priceMin")).max(50000, t("v.priceMax")),
  images: z.array(z.string().url(t("v.imageUrl"))).max(6, t("v.imagesMax")),
});

async function requireSeller() {
  const { t } = await getT(seller);
  const { t: tc } = await getT(common);
  const { supabase, user, profile } = await getSession();
  if (!supabase) return { error: t("act.noDb") } as const;
  if (!user) return { error: tc("err.notLoggedIn") } as const;
  if (profile?.role !== "seller") return { error: t("act.sellerOnly") } as const;
  return { supabase, user, t } as const;
}

function parseForm(formData: FormData, uid: string, t: ST) {
  let images: unknown = [];
  try {
    images = JSON.parse(String(formData.get("images") ?? "[]"));
  } catch {
    return { error: t("act.imagesRead") } as const;
  }
  const price = parsePrice(String(formData.get("price") ?? ""));
  const parsed = makeSchema(t).safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    category: formData.get("category"),
    material: formData.get("material"),
    wear_days: formData.get("wear_days"),
    price_cents: price ?? Number.NaN,
    images,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? t("v.check") } as const;

  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${uid}/`;
  if (parsed.data.images.some((u) => !u.startsWith(prefix) || u.slice(prefix.length).includes(".."))) {
    return { error: t("act.imagesOrigin") } as const;
  }
  return { data: parsed.data } as const;
}

export async function createListing(_prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireSeller();
  if ("error" in ctx) return { error: ctx.error };
  const parsed = parseForm(formData, ctx.user.id, ctx.t);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await ctx.supabase.from("listings").insert({ ...parsed.data, seller_id: ctx.user.id });
  if (error) return { error: ctx.t("act.saveFailed") };

  revalidatePath("/dashboard");
  revalidatePath("/shop");
  redirect("/dashboard");
}

export async function updateListing(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const ctx = await requireSeller();
  if ("error" in ctx) return { error: ctx.error };
  const parsed = parseForm(formData, ctx.user.id, ctx.t);
  if ("error" in parsed) return { error: parsed.error };

  const { data, error } = await ctx.supabase
    .from("listings").update(parsed.data)
    .eq("id", id).eq("seller_id", ctx.user.id).in("status", ["active", "hidden"])
    .select("id");
  if (error) return { error: ctx.t("act.saveFailed") };
  if (!data?.length) return { error: ctx.t("act.locked") };

  revalidatePath("/dashboard");
  revalidatePath(`/artikel/${id}`);
  revalidatePath("/shop");
  redirect("/dashboard");
}

export async function setListingHidden(id: string, hidden: boolean): Promise<FormState> {
  const ctx = await requireSeller();
  if ("error" in ctx) return { error: ctx.error };

  const { data, error } = await ctx.supabase
    .from("listings").update({ status: hidden ? "hidden" : "active" })
    .eq("id", id).eq("seller_id", ctx.user.id).eq("status", hidden ? "active" : "hidden")
    .select("id");
  if (error) return { error: ctx.t("act.toggleFailed") };
  if (!data?.length) return { error: ctx.t("act.toggleInvalid") };

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/artikel/${id}`);
  revalidatePath(`/artikel/${id}`);
  revalidatePath("/shop");
  return {};
}

export async function deleteListing(id: string): Promise<FormState> {
  const ctx = await requireSeller();
  if ("error" in ctx) return { error: ctx.error };

  const { data, error } = await ctx.supabase
    .from("listings").delete()
    .eq("id", id).eq("seller_id", ctx.user.id).in("status", ["active", "hidden"])
    .select("images");
  // order_items still reference listings that were ordered and cancelled
  if (error) return { error: ctx.t("act.deleteHistory") };
  if (!data?.length) return { error: ctx.t("act.deleteInvalid") };

  // best-effort cleanup of the uploaded photos
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  const paths = ((data[0].images ?? []) as string[])
    .filter((u) => u.startsWith(`${prefix}${ctx.user.id}/`))
    .map((u) => u.slice(prefix.length));
  if (paths.length) await ctx.supabase.storage.from(BUCKET).remove(paths);

  revalidatePath("/dashboard");
  revalidatePath("/shop");
  redirect("/dashboard");
}
