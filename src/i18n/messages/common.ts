import { defineMessages } from "../define";

/** Shared labels: navigation, enums, components used across pages. */
export const common = defineMessages({
  de: {
    "nav.shop": "Shop", "nav.sellers": "Verkäufer", "nav.faq": "Über/FAQ", "nav.contact": "Kontakt",
    "nav.menu": "Menü", "nav.account": "Mein Konto", "nav.login": "Anmelden", "nav.cart": "Warenkorb",
    "nav.dashboard": "Verkäufer-Dashboard", "nav.messages": "Nachrichten", "nav.search": "Socken oder Verkäuferin suchen",
    "nav.searchLabel": "Suche", "nav.home": "TastySoxx Startseite", "nav.language": "Sprache",

    "footer.tagline": "Der diskrete Marktplatz für getragene Socken. Nur für Erwachsene ab 18 Jahren.",
    "footer.shop": "Shop", "footer.info": "Info", "footer.legal": "Rechtliches", "footer.faq": "FAQ",
    "footer.sell": "Verkaufen", "footer.contact": "Kontakt", "footer.imprint": "Impressum", "footer.terms": "AGB",
    "footer.privacy": "Datenschutz", "footer.badges": "18+ · Diskreter Versand · Verifizierte Profile",

    "age.title": "Bist du mindestens 18 Jahre alt?",
    "age.text": "TastySoxx richtet sich ausschließlich an Erwachsene. Mit „Ja“ bestätigst du, volljährig zu sein.",
    "age.yes": "Ja, ich bin 18+", "age.no": "Nein, verlassen",
    "cookie.title": "Cookies",
    "cookie.text": "Wir verwenden nur technisch notwendige Cookies für Login, Sprache und Warenkorb. Keine Tracking-Cookies.",
    "cookie.ok": "Verstanden",

    "cat.sneaker": "Sneakersocken", "cat.sport": "Sportsocken", "cat.knie": "Kniestrümpfe", "cat.nylon": "Nylonsöckchen",
    "catShort.sneaker": "Sneaker", "catShort.sport": "Sport", "catShort.knie": "Kniestrümpfe", "catShort.nylon": "Nylon",
    "mat.Baumwolle": "Baumwolle", "mat.Wolle": "Wolle", "mat.Nylon": "Nylon", "mat.Synthetik": "Synthetik",
    "build.schlank": "schlank", "build.sportlich": "sportlich", "build.normal": "normal", "build.kurvig": "kurvig",
    "wear.1": "1 Tag", "wear.2-3": "2–3 Tage", "wear.4": "4+ Tage",
    "sort.neu": "Neueste", "sort.preis-auf": "Preis aufsteigend", "sort.preis-ab": "Preis absteigend",
    "status.pending_payment": "Wartet auf Zahlung", "status.paid": "Bezahlt", "status.shipped": "Versendet",
    "status.completed": "Abgeschlossen", "status.cancelled": "Storniert",
    "listing.sold": "Verkauft", "listing.reserved": "Reserviert", "listing.hidden": "Ausgeblendet", "listing.active": "Aktiv",

    "time.online": "gerade aktiv", "time.min": "vor {n} Min.", "time.hours": "vor {n} Std.",
    "time.yesterday": "gestern", "time.days": "vor {n} Tagen",
    "wearDays.one": "1 Tag", "wearDays.many": "{n} Tage", "worn": "getragen {d}",
    "verified": "Verifiziert", "starsLabel": "{r} von 5 Sternen", "age": "{a} J.", "shoeSize": "Schuhgr. {s}",
    "setup": "Die Datenbank ist noch nicht verbunden. Sobald sie eingerichtet ist, erscheinen hier echte Angebote.",

    "err.notAvailable": "Mindestens ein Artikel ist nicht mehr verfügbar.",
    "err.emptyCart": "Dein Warenkorb ist leer.", "err.notLoggedIn": "Bitte melde dich an.",
    "err.statusNotAllowed": "Dieser Statuswechsel ist nicht erlaubt.", "err.orderNotFound": "Bestellung nicht gefunden.",
    "err.ageMissing": "Bitte bestätige, dass du mindestens 18 Jahre alt bist.", "err.generic": "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
  },
  en: {
    "nav.shop": "Shop", "nav.sellers": "Sellers", "nav.faq": "About/FAQ", "nav.contact": "Contact",
    "nav.menu": "Menu", "nav.account": "My account", "nav.login": "Sign in", "nav.cart": "Cart",
    "nav.dashboard": "Seller dashboard", "nav.messages": "Messages", "nav.search": "Search socks or sellers",
    "nav.searchLabel": "Search", "nav.home": "TastySoxx home", "nav.language": "Language",

    "footer.tagline": "The discreet marketplace for worn socks. Adults 18+ only.",
    "footer.shop": "Shop", "footer.info": "Info", "footer.legal": "Legal", "footer.faq": "FAQ",
    "footer.sell": "Sell", "footer.contact": "Contact", "footer.imprint": "Imprint", "footer.terms": "Terms",
    "footer.privacy": "Privacy", "footer.badges": "18+ · Discreet shipping · Verified profiles",

    "age.title": "Are you at least 18 years old?",
    "age.text": "TastySoxx is for adults only. By clicking “Yes” you confirm that you are of legal age.",
    "age.yes": "Yes, I'm 18+", "age.no": "No, leave",
    "cookie.title": "Cookies",
    "cookie.text": "We only use strictly necessary cookies for sign-in, language and cart. No tracking cookies.",
    "cookie.ok": "Got it",

    "cat.sneaker": "Ankle socks", "cat.sport": "Sports socks", "cat.knie": "Knee socks", "cat.nylon": "Nylon socks",
    "catShort.sneaker": "Ankle", "catShort.sport": "Sport", "catShort.knie": "Knee-high", "catShort.nylon": "Nylon",
    "mat.Baumwolle": "Cotton", "mat.Wolle": "Wool", "mat.Nylon": "Nylon", "mat.Synthetik": "Synthetic",
    "build.schlank": "slim", "build.sportlich": "athletic", "build.normal": "average", "build.kurvig": "curvy",
    "wear.1": "1 day", "wear.2-3": "2–3 days", "wear.4": "4+ days",
    "sort.neu": "Newest", "sort.preis-auf": "Price: low to high", "sort.preis-ab": "Price: high to low",
    "status.pending_payment": "Awaiting payment", "status.paid": "Paid", "status.shipped": "Shipped",
    "status.completed": "Completed", "status.cancelled": "Cancelled",
    "listing.sold": "Sold", "listing.reserved": "Reserved", "listing.hidden": "Hidden", "listing.active": "Active",

    "time.online": "online now", "time.min": "{n} min ago", "time.hours": "{n} h ago",
    "time.yesterday": "yesterday", "time.days": "{n} days ago",
    "wearDays.one": "1 day", "wearDays.many": "{n} days", "worn": "worn {d}",
    "verified": "Verified", "starsLabel": "{r} out of 5 stars", "age": "{a} yrs", "shoeSize": "Shoe size {s}",
    "setup": "The database isn't connected yet. Real listings will appear here once it is set up.",

    "err.notAvailable": "At least one item is no longer available.",
    "err.emptyCart": "Your cart is empty.", "err.notLoggedIn": "Please sign in.",
    "err.statusNotAllowed": "This status change isn't allowed.", "err.orderNotFound": "Order not found.",
    "err.ageMissing": "Please confirm that you are at least 18 years old.", "err.generic": "Something went wrong. Please try again.",
  },
});

/** Maps German RPC/trigger exceptions from the DB to common message keys. */
export function dbErrorKey(message: string | undefined | null) {
  const m = message ?? "";
  if (m.includes("nicht mehr verfügbar")) return "err.notAvailable" as const;
  if (m.includes("Warenkorb ist leer")) return "err.emptyCart" as const;
  if (m.includes("Nicht angemeldet")) return "err.notLoggedIn" as const;
  if (m.includes("Statuswechsel")) return "err.statusNotAllowed" as const;
  if (m.includes("Bestellung nicht gefunden")) return "err.orderNotFound" as const;
  if (m.includes("Altersbestätigung")) return "err.ageMissing" as const;
  return "err.generic" as const;
}
