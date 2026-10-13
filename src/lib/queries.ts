import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ListingWithSeller, SellerStats } from "./types";
import { WEAR_FILTERS } from "./constants";

export const LISTING_SELECT =
  "*, seller:profiles!listings_seller_id_fkey(id, username, verified, country, avatar_url, last_active)";

export interface ShopFilters {
  kat?: string;
  q?: string;
  verifiziert?: string; // "1"
  dauer?: string; // WEAR_FILTERS id
  sort?: string; // SORTS id
}

export async function fetchListings(sb: SupabaseClient, f: ShopFilters, limit = 60): Promise<ListingWithSeller[]> {
  const sellerJoin = f.verifiziert === "1"
    ? LISTING_SELECT.replace("seller:profiles!listings_seller_id_fkey(", "seller:profiles!listings_seller_id_fkey!inner(")
    : LISTING_SELECT;
  let query = sb.from("listings").select(sellerJoin).eq("status", "active");
  if (f.kat) query = query.eq("category", f.kat);
  if (f.verifiziert === "1") query = query.eq("seller.verified", true);
  const wear = WEAR_FILTERS.find((w) => w.id === f.dauer);
  if (wear) query = query.gte("wear_days", wear.min).lte("wear_days", wear.max);
  const q = f.q?.trim().replace(/[%,()]/g, " ");
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  if (f.sort === "preis-auf") query = query.order("price_cents", { ascending: true });
  else if (f.sort === "preis-ab") query = query.order("price_cents", { ascending: false });
  else query = query.order("created_at", { ascending: false });
  const { data, error } = await query.limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ListingWithSeller[];
}

export async function fetchStats(sb: SupabaseClient, ids: string[]): Promise<Map<string, SellerStats>> {
  const map = new Map<string, SellerStats>();
  if (!ids.length) return map;
  const { data } = await sb.from("seller_stats").select("*").in("seller_id", ids);
  (data as SellerStats[] | null)?.forEach((s) => map.set(s.seller_id, s));
  return map;
}
