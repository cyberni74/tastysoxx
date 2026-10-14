import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getT } from "@/i18n/server";
import { account } from "@/i18n/messages/account";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMeta({ title: "E-Mail bestätigen", path: "/auth/bestaetigen", noindex: true });

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function ConfirmPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const tokenHash = one(sp.token_hash);
  const type = one(sp.type);
  const next = one(sp.next);
  if (!tokenHash || !type) redirect("/anmelden?fehler=1");

  const { t } = await getT(account);
  const kind = type === "recovery" ? "recovery" : type === "email_change" ? "change" : "signup";

  return (
    <div className="wrap max-w-md py-12">
      <p className="eyebrow">{t("confirm.eyebrow")}</p>
      <h1 className="mt-1 text-3xl font-extrabold">{t(`confirm.${kind}.title`)}</h1>
      <p className="mt-2 text-muted">{t(`confirm.${kind}.text`)}</p>
      <form method="post" action="/auth/confirm" className="card mt-6 grid gap-4 p-5">
        <input type="hidden" name="token_hash" value={tokenHash} />
        <input type="hidden" name="type" value={type} />
        <input type="hidden" name="next" value={next} />
        <button type="submit" className="btn-primary">{t(`confirm.${kind}.button`)}</button>
      </form>
    </div>
  );
}
