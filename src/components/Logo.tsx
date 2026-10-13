import Link from "next/link";

/** Wordmark only; the sock icon is added once the official icon files arrive. */
export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <Link href="/" className="shrink-0" aria-label="TastySoxx">
      <span className={`font-display font-bold leading-none tracking-tight ${size === "lg" ? "text-3xl" : "text-2xl"}`}>
        tasty<span className="text-accent">soxx</span>
      </span>
    </Link>
  );
}
