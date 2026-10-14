/** Draft notice on the legal pages; the page only renders it while placeholders remain. */
export function LegalNotice({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-accent bg-accent-soft p-3 text-sm font-semibold">{children}</p>;
}
