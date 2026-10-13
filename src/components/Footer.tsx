import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="wrap grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Link href="/" className="font-display text-2xl font-extrabold">Tasty<span className="text-accent">Soxx</span></Link>
          <p className="mt-2 max-w-[36ch] text-sm text-muted">Der diskrete Marktplatz für getragene Socken. Nur für Erwachsene ab 18 Jahren.</p>
        </div>
        <div>
          <h4 className="eyebrow mb-3">Shop</h4>
          <ul className="grid gap-1.5 text-sm">
            {CATEGORIES.map((c) => <li key={c.id}><Link href={`/shop?kat=${c.id}`} className="hover:text-accent">{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-3">Info</h4>
          <ul className="grid gap-1.5 text-sm">
            <li><Link href="/faq" className="hover:text-accent">FAQ</Link></li>
            <li><Link href="/verkaufen" className="hover:text-accent">Verkaufen</Link></li>
            <li><Link href="/kontakt" className="hover:text-accent">Kontakt</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-3">Rechtliches</h4>
          <ul className="grid gap-1.5 text-sm">
            <li><Link href="/impressum" className="hover:text-accent">Impressum</Link></li>
            <li><Link href="/agb" className="hover:text-accent">AGB</Link></li>
            <li><Link href="/datenschutz" className="hover:text-accent">Datenschutz</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap flex flex-wrap justify-between gap-3 border-t border-line py-4 text-sm text-muted">
        <span>© {new Date().getFullYear()} TastySoxx</span>
        <span>18+ · Diskreter Versand · Käuferschutz</span>
      </div>
    </footer>
  );
}
