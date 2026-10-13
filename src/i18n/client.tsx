"use client";
import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import { translator, type Dict, type Messages } from "./define";

const LocaleCtx = createContext<Locale>("de");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleCtx.Provider value={locale}>{children}</LocaleCtx.Provider>;
}

export const useLocale = () => useContext(LocaleCtx);

/** Client Components: `const t = useT(messages)`. */
export function useT<D extends Dict>(m: Messages<D>) {
  return useMemo(() => translator(m), [m]);
}
