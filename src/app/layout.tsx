import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { ConsentBanner } from "@/components/ConsentBanner";
import { getSession } from "@/lib/supabase/server";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", weight: ["500", "700", "800"] });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const metadata: Metadata = {
  title: { default: "TastySoxx – Getragene Socken diskret kaufen & verkaufen", template: "%s · TastySoxx" },
  description: "Marktplatz für getragene Socken: verifizierte Verkäuferinnen, diskreter Versand, Käuferschutz. Nur ab 18.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tastysoxx.com"),
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getSession();
  return (
    <html lang="de" className={`${bricolage.variable} ${figtree.variable}`}>
      <body className="min-h-dvh antialiased">
        <CartProvider>
          <Header profile={profile} />
          <main>{children}</main>
          <Footer />
          <ConsentBanner />
        </CartProvider>
      </body>
    </html>
  );
}
