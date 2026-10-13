import type { Category, Material, OrderStatus } from "./types";

export const SITE_NAME = "TastySoxx";
export const SHIPPING_CENTS = 490; // must match create_orders() in the DB

export const CATEGORIES: { id: Category; name: string; short: string; hue: number }[] = [
  { id: "sneaker", name: "Sneakersocken", short: "Sneaker", hue: 165 },
  { id: "sport", name: "Sportsocken", short: "Sport", hue: 30 },
  { id: "knie", name: "Kniestrümpfe", short: "Kniestrümpfe", hue: 265 },
  { id: "nylon", name: "Nylonsöckchen", short: "Nylon", hue: 205 },
];

export const MATERIALS: Material[] = ["Baumwolle", "Wolle", "Nylon", "Synthetik"];
export const AGE_RANGES = ["18–24", "25–29", "30–34", "35–39", "40+"] as const;
export const BUILDS = ["schlank", "sportlich", "normal", "kurvig"] as const;

export const WEAR_FILTERS = [
  { id: "1", label: "1 Tag", min: 1, max: 1 },
  { id: "2-3", label: "2–3 Tage", min: 2, max: 3 },
  { id: "4", label: "4+ Tage", min: 4, max: 30 },
] as const;

export const SORTS = [
  { id: "neu", label: "Neueste" },
  { id: "preis-auf", label: "Preis aufsteigend" },
  { id: "preis-ab", label: "Preis absteigend" },
] as const;

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Wartet auf Zahlung",
  paid: "Bezahlt",
  shipped: "Versendet",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

export const COUNTRIES: Record<string, string> = {
  DE: "🇩🇪", AT: "🇦🇹", CH: "🇨🇭", NL: "🇳🇱", FR: "🇫🇷", ES: "🇪🇸", IT: "🇮🇹", PL: "🇵🇱", GB: "🇬🇧", US: "🇺🇸",
};

export const categoryById = (id: string | null | undefined) => CATEGORIES.find((c) => c.id === id);
