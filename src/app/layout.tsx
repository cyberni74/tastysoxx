import type { Metadata, Viewport } from "next";
import { Figtree, Fredoka } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { ConsentBanner } from "@/components/ConsentBanner";
import { getSession } from "@/lib/supabase/server";
import { LocaleProvider } from "@/i18n/client";
import { getLocale } from "@/i18n/server";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["500", "600", "700"] });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export async function generateMetadata(): Promise<Metadata> {
  const en = (await getLocale()) === "en";
  return {
    title: {
      default: en ? "Buy worn socks, panties & bras | TastySoxx" : "Getragene Socken, Slips & BHs kaufen | TastySoxx",
      template: "%s | TastySoxx",
    },
    description: en
      ? "Marketplace for worn socks, panties and bras: verified sellers, private chat, neutral packaging. Adults 18+ only."
      : "Marktplatz für getragene Socken, Slips und BHs: verifizierte Verkäuferinnen, privater Chat, neutrale Verpackung. Nur ab 18.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tastysoxx.com"),
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = { themeColor: "#08080c", colorScheme: "dark" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ profile }, locale] = await Promise.all([getSession(), getLocale()]);
  return (
    <html lang={locale} className={`${fredoka.variable} ${figtree.variable}`}>
      <body className="min-h-dvh antialiased">
        <LocaleProvider locale={locale}>
        <CartProvider>
          <Header profile={profile} />
          <main>{children}</main>
          <Footer />
          <ConsentBanner />
        </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
