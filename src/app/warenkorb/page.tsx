import type { Metadata } from "next";
import { account } from "@/i18n/messages/account";
import { getT } from "@/i18n/server";
import { CartView } from "./CartView";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(account);
  return { title: t("cart.meta"), robots: { index: false } };
}

export default async function CartPage() {
  const { t } = await getT(account);
  return (
    <div className="wrap py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t("cart.title")}</h1>
      <p className="mb-6 mt-2 text-muted">{t("cart.lead")}</p>
      <CartView />
    </div>
  );
}
