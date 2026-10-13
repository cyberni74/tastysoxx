import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return pageMeta({ title: t("meta.terms"), path: "/agb" });
}

const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: "§ 1 Geltungsbereich",
    p: [
      "Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung des Marktplatzes TastySoxx, betrieben von [Firmenname], [Anschrift] (nachfolgend „Betreiber“).",
      "TastySoxx stellt eine Plattform bereit, auf der Verkäuferinnen getragene Socken, Slips und BHs anbieten und Käufer:innen diese erwerben können. Kaufverträge kommen ausschließlich zwischen Käufer:in und Verkäuferin zustande. Der Betreiber ist nicht Vertragspartei.",
    ],
  },
  {
    h: "§ 2 Registrierung und Mindestalter",
    p: [
      "Die Nutzung ist nur volljährigen Personen ab 18 Jahren gestattet. Bei der Registrierung ist das Alter zu bestätigen. Der Betreiber kann jederzeit einen Altersnachweis verlangen und Konten bei Zweifeln sperren.",
      "Jede Person darf nur ein Konto führen. Zugangsdaten sind geheim zu halten.",
    ],
  },
  {
    h: "§ 3 Angebote (Socken, Slips, BHs)",
    p: [
      "Angeboten werden dürfen getragene Socken und Strümpfe, Slips und Unterwäsche sowie BHs, Sport-BHs und Bralettes.",
      "Jedes Angebot muss wahrheitsgemäß enthalten: Bereich und Kategorie, Material, Tragedauer in Tagen, Zustand, Preis und mindestens ein Foto des angebotenen Produkts. Bei Slips und BHs ist die Größe Pflicht (z. B. M / 38 bzw. 75B), bei Socken empfohlen.",
      "Verkäuferinnen sind für die Richtigkeit ihrer Angaben selbst verantwortlich. Verboten sind insbesondere jeder Bezug zu Minderjährigen, Fotos mit Gesicht, explizite oder pornografische Inhalte, gesundheitsgefährdende Zusätze sowie Angebote, die gegen geltendes Recht verstoßen. Einzelheiten regeln die Angebotsregeln unter /hilfe/angebotsregeln.",
      "Der Betreiber kann Angebote ohne Angabe von Gründen entfernen und Konten bei Verstößen sperren.",
    ],
  },
  {
    h: "§ 4 Bestellung und Bezahlung",
    p: [
      "Mit Absenden einer Bestellung gibt die Käuferin bzw. der Käufer ein verbindliches Angebot ab; die Artikel werden reserviert.",
      "Die Bezahlung wird nicht über den Betreiber abgewickelt. Die Verkäuferin übermittelt ihre Zahlungsdetails im Chat; gezahlt wird direkt an die Verkäuferin. Der Betreiber bietet keine Treuhand- oder Erstattungsleistung an.",
      "Solange eine Bestellung nicht als bezahlt bestätigt ist, kann sie von beiden Seiten storniert werden; die Artikel werden dann wieder freigegeben.",
    ],
  },
  {
    h: "§ 5 Versand",
    p: [
      "Die Verkäuferin versendet nach Zahlungseingang in neutraler Verpackung. Die Versandkostenpauschale beträgt [4,90 €] je Verkäuferin.",
    ],
  },
  {
    h: "§ 6 Gebühren für Verkäuferinnen",
    p: [
      "Für erfolgreiche Verkäufe fällt eine Provision von derzeit [10 %] des Artikelpreises an. Einzelheiten zur Abrechnung: [Abrechnungsmodalitäten].",
    ],
  },
  {
    h: "§ 7 Probleme und Meldungen",
    p: [
      "Bei Problemen mit einer Bestellung können sich Nutzer:innen an support@tastysoxx.com wenden. Der Betreiber kann vermitteln und Konten sperren, ist jedoch nicht zur Erstattung von Zahlungen verpflichtet.",
    ],
  },
  {
    h: "§ 8 Haftung",
    p: [
      "Der Betreiber haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Im Übrigen ist die Haftung auf vorhersehbare, vertragstypische Schäden begrenzt. [Haftungsregelung rechtlich prüfen]",
    ],
  },
  {
    h: "§ 9 Kündigung und Sperrung",
    p: [
      "Nutzer:innen können ihr Konto jederzeit löschen lassen. Der Betreiber kann Konten bei Verstößen gegen diese AGB sperren.",
    ],
  },
  {
    h: "§ 10 Schlussbestimmungen",
    p: [
      "Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit zulässig, [Ort]. Stand: [Datum].",
    ],
  },
];

export default async function TermsPage() {
  const { t } = await getT(info);
  const sections = SECTIONS;
  return (
    <article className="wrap grid max-w-2xl gap-6 py-10">
      <h1 className="text-4xl font-extrabold">{t("legal.termsTitle")}</h1>
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
