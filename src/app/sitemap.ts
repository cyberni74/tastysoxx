import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { DEPARTMENTS } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from "@/lib/supabase/env";

export const revalidate = 3600;

const STATIC = [
  "/", "/marktplatz", "/verkaufen", "/hilfe", "/hilfe/kaufen-und-verkaufen",
  "/hilfe/versand-zahlung-privatsphaere", "/hilfe/angebotsregeln", "/verkaeufer",
  "/kontakt", "/impressum", "/agb", "/datenschutz",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    ...STATIC.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now })),
    ...DEPARTMENTS.flatMap((d) => [
      { url: `${SITE_URL}${d.path}`, lastModified: now, priority: 0.9 },
      { url: `${SITE_URL}${d.sellPath}`, lastModified: now, priority: 0.7 },
    ]),
  ];
  if (!supabaseConfigured) return entries;
  // cookie-less client: sitemap is public data only
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  const [{ data: listings }, { data: sellers }] = await Promise.all([
    sb.from("listings").select("id, created_at").eq("status", "active").order("created_at", { ascending: false }).limit(5000),
    sb.from("profiles").select("username, last_active").eq("role", "seller").limit(5000),
  ]);
  listings?.forEach((l) => entries.push({ url: `${SITE_URL}/artikel/${l.id}`, lastModified: new Date(l.created_at) }));
  sellers?.forEach((s) => entries.push({ url: `${SITE_URL}/verkaeufer/${s.username}`, lastModified: new Date(s.last_active) }));
  return entries;
}
