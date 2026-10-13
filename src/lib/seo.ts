import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tastysoxx.com").replace(/\/$/, "");

/**
 * Page metadata with a canonical URL. Pages whose URL carries filter, sort, search or
 * pagination params pass `noindex: true` so only the clean category URLs get indexed.
 */
export function pageMeta({ title, description, path, noindex = false, absoluteTitle = false }: {
  title: string; description?: string; path: string; noindex?: boolean; absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title, description, url: path, siteName: "TastySoxx", type: "website" },
  };
}

/** True when any query param is present that should keep the URL out of the index. */
export const hasParams = (sp: Record<string, string | string[] | undefined>) =>
  Object.values(sp).some((v) => v !== undefined && v !== "");
