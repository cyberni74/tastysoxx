import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

function Notice() {
  return (
    <p className="rounded-xl border border-accent bg-accent-soft p-3 text-sm font-semibold">
      Platzhalter – vor dem Livegang rechtlich prüfen lassen. Alle Angaben in [eckigen Klammern] müssen ersetzt werden.
    </p>
  );
}

export default function ImprintPage() {
  return (
    <article className="wrap grid max-w-2xl gap-6 py-10 [&_h2]:mt-2 [&_h2]:text-xl [&_h2]:font-bold [&_p]:text-muted">
      <h1 className="text-4xl font-extrabold">Impressum</h1>
      <Notice />
      <section className="grid gap-2">
        <h2>Angaben gemäß § 5 DDG</h2>
        <p>[Firmenname]<br />[Rechtsform, z. B. UG (haftungsbeschränkt)]<br />[Straße Hausnummer]<br />[PLZ Ort]<br />[Land]</p>
      </section>
      <section className="grid gap-2">
        <h2>Vertreten durch</h2>
        <p>[Vorname Nachname], Geschäftsführung</p>
      </section>
      <section className="grid gap-2">
        <h2>Kontakt</h2>
        <p>E-Mail: support@tastysoxx.com<br />Telefon: [Telefonnummer]</p>
      </section>
      <section className="grid gap-2">
        <h2>Registereintrag</h2>
        <p>Registergericht: [Amtsgericht]<br />Registernummer: [HRB-Nummer]</p>
      </section>
      <section className="grid gap-2">
        <h2>Umsatzsteuer-ID</h2>
        <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [USt-IdNr.]</p>
      </section>
      <section className="grid gap-2">
        <h2>Verantwortlich für den Inhalt</h2>
        <p>[Vorname Nachname], [Anschrift]</p>
      </section>
      <section className="grid gap-2">
        <h2>Jugendschutz</h2>
        <p>Dieses Angebot richtet sich ausschließlich an Personen ab 18 Jahren. Jugendschutzbeauftragte:r: [Name, Kontakt]</p>
      </section>
      <section className="grid gap-2">
        <h2>Streitbeilegung</h2>
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. [Bitte prüfen]</p>
      </section>
    </article>
  );
}
