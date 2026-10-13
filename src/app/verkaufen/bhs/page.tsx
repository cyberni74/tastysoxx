import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { SellPage, pickContent, type SellContent } from "../_SellPage";

const CONTENT: Record<"de", SellContent> = {
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
};

export async function generateMetadata(): Promise<Metadata> {
  const c = pickContent(CONTENT, await getLocale());
  return pageMeta({ title: c.title, description: c.description, path: "/verkaufen/bhs" });
}

export default function SellBrasPage() {
  return <SellPage dept="bhs" content={CONTENT} />;
}
