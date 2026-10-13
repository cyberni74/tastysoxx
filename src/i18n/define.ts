
type Vars = Record<string, string | number>;
export type Dict = Record<string, string>;
export type Messages<D extends Dict> = { de: D };

export function defineMessages<D extends Dict>(m: Messages<D>): Messages<D> {
  return m;
}

export type T<D extends Dict> = (key: keyof D & string, vars?: Vars) => string;

export function translator<D extends Dict>(m: Messages<D>): T<D> {
  const dict = m.de as Dict;
  return (key, vars) => {
    let s = dict[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}
