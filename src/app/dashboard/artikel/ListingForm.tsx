"use client";
import Link from "next/link";
import { startTransition, useActionState, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { COLORS, CONDITIONS, DEPARTMENTS, MATERIALS, SIZE_HINTS, categoriesOf } from "@/lib/constants";
import type { Department, Listing } from "@/lib/types";
import type { FormState } from "./actions";
import { useT } from "@/i18n/client";
import { seller } from "@/i18n/messages/seller";
import { common } from "@/i18n/messages/common";

const MAX_IMAGES = 6;
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const BUCKET = "listing-images";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

export function ListingForm({ action, userId, listing }: { action: Action; userId: string; listing?: Listing }) {
  const t = useT(seller);
  const tc = useT(common);
  const [state, formAction, pending] = useActionState(action, {});
  const [dept, setDept] = useState<Department | "">(listing?.department ?? "");
  const [category, setCategory] = useState<string>(listing?.category ?? "");
  const sizeRequired = dept === "slips" || dept === "bhs";
  const [images, setImages] = useState<string[]>(listing?.images ?? []);
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fresh = useRef(new Set<string>()); // uploaded in this session → safe to delete on remove
  const fileInput = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList | null) {
    setUploadError(null);
    if (!files?.length) return;
    const supabase = getBrowserClient();
    if (!supabase) { setUploadError(t("up.noDb")); return; }

    const room = MAX_IMAGES - images.length;
    const list = Array.from(files);
    if (list.length > room) setUploadError(t("up.tooMany", { max: MAX_IMAGES, n: list.length - Math.max(room, 0) }));
    const accepted = list.slice(0, Math.max(room, 0));

    for (const file of accepted) {
      const ext = TYPES[file.type];
      if (!ext) { setUploadError(t("up.type", { name: file.name })); continue; }
      if (file.size > MAX_BYTES) { setUploadError(t("up.size", { name: file.name })); continue; }
      setUploading((n) => n + 1);
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000" });
      setUploading((n) => n - 1);
      if (error) { setUploadError(t("up.failed", { name: file.name })); continue; }
      const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      fresh.current.add(url);
      setImages((prev) => (prev.length < MAX_IMAGES ? [...prev, url] : prev));
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  function remove(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
    if (fresh.current.has(url)) {
      fresh.current.delete(url);
      const marker = `/object/public/${BUCKET}/`;
      const i = url.indexOf(marker);
      if (i >= 0) void getBrowserClient()?.storage.from(BUCKET).remove([url.slice(i + marker.length)]);
    }
  }

  function move(i: number, dir: -1 | 1) {
    setImages((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  const defaultPrice = listing ? (listing.price_cents / 100).toFixed(2).replace(".", ",") : "";

  return (
    <form className="grid gap-5"
      onSubmit={(e) => {
        // submit manually so React doesn't reset the fields when validation fails
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}>
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <section className="card grid gap-3 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold">{t("form.photos")}</h2>
          <span className="text-sm text-muted">{images.length}/{MAX_IMAGES}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {images.map((url, i) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={t("form.photoAlt", { n: i + 1 })} className="size-full object-cover" />
              {i === 0 && <span className="absolute left-1 top-1 rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold">{t("form.cover")}</span>}
              <button type="button" onClick={() => remove(url)} aria-label={t("form.removePhoto", { n: i + 1 })}
                className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-fg/80 text-sm font-bold text-bg">×</button>
              <div className="absolute inset-x-1 bottom-1 flex justify-between">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={t("form.moveLeft")}
                  className="grid size-7 place-items-center rounded-full bg-surface/90 text-sm disabled:invisible">←</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label={t("form.moveRight")}
                  className="grid size-7 place-items-center rounded-full bg-surface/90 text-sm disabled:invisible">→</button>
              </div>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-line text-center text-sm text-muted hover:border-accent">
              <span>{uploading ? t("form.uploading") : <>＋<br />{t("form.addPhoto")}</>}</span>
              <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only"
                onChange={(e) => void onFiles(e.target.files)} disabled={uploading > 0} />
            </label>
          )}
        </div>
        <p className="text-xs text-muted">{t("form.photoHint")}</p>
        {uploadError && <p className="text-sm font-semibold text-danger" role="alert">{uploadError}</p>}
      </section>

      <section className="card grid gap-4 p-4 sm:p-5">
        <h2 className="text-lg font-bold">{t("form.details")}</h2>
        <label className="label">
          {t("form.title")}
          <input name="title" className="input" required minLength={3} maxLength={80} defaultValue={listing?.title}
            placeholder={t("form.titlePh")} />
        </label>
        <label className="label">
          {t("form.desc")}
          <textarea name="description" className="input min-h-32" maxLength={2000} defaultValue={listing?.description}
            placeholder={t("form.descPh")} />
        </label>
        <fieldset className="grid gap-2">
          <legend className="mb-1 text-sm font-semibold">{t("form.department")}</legend>
          <input type="hidden" name="department" value={dept} />
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t("form.department")}>
            {DEPARTMENTS.map((d) => (
              <button key={d.id} type="button" role="radio" aria-checked={dept === d.id}
                onClick={() => { if (dept !== d.id) { setDept(d.id); setCategory(""); } }}
                className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${dept === d.id ? "border-accent bg-accent-soft text-fg" : "border-line bg-surface hover:border-accent"}`}>
                {tc(`deptShort.${d.id}`)}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label">
            {t("form.category")}
            <select name="category" className="input" required disabled={!dept} value={category}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="" disabled>{dept ? t("form.choose") : t("form.chooseDeptFirst")}</option>
              {dept && categoriesOf(dept).map((c) => <option key={c.id} value={c.id}>{tc(`cat.${c.id}`)}</option>)}
            </select>
          </label>
          <label className="label">
            {sizeRequired ? tc("size") : `${tc("size")} ${t("form.optional")}`}
            <input name="size" className="input" maxLength={12} required={sizeRequired} defaultValue={listing?.size ?? ""}
              placeholder={dept ? t("form.sizePh", { hint: SIZE_HINTS[dept] }) : ""} />
          </label>
          <label className="label">
            {tc("material")}
            <select name="material" className="input" required defaultValue={listing?.material ?? ""}>
              <option value="" disabled>{t("form.choose")}</option>
              {MATERIALS.map((m) => <option key={m} value={m}>{tc(`mat.${m}`)}</option>)}
            </select>
          </label>
          <label className="label">
            {`${tc("color")} ${t("form.optional")}`}
            <select name="color" className="input" defaultValue={listing?.color ?? ""}>
              <option value="">{t("form.colorNone")}</option>
              {COLORS.map((c) => <option key={c} value={c}>{tc(`color.${c}`)}</option>)}
            </select>
          </label>
          <label className="label">
            {tc("condition")}
            <select name="condition" className="input" required defaultValue={listing?.condition ?? "normal"}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{tc(`cond.${c}`)}</option>)}
            </select>
          </label>
          <label className="label">
            {t("form.wearDays")}
            <input name="wear_days" type="number" inputMode="numeric" min={1} max={30} step={1} required className="input"
              defaultValue={listing?.wear_days ?? 1} />
          </label>
          <label className="label">
            {t("form.price")}
            <input name="price" inputMode="decimal" required className="input" defaultValue={defaultPrice}
              placeholder="12,50" />
            <span className="text-xs font-normal text-muted">{t("form.priceHint")}</span>
          </label>
        </div>
      </section>

      {state.error && <p className="rounded-xl bg-surface-2 p-3 text-sm font-semibold text-danger" role="alert">{state.error}</p>}

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary" disabled={pending || uploading > 0}>
          {pending ? t("form.saving") : listing ? t("form.save") : t("form.create")}
        </button>
        <Link href="/dashboard" className="btn-ghost">{t("form.cancel")}</Link>
      </div>
    </form>
  );
}

/** Hide/show + delete controls for the edit page. */
export function ListingControls({ status, toggle, remove }: {
  status: "active" | "hidden";
  toggle: (prev: FormState, formData: FormData) => Promise<FormState>;
  remove: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const t = useT(seller);
  const [toggleState, toggleAction, togglePending] = useActionState(toggle, {});
  const [removeState, removeAction, removePending] = useActionState(remove, {});
  const error = toggleState.error ?? removeState.error;

  return (
    <section className="card grid gap-3 p-4 sm:p-5">
      <h2 className="text-lg font-bold">{t("ctl.title")}</h2>
      <p className="text-sm text-muted">
        {status === "active"
          ? t("ctl.activeText")
          : t("ctl.hiddenText")}
      </p>
      <div className="flex flex-wrap gap-2">
        <form action={toggleAction}>
          <button className="btn-ghost btn-sm" disabled={togglePending}>
            {status === "active" ? t("ctl.hide") : t("ctl.show")}
          </button>
        </form>
        <form action={removeAction} onSubmit={(e) => { if (!confirm(t("ctl.confirmDelete"))) e.preventDefault(); }}>
          <button className="btn-ghost btn-sm text-danger" disabled={removePending}>{t("ctl.delete")}</button>
        </form>
      </div>
      {error && <p className="text-sm font-semibold text-danger" role="alert">{error}</p>}
    </section>
  );
}
