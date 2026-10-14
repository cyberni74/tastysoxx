import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { pageMeta } from "@/lib/seo";
import { getLegal, hasPlaceholders } from "@/lib/legal";
import { LegalNotice } from "@/components/LegalNotice";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return pageMeta({ title: t("meta.imprint"), path: "/impressum" });
}

/** Each section: heading + lines (rendered with line breaks). Optional fields set to "-" are left out. */
type Section = { h: string; lines: string[] };

function buildSections(l: ReturnType<typeof getLegal>): Section[] {
  const sections: (Section | null)[] = [
    { h: "Angaben gemäß § 5 DDG", lines: [l.company, ...(l.legalForm ? [l.legalForm] : []), l.street, l.zipCity, l.country] },
    l.representative ? { h: "Vertreten durch", lines: [l.representative] } : null,
    { h: "Kontakt", lines: [`E-Mail: ${l.email}`, ...(l.phone ? [`Telefon: ${l.phone}`] : [])] },
    l.registerCourt || l.registerNumber
      ? { h: "Registereintrag", lines: [...(l.registerCourt ? [`Registergericht: ${l.registerCourt}`] : []), ...(l.registerNumber ? [`Registernummer: ${l.registerNumber}`] : [])] }
      : null,
    l.vatId ? { h: "Umsatzsteuer-ID", lines: [`Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: ${l.vatId}`] } : null,
    { h: "Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)", lines: [l.company, l.street, l.zipCity] },
    {
      h: "Jugendschutz",
      lines: ["Dieses Angebot richtet sich ausschließlich an Personen ab 18 Jahren.", ...(l.youthOfficer ? [`Jugendschutzbeauftragte:r: ${l.youthOfficer}`] : [])],
    },
    { h: "Streitbeilegung", lines: ["Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."] },
  ];
  return sections.filter((s): s is Section => s !== null);
}

export default async function ImprintPage() {
  const { t } = await getT(info);
  const sections = buildSections(getLegal());
  const all = sections.flatMap((s) => s.lines).join(" ");
  return (
    <article className="wrap grid max-w-2xl gap-6 py-10">
      <h1 className="text-4xl font-extrabold">{t("legal.imprintTitle")}</h1>
      {hasPlaceholders(all) && <LegalNotice>{t("legal.notice")}</LegalNotice>}
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
