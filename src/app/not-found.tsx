import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Seite nicht gefunden" };

export default function NotFound() {
  return (
    <div className="wrap grid max-w-xl justify-items-center gap-4 py-20 text-center">
      <p className="font-display text-7xl font-extrabold text-accent">404</p>
      <h1 className="text-3xl font-extrabold">Diese Seite gibt es nicht</h1>
      <p className="text-muted">Vielleicht wurde der Artikel schon verkauft oder der Link ist falsch. Kein Grund zur Sorge – im Shop wartet genug anderes.</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/shop" className="btn-primary">Zum Shop</Link>
        <Link href="/" className="btn-ghost">Zur Startseite</Link>
      </div>
    </div>
  );
}
