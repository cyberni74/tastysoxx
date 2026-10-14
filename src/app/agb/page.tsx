import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { pageMeta } from "@/lib/seo";
import { SHIPPING_CENTS } from "@/lib/constants";
import { eur } from "@/lib/format";
import { getLegal, hasPlaceholders, operatorLine } from "@/lib/legal";
import { LegalNotice } from "@/components/LegalNotice";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return pageMeta({ title: t("meta.terms"), path: "/agb" });
}

type Section = { id: string; h: string; p?: string[]; ul?: string[]; after?: string[] };

const STAND = "14. Oktober 2026";

function buildSections(l: ReturnType<typeof getLegal>): Section[] {
  return [
    {
      id: "geltung",
      h: "§ 1 Geltungsbereich und Rolle des Betreibers",
      p: [
        `Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung des Marktplatzes TastySoxx, betrieben von ${operatorLine(l)} (nachfolgend „Betreiber“).`,
        "Auf TastySoxx bieten Nutzerinnen und Nutzer getragene Socken und Strümpfe, Slips und Unterwäsche sowie BHs an und kaufen sie. Kaufverträge kommen ausschließlich zwischen Käufer:in und Verkäufer:in zustande. Der Betreiber ist weder Verkäufer noch Vertragspartei dieser Kaufverträge. Er stellt die Plattform bereit und ist kein Zahlungsdienstleister.",
        "Abweichende Bedingungen von Nutzer:innen gelten nicht, auch wenn der Betreiber ihnen nicht ausdrücklich widerspricht.",
      ],
    },
    {
      id: "registrierung",
      h: "§ 2 Registrierung, Mindestalter und Konto",
      p: [
        "Die Nutzung ist nur Personen ab 18 Jahren gestattet. Bei der Registrierung bestätigst du dein Alter und erteilst die in der Datenschutzerklärung beschriebene ausdrückliche Einwilligung. Ohne beides ist kein Konto möglich. Der Betreiber kann jederzeit einen Altersnachweis verlangen und Konten bei Zweifeln sperren.",
        "Du musst bei der Registrierung wahrheitsgemäße Angaben machen. Jede Person darf nur ein Konto führen. Zugangsdaten sind geheim zu halten; für Handlungen über dein Konto bist du verantwortlich, sofern du den Missbrauch nicht zu vertreten hast.",
        "Das blaue Häkchen „verifiziert“ zeigt, dass der Betreiber Alter und Identität der Verkäufer:in geprüft hat. Es ist keine Garantie für die Qualität von Angeboten oder die Zuverlässigkeit der Person.",
      ],
    },
    {
      id: "leistungen",
      h: "§ 3 Leistungen des Betreibers",
      p: [
        "Der Betreiber stellt Funktionen für Angebote, Suche, privaten Chat, Bestellungen und Bewertungen bereit. Die Nutzung ist derzeit kostenlos (siehe § 8). Eine bestimmte Verfügbarkeit wird nicht zugesagt; Wartung und Weiterentwicklung können zu Unterbrechungen führen.",
        "Sortierung und Reihenfolge: Angebote werden standardmäßig nach Aktualität angezeigt und können nach Preis sortiert werden, Verkäufer:innen nach letzter Aktivität oder Anzahl der Bewertungen. Es gibt keine bezahlte Bevorzugung.",
      ],
    },
    {
      id: "angebote",
      h: "§ 4 Angebote (Socken, Slips, BHs)",
      p: [
        "Angeboten werden dürfen getragene Socken und Strümpfe, Slips und Unterwäsche sowie BHs, Sport-BHs und Bralettes.",
        "Jedes Angebot muss wahrheitsgemäß enthalten: Bereich und Kategorie, Material, Tragedauer in Tagen, Zustand, Preis und mindestens ein Foto des angebotenen Produkts. Bei Slips und BHs ist die Größe Pflicht (z. B. M / 38 bzw. 75B), bei Socken empfohlen.",
        "Verkäufer:innen sind für die Richtigkeit und Rechtmäßigkeit ihrer Angaben selbst verantwortlich. Einzelheiten stehen in den Angebotsregeln unter Hilfe.",
      ],
    },
    {
      id: "verbote",
      h: "§ 5 Verbotene Inhalte und Verhalten",
      p: ["Nicht erlaubt sind insbesondere:"],
      ul: [
        "jeder Bezug zu Minderjährigen, auch Altersangaben oder Fotos, die Minderjährige nahelegen",
        "Fotos oder Angaben, die Gesicht, Namen, Adresse oder andere Daten Dritter ohne deren Zustimmung zeigen",
        "explizite, pornografische oder gewaltverherrlichende Inhalte",
        "gesundheitsgefährdende Zusätze oder Angebote, die gegen geltendes Recht verstoßen",
        "Betrug, Fake-Profile, falsche Angaben zu Tragedauer oder Zustand",
        "Belästigung, Drohung, Nötigung und Druck auf andere Nutzer:innen",
        "Spam, Werbung für Dritte und das Verbreiten von Schadsoftware",
        "Inhalte, die Rechte Dritter verletzen (z. B. fremde Fotos)",
      ],
      after: ["Der Betreiber kann Inhalte und Konten bei Verstößen nach § 9 entfernen oder sperren."],
    },
    {
      id: "bestellung",
      h: "§ 6 Bestellung, Bezahlung, Versand",
      p: [
        "Mit Absenden einer Bestellung gibt die Käuferin bzw. der Käufer ein verbindliches Angebot an die Verkäufer:in ab; die Artikel werden reserviert. Der Kaufvertrag kommt zustande, wenn die Verkäufer:in den Zahlungseingang bestätigt. Davor kann die Bestellung von beiden Seiten storniert werden; die Artikel werden dann wieder freigegeben.",
        "Die Bezahlung wird nicht über den Betreiber abgewickelt. Die Verkäufer:in übermittelt ihre Zahlungsdetails im Chat; gezahlt wird direkt an sie. Der Betreiber hält kein Geld treuhänderisch und bietet weder Käuferschutz noch Erstattungen an. Prüfe Zahlungsdetails sorgfältig und zahle nur über Wege, die du kennst und für sicher hältst.",
        `Die Verkäufer:in versendet nach Zahlungseingang in neutraler Verpackung ohne Hinweis auf den Inhalt. Die Versandkostenpauschale beträgt ${eur(SHIPPING_CENTS)} je Verkäufer:in und Bestellung. Die Lieferadresse sieht nur die Verkäufer:in der jeweiligen Bestellung; sie darf sie ausschließlich zur Abwicklung der Bestellung verwenden.`,
        "Käufer:innen bestätigen den Erhalt der Ware. Erfolgt keine Bestätigung, gilt der Erhalt 14 Tage nach dem als „versendet“ markierten Zeitpunkt automatisch als bestätigt; danach kann bewertet werden. Gesetzliche Rechte bleiben unberührt. Die automatische Bestätigung ist kein Käuferschutz.",
        "Bewertungen müssen der Wahrheit entsprechen und dürfen nur nach einer abgeschlossenen Bestellung abgegeben werden. Sie können nachträglich nicht geändert werden.",
      ],
    },
    {
      id: "widerruf",
      h: "§ 7 Widerruf und Gewährleistung",
      p: [
        "Die Kaufverträge bestehen zwischen den Nutzer:innen; der Betreiber ist daran nicht beteiligt. Verkauft eine Privatperson an eine Privatperson, besteht kein gesetzliches Widerrufsrecht. Die Verkäufer:in kann die Gewährleistung für gebrauchte Ware im gesetzlich zulässigen Rahmen ausschließen; das gilt nicht bei Vorsatz oder arglistigem Verschweigen von Mängeln.",
        "Verkäufer:innen, die gewerblich handeln, müssen dies dem Betreiber vor dem ersten Angebot mitteilen. Sie sind für ihre gesetzlichen Pflichten (insbesondere Informationspflichten, Widerrufsbelehrung und Gewährleistung gegenüber Verbrauchern) selbst verantwortlich. Der Betreiber kann dafür zusätzliche Angaben verlangen.",
      ],
    },
    {
      id: "gebuehren",
      h: "§ 8 Gebühren",
      p: [
        "Die Nutzung von TastySoxx ist für Käufer:innen und Verkäufer:innen derzeit kostenlos. Führt der Betreiber Gebühren ein, teilt er dies mindestens 30 Tage vorher per E-Mail mit. Sie gelten nur für künftige Verkäufe, und du kannst dein Konto bis dahin kostenlos löschen.",
      ],
    },
    {
      id: "meldungen",
      h: "§ 9 Meldungen, Moderation und Sperrungen",
      p: [
        "Rechtswidrige oder gegen diese AGB verstoßende Inhalte kann jede Person, auch ohne Konto, über das Formular unter „Melden“ oder über die unten genannte E-Mail-Adresse melden. Der Betreiber prüft Meldungen zeitnah und in der Regel innerhalb von 24 Stunden.",
        "Mögliche Maßnahmen sind das Ausblenden oder Entfernen von Angeboten, eine Verwarnung und die vorübergehende oder dauerhafte Sperrung des Kontos. Bei Verdacht auf Minderjährige oder Straftaten sperrt der Betreiber sofort und informiert gegebenenfalls Behörden. Entscheidungen trifft eine Person; es gibt keine rein automatisierten Entscheidungen.",
        "Betroffene erhalten eine Begründung, soweit rechtlich zulässig und ohne Gefährdung von Ermittlungen. Wer mit einer Maßnahme nicht einverstanden ist, kann sich per E-Mail an die unten genannte Adresse wenden; der Betreiber prüft die Entscheidung erneut.",
        `Zentrale Kontaktstelle für Nutzer:innen und Behörden: ${l.email}.`,
      ],
    },
    {
      id: "inhalte",
      h: "§ 10 Nutzerinhalte",
      p: [
        "Die Rechte an hochgeladenen Fotos und Texten bleiben bei dir. Du räumst dem Betreiber das einfache, nicht übertragbare Recht ein, diese Inhalte für die Dauer der Nutzung zu speichern und auf der Plattform anzuzeigen. Du versicherst, dass du die erforderlichen Rechte hast und keine Rechte Dritter verletzt werden. Machen Dritte deswegen Ansprüche geltend, stellst du den Betreiber im gesetzlichen Umfang frei.",
      ],
    },
    {
      id: "haftung",
      h: "§ 11 Haftung",
      p: [
        "Der Betreiber haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper und Gesundheit sowie nach dem Produkthaftungsgesetz. Bei leichter Fahrlässigkeit haftet er nur für die Verletzung wesentlicher Vertragspflichten und begrenzt auf den vorhersehbaren, vertragstypischen Schaden.",
        "Für Inhalte der Nutzer:innen und für Verträge zwischen Nutzer:innen haftet der Betreiber nicht; er wird nach Kenntnis rechtswidriger Inhalte unverzüglich tätig (§ 9).",
      ],
    },
    {
      id: "laufzeit",
      h: "§ 12 Laufzeit, Kündigung und Löschung",
      p: [
        "Du kannst dein Konto jederzeit selbst unter „Konto“ → „Konto löschen“ löschen, sofern keine offenen Bestellungen bestehen. Dabei werden Profil, Angebote und Chats gelöscht; abgeschlossene Bestellungen und Bewertungen bleiben ohne Personenbezug erhalten (Einzelheiten in der Datenschutzerklärung).",
        "Der Betreiber kann den Nutzungsvertrag mit einer Frist von 14 Tagen kündigen. Das Recht zur Sperrung und fristlosen Kündigung aus wichtigem Grund, insbesondere bei Verstößen nach § 5, bleibt unberührt. Offene Bestellungen werden nach Möglichkeit noch abgewickelt.",
      ],
    },
    {
      id: "aenderungen",
      h: "§ 13 Änderungen dieser AGB",
      p: [
        "Der Betreiber kann diese AGB mit Wirkung für die Zukunft ändern, wenn dafür ein sachlicher Grund besteht (z. B. neue Funktionen, Gesetzesänderungen). Er informiert angemeldete Nutzer:innen mindestens 30 Tage vorher per E-Mail. Die Änderung gilt als angenommen, wenn du nicht innerhalb dieser Frist widersprichst; auf diese Folge weist der Betreiber in der Mitteilung hin. Bei Widerspruch kann der Betreiber den Vertrag zum Änderungstermin kündigen.",
      ],
    },
    {
      id: "streit",
      h: "§ 14 Streitbeilegung",
      p: [
        "Der Betreiber ist nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
      ],
    },
    {
      id: "schluss",
      h: "§ 15 Schlussbestimmungen",
      p: [
        `Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Zwingende Verbraucherschutzvorschriften des Staates, in dem du lebst, bleiben unberührt. Gerichtsstand ist, soweit zulässig (insbesondere bei Kaufleuten), ${l.court}.`,
        "Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen unberührt.",
        `Stand: ${STAND}.`,
      ],
    },
  ];
}

export default async function TermsPage() {
  const { t } = await getT(info);
  const l = getLegal();
  const sections = buildSections(l);
  const all = sections.flatMap((s) => [s.h, ...(s.p ?? []), ...(s.ul ?? []), ...(s.after ?? [])]).join(" ");
  return (
    <article className="wrap grid max-w-2xl gap-6 py-10">
      <h1 className="text-4xl font-extrabold">{t("legal.termsTitle")}</h1>
      {hasPlaceholders(all) && <LegalNotice>{t("legal.notice")}</LegalNotice>}

      <nav aria-label="Inhalt" className="card p-4 text-sm">
        <ol className="grid gap-1 sm:grid-cols-2">
          {sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="text-muted hover:text-accent">{s.h}</a></li>)}
        </ol>
      </nav>

      {sections.map((s) => (
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
        Rechtswidrige Inhalte melden: <Link href="/melden" className="font-semibold text-accent underline">Formular „Melden“</Link>.
        Datenschutz: <Link href="/datenschutz" className="font-semibold text-accent underline">Datenschutzerklärung</Link>.
      </p>
    </article>
  );
}
