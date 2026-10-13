"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { Avatar } from "@/components/Bits";
import { AGE_RANGES, BUILDS, COUNTRIES } from "@/lib/constants";
import { getBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { saveAvatar, updateProfile, type ProfileState } from "./actions";

const COUNTRY_NAMES: Record<string, string> = {
  DE: "Deutschland", AT: "Österreich", CH: "Schweiz", NL: "Niederlande", FR: "Frankreich",
  ES: "Spanien", IT: "Italien", PL: "Polen", GB: "Großbritannien", US: "USA",
};
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_BYTES = 2 * 1024 * 1024;

export function ProfileForm({ profile }: { profile: Profile }) {
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
    if (!ext) return setAvatarMsg({ error: "Bitte ein JPG-, PNG- oder WebP-Bild wählen." });
    if (file.size > MAX_BYTES) return setAvatarMsg({ error: "Das Bild ist größer als 2 MB." });
    const supabase = getBrowserClient();
    if (!supabase) return setAvatarMsg({ error: "Upload ist gerade nicht verfügbar." });

    setAvatarMsg({});
    startUpload(async () => {
      const path = `${profile.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { contentType: file.type, upsert: false });
      if (error) return setAvatarMsg({ error: "Upload fehlgeschlagen. Bitte versuche es erneut." });
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
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} aria-label="Profilbild auswählen" />
          <button type="button" className="btn-ghost btn-sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? "Wird hochgeladen…" : "Profilbild ändern"}
          </button>
          <span className="text-xs text-muted">JPG, PNG oder WebP, max. 2 MB</span>
        </div>
        {avatarMsg.error && <p role="alert" className="w-full text-sm font-medium text-danger">{avatarMsg.error}</p>}
        {avatarMsg.ok && <p role="status" className="w-full text-sm font-medium text-ok">{avatarMsg.ok}</p>}
      </div>

      <form action={action} className="grid gap-4">
        <label className="label">
          Über mich
          <textarea name="bio" defaultValue={profile.bio} maxLength={600} rows={4} className="input resize-y"
            placeholder={isSeller ? "Erzähl kurz etwas über dich und deine Socken." : "Optional"} />
        </label>
        <label className="label">
          Land
          <select name="country" defaultValue={profile.country} className="input">
            {Object.entries(COUNTRIES).map(([code, flag]) => (
              <option key={code} value={code}>{flag} {COUNTRY_NAMES[code] ?? code}</option>
            ))}
          </select>
        </label>

        {isSeller && (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="label">
              Alter
              <select name="age_range" defaultValue={profile.age_range ?? ""} className="input">
                <option value="">Keine Angabe</option>
                {AGE_RANGES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <label className="label">
              Figur
              <select name="build" defaultValue={profile.build ?? ""} className="input">
                <option value="">Keine Angabe</option>
                {BUILDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <label className="label">
              Schuhgröße
              <input name="shoe_size" defaultValue={profile.shoe_size ?? ""} maxLength={5} inputMode="decimal" className="input" placeholder="z. B. 38" />
            </label>
          </div>
        )}

        {state.error && <p role="alert" className="text-sm font-medium text-danger">{state.error}</p>}
        {state.ok && <p role="status" className="text-sm font-medium text-ok">{state.ok}</p>}
        <div>
          <button className="btn-primary" disabled={pending}>{pending ? "Wird gespeichert…" : "Profil speichern"}</button>
        </div>
      </form>
    </div>
  );
}
