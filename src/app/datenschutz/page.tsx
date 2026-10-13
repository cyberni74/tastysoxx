import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return { title: t("meta.privacy") };
}

const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: "1. Verantwortlicher",
    p: ["[Firmenname], [Anschrift], E-Mail: support@tastysoxx.com. Datenschutzbeauftragte:r: [Name, Kontakt oder „nicht benannt“]."],
  },
  {
    h: "2. Welche Daten wir verarbeiten",
    p: [
      "Kontodaten: E-Mail-Adresse, Benutzername, Passwort (verschlüsselt gespeichert), Bestätigung der Volljährigkeit sowie freiwillige Profilangaben (z. B. Land, Altersgruppe, Schuhgröße, Profilbild).",
      "Bestelldaten: bestellte Artikel, Preise und die Lieferadresse. Die Lieferadresse ist nur für die Verkäuferin der jeweiligen Bestellung sichtbar.",
      "Nachrichten: Inhalte aus dem Chat zwischen Käufer:in und Verkäuferin, zur Abwicklung von Bestellungen und zur Aufklärung von Missbrauch.",
      "Technische Daten: IP-Adresse und Zeitpunkt von Anfragen in Server-Logs.",
    ],
  },
  {
    h: "3. Zwecke und Rechtsgrundlagen",
    p: [
      "Bereitstellung des Marktplatzes und Abwicklung von Bestellungen (Art. 6 Abs. 1 lit. b DSGVO), Sicherheit und Missbrauchsabwehr (Art. 6 Abs. 1 lit. f DSGVO), Erfüllung gesetzlicher Pflichten (Art. 6 Abs. 1 lit. c DSGVO).",
    ],
  },
  {
    h: "4. Hosting und Dienstleister",
    p: [
      "Datenbank, Anmeldung und Dateispeicher: Supabase Inc. Die Daten werden in einem Rechenzentrum in der EU (Frankfurt am Main) gespeichert. Mit Supabase besteht ein Auftragsverarbeitungsvertrag. [prüfen]",
      "Website-Hosting: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Beim Aufruf der Seite werden technische Daten (z. B. IP-Adresse) verarbeitet. Eine Übermittlung in die USA erfolgt auf Grundlage des EU-US Data Privacy Framework bzw. der Standardvertragsklauseln. [prüfen]",
    ],
  },
  {
    h: "5. Cookies",
    p: [
      "Wir setzen nur technisch notwendige Cookies ein, z. B. um dich angemeldet zu halten, deine Sprache zu merken und deinen Warenkorb zu speichern. Es gibt keine Tracking- oder Werbe-Cookies. Eine Einwilligung ist dafür nicht erforderlich (§ 25 Abs. 2 TDDDG).",
    ],
  },
  {
    h: "6. Speicherdauer",
    p: [
      "Kontodaten speichern wir, solange dein Konto besteht. Bestelldaten bewahren wir im Rahmen gesetzlicher Aufbewahrungsfristen auf. [Fristen ergänzen]",
    ],
  },
  {
    h: "7. Deine Rechte",
    p: [
      "Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Schreib dazu an support@tastysoxx.com. Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, z. B. [zuständige Behörde].",
    ],
  },
  {
    h: "8. Anonymität",
    p: [
      "Auf der Plattform trittst du nur mit deinem Benutzernamen auf. Wir verkaufen keine Daten an Dritte. Stand: [Datum].",
    ],
  },
];

const SECTIONS_EN: { h: string; p: string[] }[] = [
  {
    h: "1. Controller",
    p: ["[Company name], [Address], email: support@tastysoxx.com. Data protection officer: [Name, contact or “not appointed”]."],
  },
  {
    h: "2. What data we process",
    p: [
      "Account data: email address, username, password (stored encrypted), confirmation of legal age and optional profile details (e.g. country, age range, shoe size, profile picture).",
      "Order data: ordered items, prices and the shipping address. The shipping address is only visible to the seller of the respective order.",
      "Messages: content of the chat between buyer and seller, for handling orders and investigating abuse.",
      "Technical data: IP address and time of requests in server logs.",
    ],
  },
  {
    h: "3. Purposes and legal bases",
    p: [
      "Providing the marketplace and handling orders (Art. 6(1)(b) GDPR), security and abuse prevention (Art. 6(1)(f) GDPR), compliance with legal obligations (Art. 6(1)(c) GDPR).",
    ],
  },
  {
    h: "4. Hosting and service providers",
    p: [
      "Database, sign-in and file storage: Supabase Inc. Data is stored in a data centre in the EU (Frankfurt am Main). A data processing agreement is in place with Supabase. [check]",
      "Website hosting: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. When you visit the site, technical data (e.g. IP address) is processed. Transfers to the USA are based on the EU-US Data Privacy Framework or standard contractual clauses. [check]",
    ],
  },
  {
    h: "5. Cookies",
    p: [
      "We only use strictly necessary cookies, e.g. to keep you signed in, remember your language and store your cart. There are no tracking or advertising cookies. No consent is required for these (§ 25(2) TDDDG).",
    ],
  },
  {
    h: "6. Storage period",
    p: [
      "We store account data as long as your account exists. Order data is kept in line with statutory retention periods. [add periods]",
    ],
  },
  {
    h: "7. Your rights",
    p: [
      "You have the right to access, rectification, erasure, restriction of processing, data portability and objection. Write to support@tastysoxx.com. You can also lodge a complaint with a data protection supervisory authority, e.g. [competent authority].",
    ],
  },
  {
    h: "8. Anonymity",
    p: [
      "On the platform you only appear under your username. We do not sell data to third parties. Last updated: [Date].",
    ],
  },
];

export default async function PrivacyPage() {
  const { t, locale } = await getT(info);
  const sections = locale === "en" ? SECTIONS_EN : SECTIONS;
  return (
    <article className="wrap grid max-w-2xl gap-6 py-10">
      <h1 className="text-4xl font-extrabold">{t("legal.privacyTitle")}</h1>
      <p className="rounded-xl border border-accent bg-accent-soft p-3 text-sm font-semibold">{t("legal.notice")}</p>
      {locale === "en" && <p className="text-sm font-semibold">{t("legal.binding")}</p>}
      {sections.map((s) => (
        <section key={s.h} className="grid gap-2">
          <h2 className="text-xl font-bold">{s.h}</h2>
          {s.p.map((t) => <p key={t} className="text-muted">{t}</p>)}
        </section>
      ))}
    </article>
  );
}
