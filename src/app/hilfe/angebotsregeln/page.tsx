import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { pageMeta } from "@/lib/seo";
import { Guide, type GuideSection } from "../_Guide";

const PATH = "/hilfe/angebotsregeln";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return pageMeta({ title: t("guide.rules"), description: t("meta.guideRulesDesc"), path: PATH });
}

function DeptTable({ head, rows }: { head: [string, string, string]; rows: [string, string, string][] }) {
  return (
    <div className="card overflow-hidden text-sm">
      <div className="grid grid-cols-[6rem_1fr] gap-x-3 border-b border-line bg-surface-2 p-3 font-semibold sm:grid-cols-[8rem_1fr_1fr]">
        <span>{head[0]}</span><span>{head[1]}</span><span className="hidden sm:block">{head[2]}</span>
      </div>
      {rows.map((r) => (
        <div key={r[0]} className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1 border-b border-line p-3 last:border-0 sm:grid-cols-[8rem_1fr_1fr]">
          <b>{r[0]}</b>
          <span className="text-muted">{r[1]}</span>
          <span className="col-start-2 text-muted sm:col-start-auto">{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

const DE: { intro: string; sections: GuideSection[] } = {
  intro: "Damit Käufer:innen wissen, was sie bekommen, und der Marktplatz sicher bleibt, gelten für alle Angebote dieselben Regeln.",
  sections: [
    {
      h: "Pflichtangaben in jedem Angebot",
      body: (
        <>
          <p>Titel, Bereich und Kategorie, Material, Tragedauer in Tagen, Zustand (leichte, normale oder intensive Tragespuren), Preis und mindestens ein aussagekräftiges Foto. Farbe ist freiwillig, aber hilfreich.</p>
          <DeptTable head={["Bereich", "Größe", "Hinweis"]} rows={[
            ["Socken", "Optional, als Schuhgröße, z. B. 38–40", "Art angeben: Sneaker, Sport, Knie, Nylon, Strumpfhose"],
            ["Slips", "Pflicht, z. B. M / 38", "Schnitt: Slip, String oder Hipster"],
            ["BHs", "Pflicht, z. B. 75B (Bralettes auch S/M/L)", "Art: BH, Sport-BH oder Bralette"],
          ]} />
        </>
      ),
    },
    {
      h: "Fotos",
      body: (
        <ul>
          <li>Das Foto zeigt das angebotene Produkt – nicht ein Symbolbild aus dem Netz.</li>
          <li>Keine Gesichter, keine expliziten oder sexualisierten Körperaufnahmen. Bei Socken sind Fotos am Fuß bis Knöchel bzw. Knie erlaubt.</li>
          <li>Keine anderen Personen, keine persönlichen Daten (Briefe, Ausweise, Adressen) im Bild.</li>
        </ul>
      ),
    },
    {
      h: "Verboten",
      body: (
        <ul>
          <li><b>Alles, was Minderjährige betrifft</b> – Angebote von, mit oder mit Anspielung auf Personen unter 18 Jahren (z. B. Schuluniform, „erster BH“). Das melden wir den Behörden.</li>
          <li>Explizite oder pornografische Bilder und Texte.</li>
          <li>Körperflüssigkeiten über normales Tragen hinaus, Blut, Drogen oder gesundheitsgefährdende Zusätze.</li>
          <li>Falsche Angaben zu Größe, Material, Tragedauer oder Zustand; gestohlene Fotos.</li>
          <li>Private Kontaktdaten (Telefon, Messenger, Social Media) in Angeboten oder im Chat, Treffen und Geschäfte außerhalb einer Bestellung.</li>
        </ul>
      ),
    },
    {
      h: "Verifizierung",
      body: (
        <p>Verkäuferinnen können ihr Profil prüfen lassen. Schreib uns dazu über <Link href="/kontakt">Kontakt</Link> von der E-Mail-Adresse, mit der du registriert bist. Wir prüfen, ob eine echte, volljährige Person hinter dem Profil steht, und vergeben dann das blaue Häkchen. Das Häkchen sagt nichts über einzelne Angebote aus – es bestätigt nur das Profil.</p>
      ),
    },
    {
      h: "So bearbeiten wir Meldungen",
      body: (
        <>
          <p>Jede Person kann ein Angebot oder Profil über <Link href="/melden">Melden</Link> melden – auch ohne Konto. Eine Kontakt-E-Mail ist freiwillig und nur nötig, wenn du eine Rückmeldung möchtest.</p>
          <ul>
            <li>Meldungen sieht nur unser Team, nicht die gemeldete Person.</li>
            <li>Verdacht auf Minderjährige oder illegale Inhalte prüfen wir vorrangig und blenden betroffene Angebote sofort aus.</li>
            <li>Alle anderen Meldungen prüfen wir in der Regel innerhalb weniger Tage.</li>
          </ul>
        </>
      ),
    },
    {
      h: "Konsequenzen bei Verstößen",
      body: (
        <ul>
          <li>Hinweis und Bitte um Korrektur des Angebots.</li>
          <li>Ausblenden oder Löschen des Angebots.</li>
          <li>Entzug des blauen Häkchens.</li>
          <li>Vorübergehende oder dauerhafte Sperrung des Kontos.</li>
          <li>Bei strafbaren Inhalten, insbesondere mit Bezug zu Minderjährigen: Meldung an die Behörden.</li>
        </ul>
      ),
    },
  ],
};

export default async function RulesGuide() {
  const { t } = await getT(info);
  const c = DE;
  return (
    <Guide eyebrow={t("help.guide")} title={t("guide.rules")} intro={c.intro} sections={c.sections}
      back={{ href: "/hilfe", label: t("help.back") }}
      related={[
        { href: "/hilfe/kaufen-und-verkaufen", label: t("guide.buySell") },
        { href: "/hilfe/versand-zahlung-privatsphaere", label: t("guide.ship") },
      ]} />
  );
}
