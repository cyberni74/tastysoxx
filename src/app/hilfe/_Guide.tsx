import Link from "next/link";

export type QA = { q: string; a: string };
export type GuideSection = { h: string; body: React.ReactNode };

/** Visible FAQ + matching FAQPage JSON-LD (only use where the FAQ is shown on the page). */
export function FaqSection({ title, items }: { title: string; items: QA[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="grid gap-3">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid gap-2">
        {items.map((f) => (
          <details key={f.q} className="card group p-4 open:border-accent">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="shrink-0 text-xl text-muted transition group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="mt-2 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </section>
  );
}

/** Shared layout for the help guides. */
export function Guide({ eyebrow, title, intro, sections, faqTitle, faq, back, related }: {
  eyebrow: string; title: string; intro: React.ReactNode; sections: GuideSection[];
  faqTitle?: string; faq?: QA[]; back: { href: string; label: string }; related?: { href: string; label: string }[];
}) {
  return (
    <article className="wrap grid max-w-3xl gap-8 py-10">
      <div className="grid gap-3">
        <Link href={back.href} className="text-sm text-muted hover:text-accent">{back.label}</Link>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-4xl font-extrabold">{title}</h1>
        <div className="text-lg text-muted">{intro}</div>
      </div>
      {sections.map((s) => (
        <section key={s.h} className="grid gap-2 [&_a]:font-semibold [&_a]:text-accent [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_p]:text-muted [&_ul]:grid [&_ul]:gap-1.5 [&_ul]:text-muted">
          <h2 className="text-2xl font-bold">{s.h}</h2>
          {s.body}
        </section>
      ))}
      {faq && faqTitle && <FaqSection title={faqTitle} items={faq} />}
      {related && related.length > 0 && (
        <nav className="flex flex-wrap gap-2 border-t border-line pt-6">
          {related.map((r) => <Link key={r.href} href={r.href} className="btn-ghost btn-sm">{r.label}</Link>)}
        </nav>
      )}
    </article>
  );
}
