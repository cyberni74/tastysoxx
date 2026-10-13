import type { Metadata } from "next";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Warenkorb", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Warenkorb</h1>
      <p className="mb-6 mt-2 text-muted">Pro Verkäuferin ein Paket – die Versandkosten fallen je Paket an.</p>
      <CartView />
    </div>
  );
}
