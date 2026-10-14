import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return pageMeta({ title: t("meta.privacy"), path: "/datenschutz" });
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
      "Meldungen: gemeldetes Angebot oder Profil, Grund, Beschreibung, Zeitpunkt, bei angemeldeten Personen die Konto-ID der meldenden Person sowie – freiwillig – eine Kontakt-E-Mail für Rückfragen. Meldungen sehen nur Administrator:innen, nicht die gemeldete Person.",
      "Technische Daten: IP-Adresse und Zeitpunkt von Anfragen in Server-Logs.",
    ],
  },
  {
    h: "3. Zwecke und Rechtsgrundlagen",
    p: [
      "Bereitstellung des Marktplatzes und Abwicklung von Bestellungen (Art. 6 Abs. 1 lit. b DSGVO), Sicherheit, Missbrauchsabwehr und Bearbeitung von Meldungen (Art. 6 Abs. 1 lit. f DSGVO), Erfüllung gesetzlicher Pflichten (Art. 6 Abs. 1 lit. c DSGVO).",
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
      "Wir setzen nur technisch notwendige Cookies ein, um dich angemeldet zu halten und um uns zu merken, dass du die Altersabfrage und den Cookie-Hinweis bestätigt hast (jeweils bis zu 12 Monate). Der Warenkorb wird nur lokal in deinem Browser gespeichert (Local Storage) und nicht an uns übertragen. Es gibt keine Tracking- oder Werbe-Cookies. Eine Einwilligung ist dafür nicht erforderlich (§ 25 Abs. 2 TDDDG).",
    ],
  },
  {
    h: "6. Speicherdauer",
    p: [
      "Kontodaten speichern wir, solange dein Konto besteht. Meldungen speichern wir, bis sie abschließend bearbeitet sind, längstens [Frist]; eine freiwillige Kontakt-E-Mail löschen wir mit der Meldung. Bestelldaten bewahren wir im Rahmen gesetzlicher Aufbewahrungsfristen auf. [Fristen ergänzen]",
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

export default async function PrivacyPage() {
  const { t } = await getT(info);
  const sections = SECTIONS;
  return (
    <article className="wrap grid max-w-2xl gap-6 py-10">
      <h1 className="text-4xl font-extrabold">{t("legal.privacyTitle")}</h1>
      <p className="rounded-xl border border-accent bg-accent-soft p-3 text-sm font-semibold">{t("legal.notice")}</p>
      {sections.map((s) => (
        <section key={s.h} className="grid gap-2">
          <h2 className="text-xl font-bold">{s.h}</h2>
          {s.p.map((t) => <p key={t} className="text-muted">{t}</p>)}
        </section>
      ))}
    </article>
  );
}
