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

const SECTIONS_EN: { h: string; p: string[] }[] = [
  {
    h: "§ 1 Scope",
    p: [
      "These terms and conditions apply to the use of the TastySoxx marketplace, operated by [Company name], [Address] (the “Operator”).",
      "TastySoxx provides a platform on which sellers offer worn socks, panties and bras and buyers can purchase them. Purchase contracts are concluded exclusively between buyer and seller. The Operator is not a party to these contracts.",
    ],
  },
  {
    h: "§ 2 Registration and minimum age",
    p: [
      "Use is permitted only for adults aged 18 and over. Users must confirm their age when signing up. The Operator may request proof of age at any time and block accounts if in doubt.",
      "Each person may only have one account. Login details must be kept secret.",
    ],
  },
  {
    h: "§ 3 Listings (socks, panties, bras)",
    p: [
      "Worn socks and stockings, panties and underwear, and bras, sports bras and bralettes may be listed.",
      "Every listing must truthfully state: department and category, material, days worn, condition, price and at least one photo of the actual product. Size is required for panties and bras (e.g. M / 38 or 75B) and recommended for socks.",
      "Sellers are responsible for the accuracy of their information. Prohibited in particular are any reference to minors, photos showing faces, explicit or pornographic content, anything hazardous to health and listings that violate applicable law. Details are set out in the listing rules at /hilfe/angebotsregeln.",
      "The Operator may remove listings without giving reasons and block accounts for violations.",
    ],
  },
  {
    h: "§ 4 Orders and payment",
    p: [
      "By submitting an order, the buyer makes a binding offer; the items are reserved.",
      "Payment is not processed by the Operator. The seller sends her payment details in the chat; payment is made directly to the seller. The Operator does not offer escrow or refund services.",
      "As long as an order has not been confirmed as paid, either party can cancel it; the items then become available again.",
    ],
  },
  {
    h: "§ 5 Shipping",
    p: [
      "The seller ships in neutral packaging after receiving payment. The flat shipping fee is [€4.90] per seller.",
    ],
  },
  {
    h: "§ 6 Fees for sellers",
    p: [
      "A commission of currently [10 %] of the item price is charged for successful sales. Billing details: [billing terms].",
    ],
  },
  {
    h: "§ 7 Problems and reports",
    p: [
      "If there are problems with an order, users can contact support@tastysoxx.com. The Operator may mediate and block accounts, but is not obliged to refund payments.",
    ],
  },
  {
    h: "§ 8 Liability",
    p: [
      "The Operator is liable without limitation for intent and gross negligence. Otherwise, liability is limited to foreseeable damage typical for the contract. [Have liability clause reviewed]",
    ],
  },
  {
    h: "§ 9 Termination and blocking",
    p: [
      "Users can have their account deleted at any time. The Operator may block accounts that violate these terms.",
    ],
  },
  {
    h: "§ 10 Final provisions",
    p: [
      "The law of the Federal Republic of Germany applies. Place of jurisdiction, where permitted, is [City]. Last updated: [Date].",
    ],
  },
];

export default async function TermsPage() {
  const { t, locale } = await getT(info);
  const sections = locale === "en" ? SECTIONS_EN : SECTIONS;
  return (
    <article className="wrap grid max-w-2xl gap-6 py-10">
      <h1 className="text-4xl font-extrabold">{t("legal.termsTitle")}</h1>
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
