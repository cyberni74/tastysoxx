"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/i18n/actions";
import { useLocale } from "@/i18n/client";
import { LOCALES } from "@/i18n/config";

export function LanguageSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div role="group" aria-label="Sprache / Language" className={`inline-flex rounded-full border border-line bg-surface p-0.5 text-xs font-semibold ${className}`}>
      {LOCALES.map((l) => (
        <button key={l} type="button" disabled={pending} aria-pressed={l === locale}
          onClick={() => start(async () => { await setLocale(l); router.refresh(); })}
          className={`rounded-full px-2.5 py-1 uppercase ${l === locale ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}
