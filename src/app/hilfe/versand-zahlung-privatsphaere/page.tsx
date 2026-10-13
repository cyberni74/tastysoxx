import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { pageMeta } from "@/lib/seo";
import { Guide, type GuideSection, type QA } from "../_Guide";

const PATH = "/hilfe/versand-zahlung-privatsphaere";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return pageMeta({ title: t("guide.ship"), description: t("meta.guideShipDesc"), path: PATH });
}

const DE: { intro: string; sections: GuideSection[]; faq: QA[] } = {
  intro: "Hier steht ehrlich, wie Zahlung und Versand ablaufen, wer welche Daten von dir sieht und was wir speichern.",
  sections: [
    {
      h: "Zahlung: direkt an die Verkäuferin",
      body: (
        <>
          <p>TastySoxx wickelt keine Zahlungen ab. Nach der Bestellung schickt dir die Verkäuferin ihre Zahlungsdetails im Chat, und du zahlst direkt an sie. Es gibt deshalb <b>keinen Treuhandservice und keinen Käuferschutz</b> durch uns.</p>
          <ul>
            <li>Zahle nur für eine Bestellung, die du auf TastySoxx abgeschlossen hast.</li>
            <li>Schau dir vorher Bewertungen und das blaue Häkchen an.</li>
            <li>Solange die Bestellung nicht als bezahlt bestätigt ist, kannst du sie stornieren.</li>
            <li>Bei Problemen: zuerst Chat, dann <Link href="/kontakt">Kontakt</Link> oder <Link href="/melden">Melden</Link>.</li>
          </ul>
        </>
      ),
    },
    {
      h: "Versand",
      body: (
        <ul>
          <li>Pauschal 4,90 € Versand pro Verkäuferin, unabhängig von der Anzahl der Artikel.</li>
          <li>Neutrale Verpackung ohne Hinweis auf den Inhalt.</li>
          <li>Alias statt Klarname auf dem Paket möglich – als Absender bei der Verkäuferin.</li>
          <li>Die Verkäuferin versendet nach Zahlungseingang und setzt den Status auf „Versendet“.</li>
        </ul>
      ),
    },
    {
      h: "Was die Verkäuferin von dir sieht",
      body: (
        <>
          <p>Deinen Benutzernamen, deine Chatnachrichten und – nur bei einer Bestellung – die <b>Lieferadresse dieser Bestellung</b>: Name, Straße, PLZ, Ort und Land. Deine E-Mail-Adresse und dein Passwort sieht sie nicht.</p>
          <p>Als Name kannst du angeben, unter dem du zuverlässig Post bekommst. Eine Packstation oder Postfiliale als Lieferadresse ist möglich, wenn der Paketdienst das unterstützt.</p>
        </>
      ),
    },
    {
      h: "Was andere sehen",
      body: (
        <p>Öffentlich sichtbar sind dein Benutzername, Land, Profilbild (falls hochgeladen), wann du zuletzt aktiv warst sowie bei Verkäuferinnen Profilangaben, Angebote und Bewertungen. Bestellungen und Chats sehen nur die Beteiligten.</p>
      ),
    },
    {
      h: "Was TastySoxx speichert",
      body: (
        <>
          <ul>
            <li>Konto: E-Mail-Adresse, Benutzername, Passwort (verschlüsselt), Bestätigung der Volljährigkeit, freiwillige Profilangaben.</li>
            <li>Angebote mit Fotos, Bestellungen mit Lieferadresse, Chatnachrichten, Bewertungen.</li>
            <li>Meldungen: Grund, Beschreibung und – freiwillig – eine Kontakt-E-Mail.</li>
          </ul>
          <p>Diese Daten liegen bei Supabase in einem Rechenzentrum in der EU (Frankfurt am Main). Die Website wird über Vercel ausgeliefert. Wir setzen nur technisch notwendige Cookies (Anmeldung, Sprache, Warenkorb). Details in der <Link href="/datenschutz">Datenschutzerklärung</Link>.</p>
        </>
      ),
    },
  ],
  faq: [
    { q: "Wie wird versendet?", a: "In neutraler Verpackung ohne Hinweis auf den Inhalt. Die Verkäuferin kann als Absender einen Alias statt ihres Klarnamens verwenden. Der Versand kostet pauschal 4,90 € pro Verkäuferin." },
    { q: "Gibt es einen Käuferschutz?", a: "Nein. Die Zahlung geht direkt an die Verkäuferin, TastySoxx hält kein Geld zurück und kann keine Erstattung garantieren. Du kannst eine Bestellung stornieren, solange sie nicht bezahlt ist, und uns Probleme jederzeit melden." },
    { q: "Wer sieht meine Adresse?", a: "Nur die Verkäuferin der jeweiligen Bestellung – und nur die Lieferadresse, die du bei dieser Bestellung angibst. Andere Nutzer:innen sehen sie nicht." },
    { q: "Bleibe ich anonym?", a: "Auf der Plattform trittst du nur mit deinem Benutzernamen auf. Für den Versand braucht die Verkäuferin allerdings eine Lieferadresse, unter der du Post bekommst." },
  ],
};

export default async function ShippingGuide() {
  const { t } = await getT(info);
  const c = DE;
  return (
    <Guide eyebrow={t("help.guide")} title={t("guide.ship")} intro={c.intro} sections={c.sections}
      faqTitle={t("help.faqTitle")} faq={c.faq} back={{ href: "/hilfe", label: t("help.back") }}
      related={[
        { href: "/hilfe/kaufen-und-verkaufen", label: t("guide.buySell") },
        { href: "/hilfe/angebotsregeln", label: t("guide.rules") },
      ]} />
  );
}
