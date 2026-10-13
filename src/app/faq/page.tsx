import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/i18n/server";
import { info } from "@/i18n/messages/info";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(info);
  return { title: t("meta.faq"), description: t("meta.faqDesc") };
}

const FAQ_DE: { q: string; a: React.ReactNode }[] = [
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

const FAQ_EN: { q: string; a: React.ReactNode }[] = [
  {
    q: "What does the blue check mark mean?",
    a: "The blue check mark shows that we have reviewed the seller's profile. It confirms that a real adult is behind the profile. Profiles without a check mark aren't automatically dodgy – they just haven't been reviewed yet.",
  },
  {
    q: "How does payment work?",
    a: "Once you place an order, the item is reserved for you. The seller sends you her payment details in the chat. When the money arrives, she confirms the payment and ships. Never pay outside of an order and don't share bank details unprompted.",
  },
  {
    q: "How is it shipped?",
    a: "Discreetly, in a plain envelope with no hint of what's inside. Shipping is a flat €4.90 per seller. Once the parcel is on its way, your order shows the status “Shipped”.",
  },
  {
    q: "What if something goes wrong?",
    a: <>TastySoxx doesn’t handle payments itself – you pay the seller directly. As long as your order hasn’t been paid, you can cancel it at any time. If there’s a problem after that, message the seller in the chat first and get in touch with us via <Link href="/kontakt" className="font-semibold text-accent underline">Contact</Link> – we look into it and block profiles that don’t deliver. Reviews from other buyers show you beforehand how reliable a seller is.</>,
  },
  {
    q: "How can I sell?",
    a: <>Sign up as a seller, get your profile verified and list your items. Everything else is on the <Link href="/verkaufen" className="font-semibold text-accent underline">Sell</Link> page.</>,
  },
  {
    q: "Why 18+ only?",
    a: "TastySoxx is for adults only. When you sign up, you confirm that you are at least 18 years old. We block profiles immediately if there's any doubt.",
  },
  {
    q: "Do I stay anonymous? What happens to my data?",
    a: <>You only appear under your username. Your shipping address is only visible to the seller of your order. We don’t sell data and only use strictly necessary cookies. Details in our <Link href="/datenschutz" className="font-semibold text-accent underline">privacy policy</Link>.</>,
  },
];

export default async function FaqPage() {
  const { t, locale } = await getT(info);
  const FAQ = locale === "en" ? FAQ_EN : FAQ_DE;
  return (
    <div className="wrap grid max-w-2xl gap-6 py-10">
      <div>
        <p className="eyebrow">{t("faq.eyebrow")}</p>
        <h1 className="text-4xl font-extrabold">{t("faq.title")}</h1>
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
        {t("faq.more")} <Link href="/kontakt" className="font-semibold text-accent underline">{t("faq.moreLink")}</Link>.
      </p>
    </div>
  );
}
