import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { pageMeta } from "@/lib/seo";
import { Guide, type GuideSection, type QA } from "../_Guide";

const PATH = "/hilfe/kaufen-und-verkaufen";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return pageMeta({ title: t("guide.buySell"), description: t("meta.guideBuySellDesc"), path: PATH });
}

const DE: { intro: string; sections: GuideSection[]; faq: QA[] } = {
  intro: "TastySoxx bringt Verkäuferinnen und Käufer:innen von getragenen Socken, Slips und BHs zusammen. Der Kaufvertrag entsteht direkt zwischen euch beiden – wir stellen den Marktplatz, den Chat und die Bestellübersicht bereit.",
  sections: [
    {
      h: "Kaufen in fünf Schritten",
      body: (
        <ol className="grid list-decimal gap-1.5 pl-5 text-muted">
          <li>Angebot finden – nach Bereich, Kategorie, Größe oder Tragedauer filtern.</li>
          <li>Fragen klären – im Chat mit der Verkäuferin, bevor du bestellst.</li>
          <li>Bestellen – Lieferadresse angeben. Der Artikel ist ab jetzt für dich reserviert.</li>
          <li>Bezahlen – die Verkäuferin schickt dir ihre Zahlungsdetails im Chat, du zahlst direkt an sie.</li>
          <li>Erhalten – nach dem Versand siehst du den Status „Versendet“. Bestätige den Erhalt und gib eine Bewertung ab. Reagierst du nicht, gilt der Erhalt 14 Tage nach Versand automatisch als bestätigt.</li>
        </ol>
      ),
    },
    {
      h: "Verkaufen in vier Schritten",
      body: (
        <>
          <p>Profil als Verkäuferin anlegen, verifizieren lassen, Angebot mit Größe, Material, Tragedauer und Zustand einstellen, Bestellungen im Dashboard bearbeiten. Details und Preisorientierung je Produkt findest du unter <Link href="/verkaufen">Verkaufen</Link>.</p>
        </>
      ),
    },
    {
      h: "Bestellstatus erklärt",
      body: (
        <ul>
          <li><b>Wartet auf Zahlung</b> – bestellt und reserviert. Beide Seiten können noch stornieren.</li>
          <li><b>Bezahlt</b> – die Verkäuferin hat den Zahlungseingang bestätigt.</li>
          <li><b>Versendet</b> – das Paket ist unterwegs.</li>
          <li><b>Abgeschlossen</b> – du hast den Erhalt bestätigt (oder 14 Tage sind seit dem Versand vergangen); jetzt kannst du bewerten.</li>
          <li><b>Storniert</b> – die Bestellung wurde abgebrochen, der Artikel ist wieder verfügbar.</li>
        </ul>
      ),
    },
    {
      h: "Bewertungen und blaues Häkchen",
      body: (
        <p>Nach einer abgeschlossenen Bestellung kannst du die Verkäuferin mit 1–5 Sternen bewerten. Bewertungen und das blaue Häkchen für geprüfte Profile helfen dir einzuschätzen, wie zuverlässig jemand ist. Mehr zur Verifizierung steht in den <Link href="/hilfe/angebotsregeln">Angebotsregeln</Link>.</p>
      ),
    },
  ],
  faq: [
    { q: "Was bedeutet das blaue Häkchen?", a: "Das blaue Häkchen zeigt, dass wir das Profil der Verkäuferin geprüft haben und eine echte, volljährige Person dahintersteht. Profile ohne Häkchen sind nicht automatisch unseriös – sie sind nur noch nicht geprüft." },
    { q: "Wie läuft die Bezahlung ab?", a: "Nach deiner Bestellung ist der Artikel für dich reserviert. Die Verkäuferin schickt dir ihre Zahlungsdetails im Chat, du zahlst direkt an sie. Sobald das Geld angekommen ist, bestätigt sie die Zahlung und versendet. TastySoxx wickelt keine Zahlungen ab." },
    { q: "Was passiert, wenn etwas schiefgeht?", a: "Solange deine Bestellung nicht bezahlt ist, kannst du sie jederzeit stornieren. Gibt es danach Probleme, schreib zuerst der Verkäuferin im Chat und melde dich dann bei uns über Kontakt. Wir prüfen den Fall und sperren Profile, die nicht liefern – eine Erstattung können wir nicht garantieren, weil das Geld direkt an die Verkäuferin geht." },
    { q: "Wie kann ich verkaufen?", a: "Registriere dich als Verkäuferin, lass dein Profil verifizieren und stelle deine Artikel ein. Alles Weitere steht auf der Seite Verkaufen." },
    { q: "Warum erst ab 18?", a: "TastySoxx ist ausschließlich für Erwachsene. Bei der Registrierung bestätigst du, dass du mindestens 18 Jahre alt bist. Profile, bei denen Zweifel bestehen, sperren wir sofort." },
  ],
};

export default async function BuySellGuide() {
  const { t } = await getT(info);
  const c = DE;
  return (
    <Guide eyebrow={t("help.guide")} title={t("guide.buySell")} intro={c.intro} sections={c.sections}
      faqTitle={t("help.faqTitle")} faq={c.faq} back={{ href: "/hilfe", label: t("help.back") }}
      related={[
        { href: "/hilfe/versand-zahlung-privatsphaere", label: t("guide.ship") },
        { href: "/hilfe/angebotsregeln", label: t("guide.rules") },
      ]} />
  );
}
