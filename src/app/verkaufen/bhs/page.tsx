import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { SellPage, pickContent, type SellContent } from "../_SellPage";

const CONTENT: Record<"de" | "en", SellContent> = {
  de: {
    title: "Getragene BHs verkaufen – so funktioniert's",
    description: "Getragene BHs und Büstenhalter verkaufen: Größenangabe wie 75B, Material, Fototipps, Preisorientierung, Verpackung und Regeln auf TastySoxx.",
    intro: "BHs, Sport-BHs und Bralettes werden oft nach Größe gesucht. Mit klaren Angaben und sauberen Produktfotos verkaufst du deinen Büstenhalter schneller.",
    listing: [
      "Größe ist Pflicht: Unterbrustweite und Cup, z. B. 75B – bei Bralettes und Sport-BHs auch S/M/L.",
      "Art: klassischer BH (mit/ohne Bügel, gepolstert), Sport-BH oder Bralette/Bustier.",
      "Material, z. B. Baumwolle, Spitze, Mikrofaser oder Seide/Satin.",
      "Tragedauer in Tagen und Anlass (Alltag, Sport, Nacht).",
      "Zustand ehrlich angeben: leichte, normale oder intensive Tragespuren, ausgeleierte Träger erwähnen.",
      "Farbe, Marke und Verschluss (vorne/hinten) in der Beschreibung.",
    ],
    photos: [
      "Den BH flach hinlegen oder an einen Bügel hängen – Vorder- und Rückseite zeigen.",
      "Keine Fotos am Körper: das Produkt steht im Mittelpunkt.",
      "Ein Foto vom Etikett mit der Größe (z. B. 75B) erspart Rückfragen.",
      "Tageslicht statt Blitz, damit Spitze und Farbe echt wirken.",
      "Hintergrund prüfen: keine Spiegel, Fenster, Briefe oder erkennbaren Räume.",
    ],
    pricing: [
      { label: "Baumwoll-BH / Bralette", range: "20–35 €" },
      { label: "Sport-BH nach dem Training", range: "25–40 €" },
      { label: "Spitzen-BH", range: "25–50 €" },
      { label: "Längere Tragedauer (3+ Tage)", range: "+5–20 €" },
    ],
    packaging: [
      "BH vorsichtig falten (Cups ineinander), vakuumiert oder im Zip-Beutel verpacken.",
      "Gepolsterte BHs lieber im kleinen Karton versenden, damit die Form erhalten bleibt.",
      "Neutraler Umschlag oder Karton ohne Hinweis auf den Inhalt; Alias statt Klarname als Absender möglich.",
      "Versand erst nach Zahlungseingang. Danach im Dashboard „Als versendet markieren“.",
    ],
    notAllowed: [
      "Fotos am Körper, Gesichter oder explizite Aufnahmen.",
      "Alles, was mit Personen unter 18 Jahren zu tun hat oder darauf anspielt (z. B. „erster BH“).",
      "Gesundheitsgefährdende Zusätze oder sichtbare Körperflüssigkeiten auf Fotos.",
      "Falsche Angaben zu Größe, Material, Tragedauer oder Zustand.",
      "Treffen, Abholung oder Bezahlung außerhalb einer Bestellung.",
    ],
    faq: [
      { q: "Wie gebe ich die BH-Größe richtig an?", a: "Unterbrustweite plus Cup, so wie auf dem Etikett, z. B. 75B oder 80C. Bei Bralettes und Sport-BHs ohne Cup-Größe reicht S, M oder L." },
      { q: "Kann ich auch einen Büstenhalter ohne Etikett verkaufen?", a: "Ja, wenn du die Größe kennst. Schreib in die Beschreibung, dass das Etikett fehlt, und gib die Größe so genau wie möglich an." },
      { q: "Wie versende ich einen gepolsterten BH?", a: "Am besten im kleinen Karton statt im Umschlag, damit die Cups nicht eingedrückt werden. Außen neutral, ohne Hinweis auf den Inhalt." },
      { q: "Wie bekomme ich mein Geld?", a: "Die Bezahlung läuft direkt zwischen dir und der Käuferin bzw. dem Käufer. Du schickst deine Zahlungsdetails im Chat und versendest erst nach Zahlungseingang." },
    ],
  },
  en: {
    title: "Selling worn bras – how it works",
    description: "Selling worn bras: size like 34B / EU 75B, material, photo tips, pricing guide, packaging and rules on TastySoxx.",
    intro: "Bras, sports bras and bralettes are often searched by size. Clear details and clean product photos help your bra sell faster.",
    listing: [
      "Size is required: band and cup, e.g. EU 75B – for bralettes and sports bras S/M/L is fine.",
      "Type: classic bra (underwired or not, padded), sports bra or bralette/bustier.",
      "Material, e.g. cotton, lace, microfibre or silk/satin.",
      "Days worn and occasion (everyday, sport, night).",
      "Be honest about condition: light, normal or heavy signs of wear; mention stretched straps.",
      "Colour, brand and fastening (front/back) in the description.",
    ],
    photos: [
      "Lay the bra flat or hang it on a hanger – show front and back.",
      "No photos on the body: the product is the focus.",
      "A photo of the size label (e.g. 75B) saves questions.",
      "Daylight instead of flash so lace and colour look real.",
      "Check the background: no mirrors, windows, letters or recognizable rooms.",
    ],
    pricing: [
      { label: "Cotton bra / bralette", range: "€20–35" },
      { label: "Sports bra after a workout", range: "€25–40" },
      { label: "Lace bra", range: "€25–50" },
      { label: "Longer wear (3+ days)", range: "+€5–20" },
    ],
    packaging: [
      "Fold the bra carefully (cups nested), pack it vacuum-sealed or in a zip bag.",
      "Ship padded bras in a small box so they keep their shape.",
      "Plain envelope or box with no hint of what's inside; an alias instead of your real name as sender is possible.",
      "Only ship once payment has arrived. Then click “Mark as shipped” in your dashboard.",
    ],
    notAllowed: [
      "Photos on the body, faces or explicit shots.",
      "Anything involving or alluding to people under 18 (e.g. “first bra”).",
      "Anything hazardous to health or visible bodily fluids in photos.",
      "False details about size, material, days worn or condition.",
      "Meetings, pick-up or payment outside an order.",
    ],
    faq: [
      { q: "How do I state the bra size correctly?", a: "Band plus cup, as on the label, e.g. EU 75B or 80C. For bralettes and sports bras without a cup size, S, M or L is enough." },
      { q: "Can I sell a bra without a label?", a: "Yes, if you know the size. Mention in the description that the label is missing and give the size as accurately as you can." },
      { q: "How do I ship a padded bra?", a: "Ideally in a small box rather than an envelope, so the cups don't get crushed. Plain on the outside, with no hint of what's inside." },
      { q: "How do I get paid?", a: "Payment goes directly between you and the buyer. You send your payment details in the chat and only ship once the money has arrived." },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const c = pickContent(CONTENT, await getLocale());
  return pageMeta({ title: c.title, description: c.description, path: "/verkaufen/bhs" });
}

export default function SellBrasPage() {
  return <SellPage dept="bhs" content={CONTENT} />;
}
