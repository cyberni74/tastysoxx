import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { SellPage, pickContent, type SellContent } from "../_SellPage";

const CONTENT: Record<"de" | "en", SellContent> = {
  de: {
    title: "Getragene Slips verkaufen – so funktioniert's",
    description: "Getragene Slips verkaufen: Pflichtangaben wie Größe und Material, Fototipps ohne Körper, Preisorientierung, Verpackung und Regeln auf TastySoxx.",
    intro: "Slips, Strings und Hipster sind gefragt – und brauchen ein bisschen mehr Sorgfalt bei Angaben, Fotos und Verpackung als Socken.",
    listing: [
      "Größe ist Pflicht: Konfektionsgröße wie S, M, L oder 36/38 – z. B. „M / 38“.",
      "Schnitt: Slip, String/Tanga oder Hipster/Panty.",
      "Material, z. B. Baumwolle, Spitze, Seide/Satin oder Mikrofaser.",
      "Tragedauer in Tagen und Anlass (Alltag, Sport, Nacht).",
      "Zustand ehrlich angeben: leichte, normale oder intensive Tragespuren.",
      "Farbe und Details wie Spitzenbesatz oder Marke in der Beschreibung.",
    ],
    photos: [
      "Den Slip flach auf einen ruhigen, einfarbigen Untergrund legen oder an einen Bügel hängen.",
      "Keine Fotos am Körper: das Produkt steht im Mittelpunkt, nicht du.",
      "Tageslicht statt Blitz, damit Farbe und Stoff echt wirken.",
      "Ein Foto vom Etikett (Größe/Material) und ein Detailfoto vom Stoff schaffen Vertrauen.",
      "Hintergrund prüfen: keine Spiegel, Fenster, Briefe oder erkennbaren Räume.",
    ],
    pricing: [
      { label: "Baumwollslip, 1 Tag getragen", range: "15–25 €" },
      { label: "String / Tanga", range: "18–30 €" },
      { label: "Spitze oder Seide/Satin", range: "20–40 €" },
      { label: "Nach dem Sport", range: "20–35 €" },
      { label: "Längere Tragedauer (2+ Tage)", range: "+5–20 €" },
    ],
    packaging: [
      "Vakuumiert oder im fest verschlossenen Zip-Beutel versenden – hygienisch und geruchsdicht.",
      "Neutraler Umschlag oder Karton ohne Hinweis auf den Inhalt.",
      "Alias statt Klarname als Absender auf dem Paket ist möglich.",
      "Versand erst nach Zahlungseingang. Danach im Dashboard „Als versendet markieren“.",
    ],
    notAllowed: [
      "Fotos am Körper, Gesichter oder explizite Aufnahmen.",
      "Alles, was mit Personen unter 18 Jahren zu tun hat oder darauf anspielt.",
      "Sichtbare Körperflüssigkeiten auf Fotos, Blut oder gesundheitsgefährdende Zusätze.",
      "Falsche Angaben zu Größe, Material, Tragedauer oder Zustand.",
      "Treffen, Abholung oder Bezahlung außerhalb einer Bestellung.",
    ],
    faq: [
      { q: "Warum ist die Größe bei Slips Pflicht?", a: "Käufer:innen wählen oft nach Größe und Schnitt. Eine klare Angabe wie „M / 38“ vermeidet Rückfragen und Enttäuschungen." },
      { q: "Muss ich ein Foto am Körper zeigen?", a: "Nein – und das ist auch nicht erlaubt. Gute Produktfotos auf neutralem Untergrund reichen völlig aus." },
      { q: "Wie verpacke ich einen Slip richtig?", a: "Am besten vakuumiert oder im fest verschlossenen Zip-Beutel, dann in einen neutralen Umschlag ohne Hinweis auf den Inhalt." },
      { q: "Was passiert, wenn die Käuferin nicht zahlt?", a: "Die Bestellung bleibt reserviert, bis du die Zahlung bestätigst. Kommt kein Geld, kannst du sie im Dashboard stornieren – der Artikel ist dann wieder verfügbar." },
    ],
  },
  en: {
    title: "Selling worn panties – how it works",
    description: "Selling worn panties: required details like size and material, photo tips without your body, pricing guide, packaging and rules on TastySoxx.",
    intro: "Panties, thongs and hipsters are in demand – and need a bit more care with details, photos and packaging than socks.",
    listing: [
      "Size is required: clothing size like S, M, L or EU 36/38 – e.g. “M / 38”.",
      "Cut: panties, thong/G-string or hipster/boyshort.",
      "Material, e.g. cotton, lace, silk/satin or microfibre.",
      "Days worn and occasion (everyday, sport, night).",
      "Be honest about condition: light, normal or heavy signs of wear.",
      "Colour and details like lace trim or brand in the description.",
    ],
    photos: [
      "Lay the panties flat on a calm, plain background or hang them on a hanger.",
      "No photos on the body: the product is the focus, not you.",
      "Daylight instead of flash so colour and fabric look real.",
      "A photo of the label (size/material) and a close-up of the fabric build trust.",
      "Check the background: no mirrors, windows, letters or recognizable rooms.",
    ],
    pricing: [
      { label: "Cotton panties, worn 1 day", range: "€15–25" },
      { label: "Thong / G-string", range: "€18–30" },
      { label: "Lace or silk/satin", range: "€20–40" },
      { label: "After a workout", range: "€20–35" },
      { label: "Longer wear (2+ days)", range: "+€5–20" },
    ],
    packaging: [
      "Ship vacuum-sealed or in a tightly closed zip bag – hygienic and odour-proof.",
      "Plain envelope or box with no hint of what's inside.",
      "An alias instead of your real name as sender on the parcel is possible.",
      "Only ship once payment has arrived. Then click “Mark as shipped” in your dashboard.",
    ],
    notAllowed: [
      "Photos on the body, faces or explicit shots.",
      "Anything involving or alluding to people under 18.",
      "Visible bodily fluids in photos, blood or anything hazardous to health.",
      "False details about size, material, days worn or condition.",
      "Meetings, pick-up or payment outside an order.",
    ],
    faq: [
      { q: "Why is size required for panties?", a: "Buyers often choose by size and cut. A clear size like “M / 38” avoids questions and disappointment." },
      { q: "Do I have to show a photo on my body?", a: "No – and it isn't allowed. Good product photos on a plain background are all you need." },
      { q: "How should I pack panties?", a: "Ideally vacuum-sealed or in a tightly closed zip bag, then in a plain envelope with no hint of what's inside." },
      { q: "What if the buyer doesn't pay?", a: "The order stays reserved until you confirm payment. If no money arrives, you can cancel it in your dashboard – the item becomes available again." },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const c = pickContent(CONTENT, await getLocale());
  return pageMeta({ title: c.title, description: c.description, path: "/verkaufen/slips" });
}

export default function SellPantiesPage() {
  return <SellPage dept="slips" content={CONTENT} />;
}
