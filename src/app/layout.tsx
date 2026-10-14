import type { Metadata, Viewport } from "next";
import { Figtree, Fredoka } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { ConsentBanner } from "@/components/ConsentBanner";
import { getSession } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { LocaleProvider } from "@/i18n/client";
import { getLocale } from "@/i18n/server";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["500", "600", "700"] });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "Getragene Socken, Slips & BHs kaufen | TastySoxx",
      template: "%s | TastySoxx",
    },
    description: "Marktplatz für getragene Socken, Slips und BHs: verifizierte Verkäuferinnen, privater Chat, neutrale Verpackung. Nur ab 18.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tastysoxx.com"),
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = { themeColor: "#08080c", colorScheme: "dark" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ profile }, locale, jar] = await Promise.all([getSession(), getLocale(), cookies()]);
  // Signed-in users confirmed 18+ at sign-up, so they never see the gate or the notice again.
  const ageConfirmed = !!profile || jar.get("ts-age")?.value === "1";
  const noticeSeen = !!profile || jar.get("ts-cookie")?.value === "1";
  return (
    <html lang={locale} className={`${fredoka.variable} ${figtree.variable}`}>
      <body className="min-h-dvh antialiased">
        <LocaleProvider locale={locale}>
        <CartProvider>
          <Header profile={profile} />
          <main>{children}</main>
          <Footer />
          <ConsentBanner ageConfirmed={ageConfirmed} noticeSeen={noticeSeen} />
        </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
