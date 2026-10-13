import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { SellPage, pickContent, type SellContent } from "../_SellPage";

const CONTENT: Record<"de", SellContent> = {
  de: {
    title: "Getragene Socken verkaufen – so funktioniert's",
    description: "Getragene Socken verkaufen: welche Angaben ins Angebot gehören, Fototipps, Preisorientierung, Verpackung und Regeln auf TastySoxx.",
    intro: "Socken sind der einfachste Einstieg: schnell fotografiert, leicht verpackt, günstig versendet. Hier steht, worauf es bei einem guten Angebot ankommt.",
    listing: [
      "Größe als Schuhgrößen-Spanne, z. B. 38–40 – so steht sie meist auch auf dem Etikett.",
      "Art der Socke: Sneaker-, Sport-, Kniestrümpfe, Nylons oder Strumpfhose.",
      "Material, z. B. Baumwolle, Wolle, Nylon oder Synthetik.",
      "Tragedauer in Tagen und wobei sie getragen wurden (Alltag, Sport, Arbeit).",
      "Zustand ehrlich angeben: leichte, normale oder intensive Tragespuren.",
      "Farbe und Besonderheiten (Muster, Logo, kleine Löcher) in der Beschreibung.",
    ],
    photos: [
      "Socken flach auf einen ruhigen, einfarbigen Untergrund legen (Bettlaken, Handtuch, Holzboden).",
      "Tageslicht von der Seite statt Blitz – Farbe und Material wirken so echt.",
      "Ein Foto der Sohle und eines vom Etikett mit der Größe schaffen Vertrauen.",
      "Erlaubt sind Fotos am Fuß bis zum Knöchel bzw. Knie, solange kein Gesicht und nichts Explizites zu sehen ist.",
      "Keine erkennbaren Möbel, Fenster, Briefe oder Spiegel im Bild – sie verraten mehr, als du denkst.",
    ],
    pricing: [
      { label: "Sneakersocken, 1 Tag getragen", range: "8–15 €" },
      { label: "Sportsocken nach dem Training", range: "12–25 €" },
      { label: "Kniestrümpfe / Nylons", range: "12–25 €" },
      { label: "Strumpfhosen", range: "15–30 €" },
      { label: "Längere Tragedauer (3+ Tage)", range: "+5–15 €" },
    ],
    packaging: [
      "Socken in einen Zip- oder Vakuumbeutel geben – das hält Geruch und Zustand bis zur Ankunft.",
      "Neutraler Umschlag oder Karton ohne Hinweis auf den Inhalt.",
      "Als Absender genügt ein Alias statt Klarname auf dem Paket.",
      "Versand erst, wenn die Zahlung angekommen ist. Danach im Dashboard „Als versendet markieren“.",
    ],
    notAllowed: [
      "Fotos mit Gesicht oder explizite Körperaufnahmen.",
      "Angebote von oder mit Personen unter 18 Jahren – auch nicht angedeutet (z. B. Schuluniform-Motive).",
      "Körperflüssigkeiten außer normalem Tragen sowie gesundheitsgefährdende Zusätze.",
      "Falsche Angaben zu Größe, Material, Tragedauer oder Zustand.",
      "Treffen, Abholung oder Bezahlung außerhalb einer Bestellung.",
    ],
    faq: [
      { q: "Wie lange sollte ich Socken vor dem Verkauf tragen?", a: "Das entscheidest du. Die meisten Angebote liegen bei 1 bis 3 Tagen. Gib die Tragedauer ehrlich an – sie ist für Käufer:innen eines der wichtigsten Kriterien." },
      { q: "Kann ich Extras anbieten, z. B. Sport-Session oder längere Tragedauer?", a: "Ja, beschreibe Extras im Angebot oder sprich sie im Chat ab. Sie müssen legal sein und dürfen keine expliziten Inhalte beinhalten." },
      { q: "Was kostet der Versand?", a: "Die Käuferin bzw. der Käufer zahlt pauschal 4,90 € pro Verkäuferin. Socken passen in einen Großbrief oder ein Päckchen." },
      { q: "Wie bekomme ich mein Geld?", a: "Die Bezahlung läuft direkt zwischen dir und der Käuferin bzw. dem Käufer. Du schickst deine Zahlungsdetails im Chat und versendest erst nach Zahlungseingang." },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const c = pickContent(CONTENT, await getLocale());
  return pageMeta({ title: c.title, description: c.description, path: "/verkaufen/socken" });
}

export default function SellSocksPage() {
  return <SellPage dept="socken" content={CONTENT} />;
}
