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

const EN: typeof DE = {
  intro: "An honest overview of how payment and shipping work, who sees which of your details and what we store.",
  sections: [
    {
      h: "Payment: directly to the seller",
      body: (
        <>
          <p>TastySoxx does not process payments. After you order, the seller sends you her payment details in the chat and you pay her directly. That means there is <b>no escrow and no buyer protection</b> from us.</p>
          <ul>
            <li>Only pay for an order you placed on TastySoxx.</li>
            <li>Check reviews and the blue check mark first.</li>
            <li>As long as the order hasn’t been confirmed as paid, you can cancel it.</li>
            <li>If there’s a problem: chat first, then <Link href="/kontakt">Contact</Link> or <Link href="/melden">Report</Link>.</li>
          </ul>
        </>
      ),
    },
    {
      h: "Shipping",
      body: (
        <ul>
          <li>Flat €4.90 shipping per seller, no matter how many items.</li>
          <li>Neutral packaging with no hint of what’s inside.</li>
          <li>An alias instead of a real name on the parcel is possible – as the seller’s sender name.</li>
          <li>The seller ships once payment has arrived and sets the status to “Shipped”.</li>
        </ul>
      ),
    },
    {
      h: "What the seller sees about you",
      body: (
        <>
          <p>Your username, your chat messages and – only for an order – the <b>shipping address of that order</b>: name, street, postcode, city and country. She does not see your email address or password.</p>
          <p>Use a name under which you reliably receive mail. A parcel locker or post office as delivery address works if the carrier supports it.</p>
        </>
      ),
    },
    {
      h: "What others see",
      body: (
        <p>Publicly visible are your username, country, profile picture (if uploaded), when you were last active, and for sellers their profile details, listings and reviews. Orders and chats are only visible to the people involved.</p>
      ),
    },
    {
      h: "What TastySoxx stores",
      body: (
        <>
          <ul>
            <li>Account: email address, username, password (encrypted), confirmation of legal age, optional profile details.</li>
            <li>Listings with photos, orders with shipping address, chat messages, reviews.</li>
            <li>Reports: reason, description and – optionally – a contact email.</li>
          </ul>
          <p>This data is stored with Supabase in a data centre in the EU (Frankfurt am Main). The website is served via Vercel. We only use strictly necessary cookies (sign-in, language, cart). Details in the <Link href="/datenschutz">privacy policy</Link>.</p>
        </>
      ),
    },
  ],
  faq: [
    { q: "How is it shipped?", a: "In neutral packaging with no hint of what's inside. The seller can use an alias instead of her real name as sender. Shipping is a flat €4.90 per seller." },
    { q: "Is there buyer protection?", a: "No. Payment goes directly to the seller; TastySoxx doesn't hold any money and can't guarantee a refund. You can cancel an order as long as it hasn't been paid, and report problems to us at any time." },
    { q: "Who sees my address?", a: "Only the seller of the order in question – and only the shipping address you enter for that order. Other users don't see it." },
    { q: "Do I stay anonymous?", a: "On the platform you only appear under your username. For shipping, however, the seller needs an address where you receive mail." },
  ],
};

export default async function ShippingGuide() {
  const { t, locale } = await getT(info);
  const c = locale === "en" ? EN : DE;
  return (
    <Guide eyebrow={t("help.guide")} title={t("guide.ship")} intro={c.intro} sections={c.sections}
      faqTitle={t("help.faqTitle")} faq={c.faq} back={{ href: "/hilfe", label: t("help.back") }}
      related={[
        { href: "/hilfe/kaufen-und-verkaufen", label: t("guide.buySell") },
        { href: "/hilfe/angebotsregeln", label: t("guide.rules") },
      ]} />
  );
}
