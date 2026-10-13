import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { Avatar, Empty, Flag, SetupNotice, VerifiedBadge } from "@/components/Bits";
import { setVerified } from "./actions";
import { getT } from "@/i18n/server";
import { seller } from "@/i18n/messages/seller";
import { INTL } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT(seller);
  return { title: t("meta.admin"), robots: { index: false } };
}
export const dynamic = "force-dynamic";


export default async function AdminPage() {
  const { supabase, profile } = await getSession();
  if (!supabase) return <div className="wrap py-10"><SetupNotice /></div>;
  if (!profile?.is_admin) notFound();
  const { t, locale } = await getT(seller);
  const dateFmt = new Intl.DateTimeFormat(INTL[locale], { dateStyle: "medium", timeZone: "Europe/Berlin" });

  const { data } = await supabase
    .from("profiles").select("*").eq("role", "seller")
    .order("verified", { ascending: true }).order("created_at", { ascending: false });
  const sellers = (data ?? []) as Profile[];
  const open = sellers.filter((s) => !s.verified).length;

  return (
    <div className="wrap grid max-w-3xl gap-5 py-8">
      <div>
        <p className="eyebrow">{t("admin.eyebrow")}</p>
        <h1 className="text-3xl font-extrabold">{t("admin.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("admin.summary", { n: sellers.length, open })}</p>
      </div>
      {sellers.length === 0 ? (
        <Empty>{t("admin.empty")}</Empty>
      ) : (
        <ul className="card divide-y divide-line overflow-hidden">
          {sellers.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-3 p-3.5">
              <Avatar url={s.avatar_url} name={s.username} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Link href={`/verkaeufer/${s.username}`} className="truncate hover:text-accent">{s.username}</Link>
                  {s.verified && <VerifiedBadge />}<Flag country={s.country} />
                </div>
                <div className="text-xs text-muted">{t("admin.since", { d: dateFmt.format(new Date(s.created_at)) })}</div>
              </div>
              <form action={setVerified.bind(null, s.id, !s.verified)}>
                <button className={s.verified ? "btn-ghost btn-sm" : "btn-primary btn-sm"}>
                  {s.verified ? t("admin.unverify") : t("admin.verify")}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
