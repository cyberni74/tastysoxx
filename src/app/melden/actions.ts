"use server";
import { z } from "zod";
import { report } from "@/i18n/messages/report";
import { getT } from "@/i18n/server";
import { REPORT_REASONS } from "@/lib/constants";
import { getSession } from "@/lib/supabase/server";

export type ReportState = {
  error?: string;
  ok?: boolean;
  back?: { kind: "listing" | "profile"; href: string };
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const USERNAME = /^[A-Za-z0-9_.-]{3,24}$/;

/** Accepts a listing/profile URL (or path), a listing id or a username. */
function parseTarget(raw: string): { listing: string } | { username: string } | null {
  let s = raw.trim();
  if (!s) return null;
  if (s.includes("/")) {
    try {
      s = new URL(/^https?:\/\//i.test(s) ? s : `https://x/${s.replace(/^\/+/, "")}`).pathname;
    } catch {
      return null;
    }
    const listing = s.match(/\/artikel\/([0-9a-f-]{36})(?:\/|$)/i);
    if (listing && UUID.test(listing[1])) return { listing: listing[1] };
    const profile = s.match(/\/verkaeufer\/([^/]+)\/?$/);
    if (!profile) return null;
    try { s = decodeURIComponent(profile[1]); } catch { return null; }
  }
  if (UUID.test(s)) return { listing: s };
  s = s.replace(/^@/, "");
  return USERNAME.test(s) ? { username: s } : null;
}

export async function submitReport(_prev: ReportState, formData: FormData): Promise<ReportState> {
  const { t } = await getT(report);
  const schema = z
    .object({
      reason: z.enum(REPORT_REASONS as [string, ...string[]], { errorMap: () => ({ message: t("err.reason") }) }),
      details: z.string().trim().max(1000, t("err.details")),
      contact_email: z.union([z.literal(""), z.string().trim().email(t("err.email")).max(200, t("err.email"))]),
    })
    .refine((d) => d.reason !== "sonstiges" || d.details.length >= 10, { message: t("err.detailsRequired") });
  const parsed = schema.safeParse({
    reason: formData.get("reason"),
    details: formData.get("details") ?? "",
    contact_email: String(formData.get("contact_email") ?? "").trim(),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const listingId = String(formData.get("listing_id") ?? "");
  const username = String(formData.get("username") ?? "");
  const target = UUID.test(listingId) ? { listing: listingId }
    : USERNAME.test(username) ? { username }
    : parseTarget(String(formData.get("target") ?? ""));
  if (!target) return { error: t("err.target") };

  const { supabase, user } = await getSession();
  if (!supabase) return { error: t("err.unavailable") };

  let row: { listing_id: string | null; profile_id: string | null };
  let back: ReportState["back"];
  if ("listing" in target) {
    const { data } = await supabase.from("listings").select("id").eq("id", target.listing).maybeSingle();
    if (!data) return { error: t("err.targetNotFound") };
    row = { listing_id: data.id as string, profile_id: null };
    back = { kind: "listing", href: `/artikel/${data.id}` };
  } else {
    const { data } = await supabase.from("profiles").select("id, username").eq("username", target.username).maybeSingle();
    if (!data) return { error: t("err.targetNotFound") };
    row = { listing_id: null, profile_id: data.id as string };
    back = { kind: "profile", href: `/verkaeufer/${encodeURIComponent(data.username as string)}` };
  }

  // No .select(): signed-out reporters may insert but not read reports.
  const { error } = await supabase.from("reports").insert({
    ...row,
    reporter_id: user?.id ?? null,
    reason: parsed.data.reason,
    details: parsed.data.details,
    contact_email: parsed.data.contact_email || null,
  });
  if (error) return { error: t("err.save") };
  return { ok: true, back };
}
