"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { Logo } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { useT } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import type { Profile } from "@/lib/types";

const NAV = [
  { href: "/shop", key: "nav.shop" },
  { href: "/verkaeufer", key: "nav.sellers" },
  { href: "/faq", key: "nav.faq" },
  { href: "/kontakt", key: "nav.contact" },
] as const;

export function Header({ profile }: { profile: Profile | null }) {
  const { items } = useCart();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const t = useT(common);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="wrap flex h-16 items-center gap-3">
        <button className="grid size-10 place-items-center rounded-full border border-line bg-surface md:hidden" aria-label={t("nav.menu")} onClick={() => setOpen(!open)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <Logo />
        <nav className="ml-2 hidden gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 font-medium text-muted hover:bg-surface-2 hover:text-fg">{t(n.key)}</Link>
          ))}
        </nav>
        <form
          className="ml-auto flex h-10 min-w-0 max-w-sm flex-1 items-center gap-2 rounded-full border border-line bg-surface px-3.5"
          onSubmit={(e) => { e.preventDefault(); router.push(`/shop?q=${encodeURIComponent(q.trim())}`); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
          <input id="header-search" value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder={t("nav.search")} className="w-full min-w-0 bg-transparent outline-none" aria-label={t("nav.searchLabel")} />
        </form>
        <LanguageSwitch className="hidden sm:inline-flex" />
        <Link href={profile ? "/konto" : "/anmelden"} className="hidden size-10 place-items-center rounded-full border border-line bg-surface sm:grid" aria-label={profile ? t("nav.account") : t("nav.login")}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
        </Link>
        <Link href="/warenkorb" className="relative grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface" aria-label={t("nav.cart")}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 7h14l-1.2 12.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
          {items.length > 0 && (
            <span className="absolute -right-1 -top-1 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-fg">{items.length}</span>
          )}
        </Link>
      </div>
      {open && (
        <nav className="wrap grid border-t border-line py-2 md:hidden" onClick={() => setOpen(false)}>
          {NAV.map((n) => <Link key={n.href} href={n.href} className="py-2.5 font-medium">{t(n.key)}</Link>)}
          <Link href={profile ? "/konto" : "/anmelden"} className="py-2.5 font-medium">{profile ? t("nav.account") : t("nav.login")}</Link>
          {profile?.role === "seller" && <Link href="/dashboard" className="py-2.5 font-medium">{t("nav.dashboard")}</Link>}
          {profile && <Link href="/nachrichten" className="py-2.5 font-medium">{t("nav.messages")}</Link>}
          <div className="py-2.5" onClick={(e) => e.stopPropagation()}><LanguageSwitch /></div>
        </nav>
      )}
    </header>
  );
}
