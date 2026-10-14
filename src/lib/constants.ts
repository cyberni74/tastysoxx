import type { Category, Color, Condition, Department, Material, OrderStatus, ReportReason } from "./types";

export const SITE_NAME = "TastySoxx";
export const SHIPPING_CENTS = 490; // must match create_orders() in the DB

/** Indexable department landing pages. Slugs are part of the public URL structure. */
export const DEPARTMENTS: { id: Department; path: string; sellPath: string; hue: number; image: { src: string; width: number; height: number } }[] = [
  { id: "socken", path: "/getragene-socken", sellPath: "/verkaufen/socken", hue: 165, image: { src: "/images/kategorien/getragene-socken-kaufen-nylonsocken-olivgruen.webp", width: 960, height: 581 } },
  { id: "slips", path: "/getragene-slips", sellPath: "/verkaufen/slips", hue: 330, image: { src: "/images/kategorien/getragene-slips-kaufen-schwarzer-spitzen-slip.webp", width: 960, height: 444 } },
  { id: "bhs", path: "/getragene-bhs", sellPath: "/verkaufen/bhs", hue: 270, image: { src: "/images/kategorien/getragene-bhs-kaufen-schwarzer-bh.webp", width: 960, height: 437 } },
];

export const CATEGORIES: { id: Category; dept: Department; hue: number }[] = [
  { id: "sneaker", dept: "socken", hue: 165 },
  { id: "sport", dept: "socken", hue: 30 },
  { id: "knie", dept: "socken", hue: 265 },
  { id: "nylon", dept: "socken", hue: 205 },
  { id: "strumpfhose", dept: "socken", hue: 185 },
  { id: "slip", dept: "slips", hue: 330 },
  { id: "string", dept: "slips", hue: 345 },
  { id: "hipster", dept: "slips", hue: 310 },
  { id: "bh", dept: "bhs", hue: 270 },
  { id: "sport-bh", dept: "bhs", hue: 250 },
  { id: "bralette", dept: "bhs", hue: 290 },
];

export const MATERIALS: Material[] = ["Baumwolle", "Wolle", "Nylon", "Synthetik", "Spitze", "Seide", "Mikrofaser"];
export const COLORS: Exclude<Color, "">[] = ["schwarz", "weiss", "grau", "beige", "rosa", "rot", "blau", "gruen", "lila", "bunt"];
export const CONDITIONS: Condition[] = ["leicht", "normal", "intensiv"];
export const REPORT_REASONS: ReportReason[] = ["minderjaehrig", "illegal", "betrug", "belaestigung", "falsche_angaben", "sonstiges"];
/** Size hints shown in the listing form per department. */
export const SIZE_HINTS: Record<Department, string> = { socken: "38–40", slips: "M / 38", bhs: "75B" };

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
export const departmentById = (id: string | null | undefined) => DEPARTMENTS.find((d) => d.id === id);
export const categoriesOf = (dept: Department) => CATEGORIES.filter((c) => c.dept === dept);
