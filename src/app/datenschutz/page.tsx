import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return pageMeta({ title: t("meta.privacy"), path: "/datenschutz" });
}

type Section = { id: string; h: string; p?: string[]; ul?: string[]; after?: string[] };

/**
 * Describes what the shop actually does (Supabase Auth/DB/Storage in Frankfurt, Vercel hosting,
 * chat, orders, reports, consent cookies). Anything the operator must decide is in [eckigen Klammern].
 */
const SECTIONS: Section[] = [
  {
    id: "verantwortlicher",
    h: "1. Verantwortlicher",
    p: [
      "Verantwortlich für die Datenverarbeitung auf dieser Website ist: [Firmenname bzw. Name], [Straße Hausnummer], [PLZ Ort], [Land]. E-Mail: support@tastysoxx.com.",
      "Datenschutzbeauftragte:r: [Name und Kontakt oder „nicht benannt“].",
    ],
  },
  {
    id: "ueberblick",
    h: "2. Das Wichtigste in Kürze",
    ul: [
      "TastySoxx ist ein Marktplatz für getragene Socken, Slips und BHs. Nur Personen ab 18 Jahren dürfen ihn nutzen.",
      "Wir verwenden keine Werbe- und keine Analyse-Tools und setzen keine Tracking-Cookies.",
      "Zahlungen laufen nicht über uns. Wir erhalten und speichern keine Bank-, Kreditkarten- oder PayPal-Daten.",
      "Wir verkaufen keine Daten und geben sie nicht zu Werbezwecken weiter.",
      "Deine Lieferadresse sieht nur die Verkäuferin der jeweiligen Bestellung.",
    ],
  },
  {
    id: "daten",
    h: "3. Welche Daten wir verarbeiten und wer sie sehen kann",
    p: ["Beim Besuch der Website und bei der Nutzung deines Kontos verarbeiten wir die folgenden Daten."],
    ul: [
      "Kontodaten: E-Mail-Adresse, Benutzername, Passwort (nur als verschlüsselter Hash gespeichert), gewählte Rolle (Käufer:in oder Verkäuferin), Zeitpunkt der Bestätigung deiner Volljährigkeit und deiner Einwilligung (siehe Abschnitt 4).",
      "Profilangaben (freiwillig): Land, Altersgruppe, Figur, Schuhgröße, Beschreibung, Profilbild, Status „verifiziert“ und Zeitpunkt der letzten Aktivität.",
      "Angebote: Titel, Beschreibung, Kategorie, Größe, Farbe, Material, Zustand, Tragedauer, Preis und hochgeladene Fotos.",
      "Bestellungen: bestellte Artikel, Preise, Status, Datum sowie Name, Straße, PLZ, Ort und Land der Lieferadresse.",
      "Nachrichten: Inhalte des Chats zwischen Käufer:in und Verkäuferin.",
      "Bewertungen: Sterne und Text, die du nach einer abgeschlossenen Bestellung abgibst.",
      "Meldungen: gemeldetes Angebot oder Profil, Grund, Beschreibung, Zeitpunkt, bei angemeldeten Personen die Konto-ID der meldenden Person sowie – freiwillig – eine Kontakt-E-Mail für Rückfragen.",
      "Technische Daten: IP-Adresse, Zeitpunkt, aufgerufene Adresse und Browser-Angaben in Server-Protokollen (siehe Abschnitt 8).",
    ],
    after: [
      "Öffentlich sichtbar sind: Benutzername, Profilangaben, Profilbild, Angebote mit Fotos, Bewertungen und der Zeitpunkt der letzten Aktivität. Wähle deshalb einen Benutzernamen und Fotos, aus denen du nicht identifizierbar sein willst, wenn du anonym bleiben möchtest, und zeige kein Gesicht.",
      "Nur die Beteiligten sehen: Chat-Nachrichten (Käufer:in und Verkäuferin) und Bestellungen (Käufer:in und Verkäuferin). Die Lieferadresse sieht nur die Verkäuferin der jeweiligen Bestellung.",
      "Nur wir sehen: Meldungen, Server-Protokolle und die technischen Kontodaten. Die Zugriffe sind auf das Notwendige beschränkt.",
    ],
  },
  {
    id: "besondere-kategorien",
    h: "4. Besondere Kategorien personenbezogener Daten und deine Einwilligung",
    p: [
      "Schon die Nutzung eines Marktplatzes für getragene Wäsche kann Rückschlüsse auf das Sexualleben einer Person zulassen. Solche Daten sind nach Art. 9 DSGVO besonders geschützt. Wir verarbeiten sie nur auf Grundlage deiner ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO), die du bei der Registrierung mit einem eigenen Häkchen erteilst. Ohne diese Einwilligung können wir kein Konto anlegen.",
      "Du kannst die Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, indem du uns unter support@tastysoxx.com schreibst. Wir löschen dann dein Konto und deine Daten (soweit keine gesetzliche Aufbewahrungspflicht entgegensteht). Bis zum Widerruf bleibt die Verarbeitung rechtmäßig.",
      "Den Zeitpunkt deiner Einwilligung speichern wir als Nachweis.",
    ],
  },
  {
    id: "zwecke",
    h: "5. Zwecke und Rechtsgrundlagen",
    ul: [
      "Konto, Marktplatz, Chat, Bestellabwicklung und Bewertungen: Erfüllung des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO).",
      "Altersbestätigung, Bearbeitung von Meldungen, Schutz vor Betrug und Missbrauch, Schutz Minderjähriger, Sicherheit und Stabilität der Website: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) und gesetzliche Pflichten (Art. 6 Abs. 1 lit. c DSGVO).",
      "Besondere Kategorien (Abschnitt 4): ausdrückliche Einwilligung (Art. 9 Abs. 2 lit. a DSGVO).",
      "Technisch notwendige Cookies und lokaler Speicher: § 25 Abs. 2 Nr. 2 TDDDG; Datenverarbeitung dabei nach Art. 6 Abs. 1 lit. b und f DSGVO.",
      "Verifizierung von Verkäuferinnen auf deinen Wunsch: Vertragserfüllung und berechtigtes Interesse an vertrauenswürdigen Profilen (Art. 6 Abs. 1 lit. b und f DSGVO). [Ablauf festlegen: welche Nachweise verlangt werden und wann sie gelöscht werden, z. B. unmittelbar nach der Prüfung.]",
      "Systemmails (Bestätigung der E-Mail-Adresse, Passwort zurücksetzen): Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO). Wir senden keine Werbe-E-Mails.",
    ],
  },
  {
    id: "empfaenger",
    h: "6. Empfänger und Dienstleister",
    p: ["Wir setzen folgende Dienstleister als Auftragsverarbeiter nach Art. 28 DSGVO ein:"],
    ul: [
      "Supabase (Supabase, Inc., USA): Datenbank, Anmeldung, Dateispeicher für Fotos und Versand der Systemmails. Das Projekt liegt in einem Rechenzentrum in Frankfurt am Main (Region eu-central-1).",
      "Vercel (Vercel Inc., USA): Hosting und Auslieferung der Website. Die serverseitige Verarbeitung läuft in der Region Frankfurt (fra1); Inhalte können über ein weltweites Auslieferungsnetz bereitgestellt werden.",
    ],
    after: [
      "Weitere Empfänger sind die anderen Nutzer im oben beschriebenen Umfang sowie Behörden und Gerichte, wenn wir dazu gesetzlich verpflichtet sind oder es zur Verfolgung von Rechtsverstößen erforderlich ist.",
      "Für den E-Mail-Versand nutzen wir derzeit den Dienst von Supabase. [Bei Wechsel zu einem eigenen Versanddienstleister hier ergänzen.]",
    ],
  },
  {
    id: "drittland",
    h: "7. Übermittlung in Drittländer",
    p: [
      "Supabase, Inc. und Vercel Inc. sitzen in den USA. Ein Zugriff aus den USA ist deshalb nicht ausgeschlossen. Die Übermittlung sichern wir durch Standardvertragsklauseln der EU-Kommission ab [und/oder die Zertifizierung des Anbieters nach dem EU-US Data Privacy Framework – bitte aktuell prüfen und eintragen]. Eine Kopie der Garantien erhältst du auf Anfrage.",
    ],
  },
  {
    id: "cookies",
    h: "8. Cookies, lokaler Speicher und Server-Protokolle",
    p: ["Wir setzen ausschließlich technisch notwendige Cookies und lokalen Speicher ein. Es gibt keine Analyse-, Werbe- oder Tracking-Technik."],
    ul: [
      "Anmelde-Cookie (Name beginnt mit „sb-“): hält deine Sitzung aufrecht, bis du dich abmeldest oder sie abläuft.",
      "„ts-age“: merkt sich, dass du die Altersabfrage bestätigt hast (bis zu 12 Monate). Angemeldete Personen sehen die Abfrage nicht, weil sie ihre Volljährigkeit bei der Registrierung bestätigt haben.",
      "„ts-cookie“: merkt sich, dass du den Cookie-Hinweis gesehen hast (bis zu 12 Monate).",
      "Lokaler Speicher „tastysoxx-cart“: dein Warenkorb. Er bleibt in deinem Browser und wird erst bei der Bestellung an uns übertragen. Du kannst ihn jederzeit in den Browser-Einstellungen löschen.",
      "Schriftarten werden von unserem eigenen Server ausgeliefert. Es besteht keine Verbindung zu Google oder anderen Schriftdiensten.",
      "Server-Protokolle: Beim Aufruf der Website verarbeiten Vercel und Supabase technisch bedingt IP-Adresse, Zeitpunkt, aufgerufene Adresse und Browser-Angaben, um die Website bereitzustellen und Angriffe abzuwehren. Die Daten werden nach kurzer Zeit gelöscht [Aufbewahrungsdauer gemäß Anbieter-Einstellungen eintragen].",
    ],
  },
  {
    id: "speicherdauer",
    h: "9. Speicherdauer",
    ul: [
      "Konto, Profil, Angebote und Nachrichten: bis zur Löschung deines Kontos. Du kannst dein Konto jederzeit selbst unter „Konto“ → „Konto löschen“ löschen (nur ohne offene Bestellungen) oder die Löschung unter support@tastysoxx.com verlangen. Dabei werden Profil, Angebote mit Fotos und alle Chats gelöscht.",
      "Bewertungen und abgeschlossene Bestellungen: Sie bleiben nach der Löschung deines Kontos für die jeweils andere Seite erhalten (Betrag, Datum, Artikel, Bewertungstext), aber ohne Bezug zu deinem Konto. Deine Lieferadresse in Bestellungen wird bei der Löschung entfernt.",
      "Bestelldaten ohne Personenbezug (Betrag, Datum, Artikel): solange sie für die Abwicklung, mögliche Ansprüche und gesetzliche Aufbewahrungspflichten erforderlich sind [Fristen prüfen, z. B. nach HGB und AO].",
      "Meldungen: [Dauer festlegen, z. B. 12 Monate nach Abschluss der Bearbeitung], bei Verstößen länger, soweit zur Rechtsverfolgung nötig.",
      "Nachweis der Einwilligung und der Volljährigkeitsbestätigung: mit dem Konto, danach so lange, wie wir die Einwilligung nachweisen müssen.",
      "Verifizierungsunterlagen: [Löschfrist festlegen].",
    ],
  },
  {
    id: "sicherheit",
    h: "10. Sicherheit",
    p: [
      "Die Verbindung zur Website ist per TLS verschlüsselt. Passwörter speichern wir nur als Hash. In der Datenbank gelten Zugriffsregeln, nach denen jede Person nur ihre eigenen Bestellungen und Chats sehen kann. Der Zugriff auf Meldungen ist auf berechtigte Administrator:innen beschränkt. Eine vollständige Sicherheit im Internet kann dennoch nicht garantiert werden.",
    ],
  },
  {
    id: "rechte",
    h: "11. Deine Rechte",
    p: ["Du hast nach der DSGVO folgende Rechte gegenüber uns:"],
    ul: [
      "Auskunft über deine gespeicherten Daten (Art. 15)",
      "Berichtigung unrichtiger Daten (Art. 16)",
      "Löschung (Art. 17) – ganz einfach selbst über „Konto“ → „Konto löschen“",
      "Einschränkung der Verarbeitung (Art. 18)",
      "Herausgabe deiner Daten in einem gängigen Format (Art. 20)",
      "Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21)",
      "Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3)",
    ],
    after: [
      "Schreib uns dazu an support@tastysoxx.com. Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, zum Beispiel bei der Behörde deines Wohnorts oder unseres Sitzes [zuständige Aufsichtsbehörde eintragen].",
    ],
  },
  {
    id: "weitere",
    h: "12. Weitere Hinweise",
    ul: [
      "Minderjährige: Der Marktplatz ist nur für Personen ab 18 Jahren. Bei Verdacht auf Minderjährige sperren wir das Konto und löschen die Daten.",
      "Keine automatisierten Entscheidungen: Wir treffen keine Entscheidungen, die ausschließlich auf automatisierter Verarbeitung beruhen und dir gegenüber rechtliche Wirkung entfalten.",
      "Daten Dritter: Lade nur Fotos und Inhalte hoch, an denen du alle Rechte hast, und gib im Chat keine Daten anderer Personen ohne deren Zustimmung weiter. Entferne vor dem Hochladen Metadaten (z. B. Standort) aus deinen Fotos.",
      "Pflicht zur Bereitstellung: Ohne E-Mail-Adresse, Benutzername und die genannten Bestätigungen können wir kein Konto anlegen. Für eine Bestellung brauchen wir die Lieferadresse.",
    ],
  },
  {
    id: "aenderungen",
    h: "13. Änderungen",
    p: ["Wir passen diese Erklärung an, wenn sich der Shop, die Dienstleister oder die Rechtslage ändern. Es gilt die jeweils hier veröffentlichte Fassung. Stand: [Datum]."],
  },
];

export default async function PrivacyPage() {
  const { t } = await getT(info);
  return (
    <article className="wrap grid max-w-2xl gap-6 py-10">
      <h1 className="text-4xl font-extrabold">{t("legal.privacyTitle")}</h1>
      <p className="rounded-xl border border-accent bg-accent-soft p-3 text-sm font-semibold">{t("legal.notice")}</p>

      <nav aria-label="Inhalt" className="card p-4 text-sm">
        <ol className="grid gap-1 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <li key={s.id}><a href={`#${s.id}`} className="text-muted hover:text-accent">{s.h}</a></li>
          ))}
        </ol>
      </nav>

      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="grid scroll-mt-20 gap-2">
          <h2 className="text-xl font-bold">{s.h}</h2>
          {s.p?.map((x) => <p key={x} className="text-muted">{x}</p>)}
          {s.ul && (
            <ul className="grid list-disc gap-1.5 pl-5 text-muted marker:text-accent">
              {s.ul.map((x) => <li key={x}>{x}</li>)}
            </ul>
          )}
          {s.after?.map((x) => <p key={x} className="text-muted">{x}</p>)}
        </section>
      ))}

      <p className="text-sm text-muted">
        Fragen zum Datenschutz? Schreib uns über die <Link href="/kontakt" className="font-semibold text-accent underline">Kontaktseite</Link>.
        Gemeldete Inhalte kannst du <Link href="/melden" className="font-semibold text-accent underline">hier melden</Link>.
      </p>
    </article>
  );
}
