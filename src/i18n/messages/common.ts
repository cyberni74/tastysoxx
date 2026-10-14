import { defineMessages } from "../define";

/** Shared labels: navigation, enums, components used across pages. */
export const common = defineMessages({
  de: {
    "nav.marketplace": "Marktplatz", "nav.sell": "Verkaufen", "nav.help": "Hilfe",
    "dept.socken": "Getragene Socken & Strümpfe", "dept.slips": "Getragene Slips & Unterwäsche", "dept.bhs": "Getragene BHs & Büstenhalter",
    "deptImg.socken": "Getragene Nylonsocken in Olivgrün", "deptImg.slips": "Schwarzer Spitzen-Slip, getragen", "deptImg.bhs": "Schwarzer BH, getragen",
    "deptShort.socken": "Socken", "deptShort.slips": "Slips", "deptShort.bhs": "BHs",
    "cat.strumpfhose": "Strumpfhosen & Strümpfe", "catShort.strumpfhose": "Strumpfhosen",
    "cat.slip": "Slips", "catShort.slip": "Slip", "cat.string": "Strings & Tangas", "catShort.string": "String",
    "cat.hipster": "Hipster & Pantys", "catShort.hipster": "Hipster",
    "cat.bh": "BHs", "catShort.bh": "BH", "cat.sport-bh": "Sport-BHs", "catShort.sport-bh": "Sport-BH",
    "cat.bralette": "Bralettes & Bustiers", "catShort.bralette": "Bralette",
    "mat.Spitze": "Spitze", "mat.Seide": "Seide/Satin", "mat.Mikrofaser": "Mikrofaser",
    "color.schwarz": "Schwarz", "color.weiss": "Weiß", "color.grau": "Grau", "color.beige": "Beige", "color.rosa": "Rosa",
    "color.rot": "Rot", "color.blau": "Blau", "color.gruen": "Grün", "color.lila": "Lila", "color.bunt": "Bunt/gemustert",
    "cond.leicht": "Leichte Tragespuren", "cond.normal": "Normale Tragespuren", "cond.intensiv": "Intensive Tragespuren",
    "reason.minderjaehrig": "Verdacht auf Minderjährige", "reason.illegal": "Illegale oder verbotene Inhalte",
    "reason.betrug": "Betrug oder Fake-Profil", "reason.belaestigung": "Belästigung",
    "reason.falsche_angaben": "Falsche Angaben im Angebot", "reason.sonstiges": "Sonstiges",
    "report": "Melden", "size": "Größe", "color": "Farbe", "condition": "Zustand", "material": "Material",
    "nav.shop": "Shop", "nav.sellers": "Verkäufer", "nav.faq": "Über/FAQ", "nav.contact": "Kontakt",
    "nav.menu": "Menü", "nav.account": "Mein Konto", "nav.login": "Anmelden", "nav.cart": "Warenkorb",
    "nav.dashboard": "Verkäufer-Dashboard", "nav.messages": "Nachrichten", "nav.search": "Socken, Slips, BHs oder Verkäuferin suchen",
    "nav.searchLabel": "Suche", "nav.home": "TastySoxx Startseite", "nav.language": "Sprache",

    "footer.tagline": "Marktplatz für getragene Socken, Slips und BHs. Nur für Erwachsene ab 18 Jahren.",
    "footer.shop": "Shop", "footer.info": "Info", "footer.legal": "Rechtliches", "footer.faq": "FAQ",
    "footer.sell": "Verkaufen", "footer.contact": "Kontakt", "footer.imprint": "Impressum", "footer.terms": "AGB",
    "footer.privacy": "Datenschutz", "footer.badges": "18+ · Neutrale Verpackung · Verifizierte Profile",

    "age.title": "Bist du mindestens 18 Jahre alt?",
    "age.text": "TastySoxx richtet sich ausschließlich an Erwachsene. Mit „Ja“ bestätigst du, volljährig zu sein.",
    "age.yes": "Ja, ich bin 18+", "age.no": "Nein, verlassen",
    "cookie.title": "Cookies",
    "cookie.text": "Wir verwenden nur technisch notwendige Cookies: für den Login und um dir diese Hinweise nicht jedes Mal zu zeigen. Keine Tracking-Cookies.",
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
