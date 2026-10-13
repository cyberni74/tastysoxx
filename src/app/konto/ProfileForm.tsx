"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { Avatar } from "@/components/Bits";
import { useT } from "@/i18n/client";
import { account } from "@/i18n/messages/account";
import { common } from "@/i18n/messages/common";
import { AGE_RANGES, BUILDS, COUNTRIES } from "@/lib/constants";
import { getBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { saveAvatar, updateProfile, type ProfileState } from "./actions";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_BYTES = 2 * 1024 * 1024;

export function ProfileForm({ profile }: { profile: Profile }) {
  const t = useT(account);
  const tc = useT(common);
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, {});
  const [avatar, setAvatar] = useState(profile.avatar_url);
  const [avatarMsg, setAvatarMsg] = useState<{ error?: string; ok?: string }>({});
  const [uploading, startUpload] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const isSeller = profile.role === "seller";

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const ext = TYPES[file.type];
    if (!ext) return setAvatarMsg({ error: t("profile.errType") });
    if (file.size > MAX_BYTES) return setAvatarMsg({ error: t("profile.errSize") });
    const supabase = getBrowserClient();
    if (!supabase) return setAvatarMsg({ error: t("err.unavailable") });

    setAvatarMsg({});
    startUpload(async () => {
      const path = `${profile.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { contentType: file.type, upsert: false });
      if (error) return setAvatarMsg({ error: t("profile.errUpload") });
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const res = await saveAvatar(data.publicUrl);
      if (res.error) return setAvatarMsg(res);
      setAvatar(data.publicUrl);
      setAvatarMsg(res);
    });
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar url={avatar} name={profile.username} size={72} />
        <div className="grid gap-1">
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} aria-label={t("profile.avatarPick")} />
          <button type="button" className="btn-ghost btn-sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? t("profile.avatarUploading") : t("profile.avatarChange")}
          </button>
          <span className="text-xs text-muted">{t("profile.avatarHint")}</span>
        </div>
        {avatarMsg.error && <p role="alert" className="w-full text-sm font-medium text-danger">{avatarMsg.error}</p>}
        {avatarMsg.ok && <p role="status" className="w-full text-sm font-medium text-ok">{avatarMsg.ok}</p>}
      </div>

      <form action={action} className="grid gap-4">
        <label className="label">
          {t("profile.bio")}
          <textarea name="bio" defaultValue={profile.bio} maxLength={600} rows={4} className="input resize-y"
            placeholder={isSeller ? t("profile.bioSeller") : t("profile.optional")} />
        </label>
        <label className="label">
          {t("profile.country")}
          <select name="country" defaultValue={profile.country} className="input">
            {Object.entries(COUNTRIES).map(([code, flag]) => (
              <option key={code} value={code}>{flag} {t(`country.${code}` as `country.DE`)}</option>
            ))}
          </select>
        </label>

        {isSeller && (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="label">
              {t("profile.age")}
              <select name="age_range" defaultValue={profile.age_range ?? ""} className="input">
                <option value="">{t("profile.none")}</option>
                {AGE_RANGES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <label className="label">
              {t("profile.build")}
              <select name="build" defaultValue={profile.build ?? ""} className="input">
                <option value="">{t("profile.none")}</option>
                {BUILDS.map((b) => <option key={b} value={b}>{tc(`build.${b}`)}</option>)}
              </select>
            </label>
            <label className="label">
              {t("profile.shoe")}
              <input name="shoe_size" defaultValue={profile.shoe_size ?? ""} maxLength={5} inputMode="decimal" className="input" placeholder={t("profile.shoePh")} />
            </label>
          </div>
        )}

        {state.error && <p role="alert" className="text-sm font-medium text-danger">{state.error}</p>}
        {state.ok && <p role="status" className="text-sm font-medium text-ok">{state.ok}</p>}
        <div>
          <button className="btn-primary" disabled={pending}>{pending ? t("profile.saving") : t("profile.save")}</button>
        </div>
      </form>
    </div>
  );
}
