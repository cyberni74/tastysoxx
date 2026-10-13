import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return pageMeta({ title: t("meta.imprint"), path: "/impressum" });
}

/** Each section: heading + lines (rendered with line breaks). */
type Section = { h: string; lines: string[] };

const DE: Section[] = [
  { h: "Angaben gemäß § 5 DDG", lines: ["[Firmenname]", "[Rechtsform, z. B. UG (haftungsbeschränkt)]", "[Straße Hausnummer]", "[PLZ Ort]", "[Land]"] },
  { h: "Vertreten durch", lines: ["[Vorname Nachname], Geschäftsführung"] },
  { h: "Kontakt", lines: ["E-Mail: support@tastysoxx.com", "Telefon: [Telefonnummer]"] },
  { h: "Registereintrag", lines: ["Registergericht: [Amtsgericht]", "Registernummer: [HRB-Nummer]"] },
  { h: "Umsatzsteuer-ID", lines: ["Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [USt-IdNr.]"] },
  { h: "Verantwortlich für den Inhalt", lines: ["[Vorname Nachname], [Anschrift]"] },
  { h: "Jugendschutz", lines: ["Dieses Angebot richtet sich ausschließlich an Personen ab 18 Jahren. Jugendschutzbeauftragte:r: [Name, Kontakt]"] },
  { h: "Streitbeilegung", lines: ["Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. [Bitte prüfen]"] },
];

const EN: Section[] = [
  { h: "Information pursuant to § 5 DDG (German Digital Services Act)", lines: ["[Company name]", "[Legal form, e.g. UG (haftungsbeschränkt)]", "[Street and number]", "[Postcode City]", "[Country]"] },
  { h: "Represented by", lines: ["[First name Last name], Managing Director"] },
  { h: "Contact", lines: ["Email: support@tastysoxx.com", "Phone: [Phone number]"] },
  { h: "Commercial register", lines: ["Register court: [Local court]", "Registration number: [HRB number]"] },
  { h: "VAT ID", lines: ["VAT identification number pursuant to § 27a UStG: [VAT ID]"] },
  { h: "Responsible for content", lines: ["[First name Last name], [Address]"] },
  { h: "Protection of minors", lines: ["This service is intended exclusively for persons aged 18 and over. Youth protection officer: [Name, contact]"] },
  { h: "Dispute resolution", lines: ["We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board. [Please check]"] },
];

export default async function ImprintPage() {
  const { t, locale } = await getT(info);
  const sections = locale === "en" ? EN : DE;
  return (
    <article className="wrap grid max-w-2xl gap-6 py-10">
      <h1 className="text-4xl font-extrabold">{t("legal.imprintTitle")}</h1>
      <p className="rounded-xl border border-accent bg-accent-soft p-3 text-sm font-semibold">{t("legal.notice")}</p>
      {locale === "en" && <p className="text-sm font-semibold">{t("legal.binding")}</p>}
      {sections.map((s) => (
        <section key={s.h} className="grid gap-2">
          <h2 className="text-xl font-bold">{s.h}</h2>
          <p className="text-muted">
            {s.lines.map((l, i) => <span key={l}>{i > 0 && <br />}{l}</span>)}
          </p>
        </section>
      ))}
    </article>
  );
}
