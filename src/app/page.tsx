import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/supabase/server";
import { fetchListings, fetchStats } from "@/lib/queries";
import { CATEGORIES } from "@/lib/constants";
import type { ListingWithSeller, Profile, SellerStats } from "@/lib/types";
import { ListingCard } from "@/components/ListingCard";
import { SellerCard } from "@/components/SellerCard";
import { Empty, SetupNotice, Swatch } from "@/components/Bits";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "TastySoxx – Getragene Socken diskret kaufen & verkaufen" },
};

const FEATURES = [
  {
    title: "Diskrete Abwicklung",
    text: "Deine Adresse sieht nur die Verkäuferin deiner Bestellung. Ein Alias auf dem Paket reicht.",
    icon: <path d="M3 7h18v10H3zM3 11h18M7 15h3" />,
  },
  {
    title: "Unauffälliger Versand",
    text: "Neutrale Verpackung ohne Hinweis auf den Inhalt.",
    icon: <path d="M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8" />,
  },
  {
    title: "Geprüfte Profile",
    text: "Das blaue Häkchen zeigt Verkäuferinnen, die Alter und Identität bestätigt haben.",
    icon: <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5" />,
  },
  {
    title: "Keine Anmeldegebühren",
    text: "Registrieren und Stöbern kostet nichts.",
    icon: <path d="M12 3v18M17 7.5c-.8-1.5-2.6-2.5-5-2.5-2.8 0-4.5 1.4-4.5 3.3 0 4.4 10 2.2 10 6.9 0 2-1.9 3.3-5 3.3-2.6 0-4.5-1.1-5.3-2.7" />,
  },
];

const STEPS = [
  { title: "Stöbern", text: "Filtere nach Kategorie, Tragedauer und verifizierten Verkäuferinnen." },
  { title: "Chatten", text: "Stell Fragen oder äußere Wünsche direkt im privaten Chat." },
  { title: "Bezahlen", text: "Die Verkäuferin schickt dir die Zahlungsdetails im Chat. Bis dahin ist der Artikel reserviert." },
  { title: "Versand", text: "Die Verkäuferin verschickt diskret verpackt an deine Adresse." },
  { title: "Bewerten", text: "Nach Erhalt bewertest du die Verkäuferin und hilfst anderen beim Kauf." },
];

async function loadHome() {
  const { supabase } = await getSession();
  if (!supabase) return null;
  try {
    const [listings, sellersRes] = await Promise.all([
      fetchListings(supabase, {}, 8),
      supabase.from("profiles").select("*").eq("role", "seller").order("last_active", { ascending: false }).limit(4),
    ]);
    const sellers = (sellersRes.data ?? []) as Profile[];
    const stats = await fetchStats(supabase, sellers.map((s) => s.id));
    return { listings, sellers, stats };
  } catch {
    return { listings: [] as ListingWithSeller[], sellers: [] as Profile[], stats: new Map<string, SellerStats>() };
  }
}

export default async function Home() {
  const data = await loadHome();

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="wrap grid items-center gap-10 py-12 md:grid-cols-[1.15fr_1fr] md:py-20">
        <div className="flex flex-col gap-5">
          <p className="eyebrow">Marktplatz für getragene Socken</p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Getragene Socken <span className="text-accent">diskret</span> kaufen &amp; verkaufen
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Verifizierte Verkäuferinnen, diskreter Versand und Bewertungen nach jedem Kauf.
            Du chattest direkt mit der Verkäuferin, deine Daten bleiben privat. Nur für Erwachsene ab 18.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">Kaufen</Link>
            <Link href="/verkaufen" className="btn-ghost">Verkaufen</Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div aria-hidden className="pointer-events-none absolute -left-6 top-1/4 size-48 rounded-full bg-blue/40 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -right-6 top-1/3 size-48 rounded-full bg-accent/40 blur-3xl" />
          <Image src="/brand/logo-768.webp" alt="TastySoxx Logo: zwei Socken in Blau und Pink" width={768} height={512} priority className="relative h-auto w-full max-w-full rounded-3xl" />
        </div>
      </section>

      {/* Feature strip */}
      <section aria-label="Vorteile" className="border-y border-line bg-surface">
        <ul className="wrap grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <li key={f.title} className="flex gap-3">
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${i % 2 ? "bg-blue/15 text-blue" : "bg-accent-soft text-accent"}`}>
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {f.icon}
                </svg>
              </span>
              <div>
                <h2 className="font-sans text-base font-semibold">{f.title}</h2>
                <p className="text-sm text-muted">{f.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Promo band */}
      <section className="wrap pt-12">
        <div className="flex flex-col items-start gap-4 rounded-3xl bg-accent px-6 py-8 text-accent-fg sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Direkt mit Verkäuferinnen chatten</h2>
            <p className="mt-1 opacity-85">Sonderwünsche, Tragedauer, Fragen: Kläre alles persönlich vor dem Kauf.</p>
          </div>
          <Link href="/verkaeufer" className="btn shrink-0 bg-accent-fg text-accent hover:opacity-90">Verkäuferinnen ansehen</Link>
        </div>
      </section>

      {/* Categories */}
      <section className="wrap pt-12" aria-labelledby="kat-h">
        <h2 id="kat-h" className="mb-5 text-2xl font-bold sm:text-3xl">Kategorien</h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link href={`/shop?kat=${c.id}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl">
                <Swatch hue={c.hue} className="absolute inset-0 transition group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8 font-display text-lg font-bold text-white">
                  {c.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* New listings */}
      <section className="wrap pt-12" aria-labelledby="neu-h">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 id="neu-h" className="text-2xl font-bold sm:text-3xl">Neue Angebote</h2>
          <Link href="/shop" className="text-sm font-semibold text-accent hover:underline">Alle Angebote →</Link>
        </div>
        {!data ? <SetupNotice /> : data.listings.length === 0 ? (
          <Empty>Noch keine Angebote online. Schau bald wieder vorbei.</Empty>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {data.listings.map((l) => <ListingCard key={l.id} l={l} />)}
          </div>
        )}
      </section>

      {/* Active sellers */}
      <section className="wrap pt-12" aria-labelledby="aktiv-h">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 id="aktiv-h" className="text-2xl font-bold sm:text-3xl">Gerade aktiv</h2>
          <Link href="/verkaeufer" className="text-sm font-semibold text-blue hover:underline">Alle Verkäuferinnen →</Link>
        </div>
        {!data ? <SetupNotice /> : data.sellers.length === 0 ? (
          <Empty>Noch keine Verkäuferinnen registriert.</Empty>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.sellers.map((p) => {
              const s = data.stats.get(p.id);
              return <SellerCard key={p.id} p={p} rating={Number(s?.rating ?? 0)} count={s?.review_count ?? 0} />;
            })}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="wrap pt-12" aria-labelledby="sofunk-h">
        <h2 id="sofunk-h" className="mb-5 text-2xl font-bold sm:text-3xl">So funktioniert&apos;s</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card flex flex-col gap-2 p-5">
              <span className={`grid size-8 place-items-center rounded-full font-display font-bold tabular-nums ${i % 2 ? "bg-blue/15 text-blue" : "bg-accent-soft text-accent"}`}>{i + 1}</span>
              <h3 className="font-sans text-base font-semibold">{s.title}</h3>
              <p className="text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
