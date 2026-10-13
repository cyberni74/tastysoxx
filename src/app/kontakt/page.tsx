import type { Metadata } from "next";
import Link from "next/link";
import { CopyEmail } from "./CopyEmail";

export const metadata: Metadata = { title: "Kontakt" };

export default function ContactPage() {
  return (
    <div className="wrap grid max-w-2xl gap-6 py-10">
      <div>
        <p className="eyebrow">Support</p>
        <h1 className="text-4xl font-extrabold">Kontakt</h1>
        <p className="mt-2 text-muted">Fragen, Probleme mit einer Bestellung oder Verifizierung? Schreib uns eine E-Mail.</p>
      </div>
      <div className="card grid gap-3 p-5 sm:p-6">
        <h2 className="text-lg font-bold">E-Mail</h2>
        <CopyEmail email="support@tastysoxx.com" />
      </div>
      <div className="card grid gap-2 p-5 text-sm sm:p-6">
        <h2 className="text-lg font-bold">Gut zu wissen</h2>
        <ul className="grid list-disc gap-1.5 pl-5 text-muted">
          <li>Wir antworten in der Regel innerhalb von 24 Stunden, am Wochenende kann es etwas länger dauern.</li>
          <li>Bei Fragen zu einer Bestellung gib bitte die Bestellnummer (z. B. TS-1A2B3C4D) an.</li>
          <li>Für die Verifizierung schreib uns von der E-Mail-Adresse, mit der du registriert bist, und nenne deinen Benutzernamen.</li>
          <li>Schick uns keine Passwörter oder Bankdaten per E-Mail.</li>
        </ul>
        <p className="mt-2 text-muted">Viele Antworten findest du schon in den <Link href="/faq" className="font-semibold text-accent underline">FAQ</Link>.</p>
      </div>
    </div>
  );
}
