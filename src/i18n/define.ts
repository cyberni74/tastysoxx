import type { Locale } from "./config";

type Vars = Record<string, string | number>;
export type Dict = Record<string, string>;
/** German is the source of truth; English must provide exactly the same keys. */
export type Messages<D extends Dict> = { de: D; en: { [K in keyof D]: string } };

export function defineMessages<D extends Dict>(m: Messages<D>): Messages<D> {
  return m;
}

export type T<D extends Dict> = (key: keyof D & string, vars?: Vars) => string;

export function translator<D extends Dict>(m: Messages<D>, locale: Locale): T<D> {
  const dict = (m[locale] ?? m.de) as Dict;
  return (key, vars) => {
    let s = dict[key] ?? (m.de as Dict)[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}
