import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { SellPage, pickContent, type SellContent } from "../_SellPage";

const CONTENT: Record<"de" | "en", SellContent> = {
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
  en: {
    title: "Selling worn socks – how it works",
    description: "Selling worn socks: what to include in your listing, photo tips, pricing guide, packaging and rules on TastySoxx.",
    intro: "Socks are the easiest way to start: quick to photograph, easy to pack, cheap to ship. Here's what makes a good listing.",
    listing: [
      "Size as a shoe-size range, e.g. 38–40 (EU) – usually what the label says.",
      "Type of sock: ankle, sports, knee-high, nylons or tights.",
      "Material, e.g. cotton, wool, nylon or synthetic.",
      "Days worn and what you wore them for (everyday, sport, work).",
      "Be honest about condition: light, normal or heavy signs of wear.",
      "Colour and details (pattern, logo, small holes) in the description.",
    ],
    photos: [
      "Lay the socks flat on a calm, plain background (bed sheet, towel, wooden floor).",
      "Use daylight from the side instead of flash – colours and fabric look real.",
      "A photo of the sole and one of the size label build trust.",
      "Photos on the foot up to the ankle or knee are fine, as long as no face and nothing explicit is visible.",
      "No recognizable furniture, windows, letters or mirrors in the shot – they give away more than you think.",
    ],
    pricing: [
      { label: "Ankle socks, worn 1 day", range: "€8–15" },
      { label: "Sports socks after a workout", range: "€12–25" },
      { label: "Knee socks / nylons", range: "€12–25" },
      { label: "Tights", range: "€15–30" },
      { label: "Longer wear (3+ days)", range: "+€5–15" },
    ],
    packaging: [
      "Put the socks in a zip or vacuum-sealed bag – it keeps scent and condition until they arrive.",
      "Plain envelope or box with no hint of what's inside.",
      "An alias instead of your real name on the parcel is enough as sender.",
      "Only ship once the payment has arrived. Then click “Mark as shipped” in your dashboard.",
    ],
    notAllowed: [
      "Photos showing your face or explicit body shots.",
      "Listings by or involving anyone under 18 – not even implied (e.g. school uniform themes).",
      "Bodily fluids beyond normal wear, or anything hazardous to health.",
      "False details about size, material, days worn or condition.",
      "Meetings, pick-up or payment outside an order.",
    ],
    faq: [
      { q: "How long should I wear socks before selling?", a: "That's up to you. Most listings are 1 to 3 days. State the days worn honestly – it's one of the most important things buyers look at." },
      { q: "Can I offer extras, like a workout or longer wear?", a: "Yes, describe extras in the listing or agree on them in the chat. They must be legal and must not include explicit content." },
      { q: "How much is shipping?", a: "The buyer pays a flat €4.90 per seller. Socks fit in a large letter or small parcel." },
      { q: "How do I get paid?", a: "Payment goes directly between you and the buyer. You send your payment details in the chat and only ship once the money has arrived." },
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
