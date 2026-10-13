import type { Metadata } from "next";
import { SetupNotice } from "@/components/Bits";
import { report } from "@/i18n/messages/report";
import { getT } from "@/i18n/server";
import { pageMeta } from "@/lib/seo";
import { getSession } from "@/lib/supabase/server";
import { ReportForm, type ReportTarget } from "./ReportForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(report);
  return pageMeta({ title: t("meta.title"), description: t("meta.desc"), path: "/melden", noindex: true });
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const USERNAME = /^[A-Za-z0-9_.-]{3,24}$/;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function ReportPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const { t } = await getT(report);
  const { supabase } = await getSession();

  const artikel = one(sp.artikel);
  const profil = one(sp.profil);
  let target: ReportTarget = null;
  let notFound = false;

  if (supabase && UUID.test(artikel)) {
    const { data } = await supabase
      .from("listings").select("id, title, seller:profiles!listings_seller_id_fkey(username)").eq("id", artikel).maybeSingle();
    if (data) {
      const seller = data.seller as unknown as { username: string } | null;
      target = { kind: "listing", id: data.id as string, title: data.title as string, seller: seller?.username ?? null };
    } else notFound = true;
  } else if (supabase && USERNAME.test(profil)) {
    const { data } = await supabase.from("profiles").select("username").eq("username", profil).maybeSingle();
    if (data) target = { kind: "profile", username: data.username as string };
    else notFound = true;
  } else if (artikel || profil) {
    notFound = true;
  }

  return (
    <div className="wrap max-w-xl py-10 sm:py-14">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{t("title")}</h1>
      <p className="mt-2 text-muted">{t("lead")}</p>

      {notFound && supabase && (
        <p role="alert" className="mt-5 rounded-xl border border-danger/40 p-3 text-sm text-danger">{t("target.notFound")}</p>
      )}

      <div className="card mt-6 p-5 sm:p-6">
        {supabase ? <ReportForm target={target} /> : <SetupNotice />}
      </div>

      <p className="mt-6 rounded-2xl border border-line p-4 text-sm text-muted">
        <strong className="text-fg">⚠</strong> {t("emergency")}
      </p>
    </div>
  );
}
