import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutz" };

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
      "Wir setzen nur technisch notwendige Cookies ein, z. B. um dich angemeldet zu halten und deinen Warenkorb zu speichern. Es gibt keine Tracking- oder Werbe-Cookies. Eine Einwilligung ist dafür nicht erforderlich (§ 25 Abs. 2 TDDDG).",
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

export default function PrivacyPage() {
  return (
    <article className="wrap grid max-w-2xl gap-6 py-10">
      <h1 className="text-4xl font-extrabold">Datenschutzerklärung</h1>
      <p className="rounded-xl border border-accent bg-accent-soft p-3 text-sm font-semibold">
        Platzhalter – vor dem Livegang rechtlich prüfen lassen. Alle Angaben in [eckigen Klammern] müssen ersetzt werden.
      </p>
      {SECTIONS.map((s) => (
        <section key={s.h} className="grid gap-2">
          <h2 className="text-xl font-bold">{s.h}</h2>
          {s.p.map((t) => <p key={t} className="text-muted">{t}</p>)}
        </section>
      ))}
    </article>
  );
}
