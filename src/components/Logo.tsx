import Image from "next/image";
import Link from "next/link";

/** App icon + rounded wordmark. */
export function Logo({ size = "md", compact = false }: { size?: "md" | "lg"; compact?: boolean }) {
  const icon = size === "lg" ? 44 : 36;
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="TastySoxx">
      <Image src="/brand/app-icon-96.png" alt="" width={icon} height={icon} priority />
      <span className={`font-display font-bold leading-none tracking-tight ${compact ? "max-[400px]:hidden" : ""} ${size === "lg" ? "text-3xl" : "text-2xl"}`}>
        tasty<span className="text-accent">soxx</span>
      </span>
    </Link>
  );
}
