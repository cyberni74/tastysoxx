import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "FAQ", description: "Häufige Fragen zu TastySoxx: Verifizierung, Versand, Bezahlung, Sicherheit und mehr." };

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Was bedeutet das blaue Häkchen?",
    a: "Das blaue Häkchen zeigt, dass wir das Profil der Verkäuferin geprüft haben. Es bestätigt, dass hinter dem Profil eine echte, volljährige Person steht. Profile ohne Häkchen sind nicht automatisch unseriös – aber noch nicht geprüft.",
  },
  {
    q: "Wie läuft die Bezahlung ab?",
    a: "Nach deiner Bestellung ist der Artikel für dich reserviert. Die Verkäuferin schickt dir ihre Zahlungsdetails im Chat. Sobald das Geld angekommen ist, bestätigt sie die Zahlung und versendet. Zahle nie außerhalb einer Bestellung und teile keine Bankdaten ungefragt.",
  },
  {
    q: "Wie wird versendet?",
    a: "Diskret im neutralen Umschlag ohne Hinweis auf den Inhalt. Der Versand kostet pauschal 4,90 € pro Verkäuferin. Sobald die Ware unterwegs ist, siehst du den Status „Versendet“ in deiner Bestellung.",
  },
  {
    q: "Was passiert, wenn etwas schiefgeht?",
    a: <>TastySoxx wickelt die Zahlung nicht selbst ab – du bezahlst direkt an die Verkäuferin. Solange deine Bestellung noch nicht bezahlt ist, kannst du sie jederzeit stornieren. Gibt es danach Probleme, schreib zuerst der Verkäuferin im Chat und melde dich bei uns über <Link href="/kontakt" className="font-semibold text-accent underline">Kontakt</Link> – wir prüfen den Fall und sperren Profile, die nicht liefern. Die Bewertungen anderer Käufer:innen zeigen dir vorher, wie zuverlässig eine Verkäuferin ist.</>,
  },
  {
    q: "Wie kann ich verkaufen?",
    a: <>Registriere dich als Verkäuferin, lass dein Profil verifizieren und stelle deine Artikel ein. Alles Weitere steht auf <Link href="/verkaufen" className="font-semibold text-accent underline">Verkaufen</Link>.</>,
  },
  {
    q: "Warum erst ab 18?",
    a: "TastySoxx ist ausschließlich für Erwachsene. Bei der Registrierung bestätigst du, dass du mindestens 18 Jahre alt bist. Profile, bei denen Zweifel bestehen, sperren wir sofort.",
  },
  {
    q: "Bleibe ich anonym? Was passiert mit meinen Daten?",
    a: <>Du trittst nur mit deinem Benutzernamen auf. Deine Lieferadresse sieht nur die Verkäuferin deiner Bestellung. Wir verkaufen keine Daten und setzen nur technisch notwendige Cookies. Details in der <Link href="/datenschutz" className="font-semibold text-accent underline">Datenschutzerklärung</Link>.</>,
  },
];

export default function FaqPage() {
  return (
    <div className="wrap grid max-w-2xl gap-6 py-10">
      <div>
        <p className="eyebrow">Hilfe</p>
        <h1 className="text-4xl font-extrabold">Häufige Fragen</h1>
      </div>
      <div className="grid gap-2">
        {FAQ.map((f) => (
          <details key={f.q} className="card group p-4 open:border-accent">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="shrink-0 text-xl text-muted transition group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <div className="mt-2 text-muted">{f.a}</div>
          </details>
        ))}
      </div>
      <p className="text-sm text-muted">
        Deine Frage ist nicht dabei? <Link href="/kontakt" className="font-semibold text-accent underline">Schreib uns</Link>.
      </p>
    </div>
  );
}
