import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verkaufen",
  description: "Getragene Socken auf TastySoxx verkaufen: Profil anlegen, verifizieren, Artikel einstellen. Nur ab 18.",
};

const WHY = [
  { t: "Kaufbereite Kundschaft", d: "Wer hier sucht, will kaufen. Kein Feilschen in Kommentarspalten." },
  { t: "Du bestimmst", d: "Preis, Tragedauer, was du zeigst und mit wem du schreibst – alles deine Entscheidung." },
  { t: "Anonym bleiben", d: "Nutze einen Fantasienamen. Deine Adresse sieht niemand, solange du sie nicht selbst teilst." },
];

const STEPS = [
  { t: "Profil anlegen", d: "Registrieren, als Verkäuferin wählen und Alter (18+) bestätigen." },
  { t: "Verifizieren", d: "Lass dein Profil prüfen und erhalte das blaue Häkchen. Verifizierte Profile verkaufen spürbar mehr." },
  { t: "Artikel einstellen", d: "Bis zu 6 Fotos, Material, Tragedauer und Preis – fertig in wenigen Minuten." },
  { t: "Verkaufen", d: "Bestellung kommt rein, du schickst Zahlungsdetails im Chat, bestätigst die Zahlung und versendest." },
];

const TIPS = [
  "Keine Gesichter, Tattoos oder erkennbaren Hintergründe auf den Fotos.",
  "Verwende als Absender eine Packstation oder einen neutralen Absender.",
  "Gib keine privaten Kontaktdaten (Telefon, Social Media) im Chat heraus.",
  "Versende erst, wenn die Zahlung wirklich eingegangen ist.",
  "Melde auffällige Nachrichten sofort über Kontakt.",
];

export default function SellPage() {
  return (
    <div className="wrap grid gap-14 py-10">
      <section className="grid max-w-2xl gap-4">
        <p className="eyebrow">Verkaufen auf TastySoxx</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Verdiene mit deinen getragenen Socken – diskret und sicher.</h1>
        <p className="text-lg text-muted">Kostenlos starten. Du zahlst nur, wenn du verkaufst.</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/registrieren" className="btn-primary">Jetzt als Verkäuferin starten</Link>
          <Link href="/faq" className="btn-ghost">Fragen &amp; Antworten</Link>
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-2xl font-bold">Warum TastySoxx?</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.t} className="card p-5">
              <h3 className="text-lg font-bold">{w.t}</h3>
              <p className="mt-1 text-sm text-muted">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-2xl font-bold">So funktioniert&apos;s</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="card grid content-start gap-2 p-5">
              <span className="grid size-9 place-items-center rounded-full bg-accent font-display font-bold text-accent-fg">{i + 1}</span>
              <h3 className="text-lg font-bold">{s.t}</h3>
              <p className="text-sm text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="card grid content-start gap-3 p-6">
          <h2 className="text-2xl font-bold">Gebühren</h2>
          <p className="font-display text-4xl font-extrabold text-accent">10 %</p>
          <p className="text-muted">
            Provision auf den Artikelpreis, nur bei erfolgreichem Verkauf. Einstellen ist kostenlos, keine Grundgebühr.
            Die Versandkosten (4,90 €) zahlt die Käuferin bzw. der Käufer.
          </p>
          <p className="rounded-xl bg-accent-soft p-3 text-sm">Aktuelle Konditionen – Änderungen kündigen wir rechtzeitig per E-Mail an.</p>
        </div>
        <div className="card grid content-start gap-3 p-6">
          <h2 className="text-2xl font-bold">Sicherheitstipps</h2>
          <ul className="grid gap-2 text-sm">
            {TIPS.map((t) => (
              <li key={t} className="flex gap-2"><span className="text-ok" aria-hidden>✓</span><span>{t}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card grid justify-items-start gap-3 bg-accent-soft p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Bereit?</h2>
        <p className="max-w-xl text-muted">Profil in zwei Minuten anlegen. Verkaufen ist nur für volljährige Personen ab 18 Jahren erlaubt.</p>
        <Link href="/registrieren" className="btn-primary">Kostenlos registrieren</Link>
      </section>
    </div>
  );
}
