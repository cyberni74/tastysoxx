"use client";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { CATEGORIES, MATERIALS } from "@/lib/constants";
import type { Listing } from "@/lib/types";
import type { FormState } from "./actions";

const MAX_IMAGES = 6;
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const BUCKET = "listing-images";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

export function ListingForm({ action, userId, listing }: { action: Action; userId: string; listing?: Listing }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [images, setImages] = useState<string[]>(listing?.images ?? []);
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fresh = useRef(new Set<string>()); // uploaded in this session → safe to delete on remove
  const fileInput = useRef<HTMLInputElement>(null);

  async function onFiles(files: FileList | null) {
    setUploadError(null);
    if (!files?.length) return;
    const supabase = getBrowserClient();
    if (!supabase) { setUploadError("Upload nicht möglich: Datenbank nicht verbunden."); return; }

    const room = MAX_IMAGES - images.length;
    const list = Array.from(files);
    if (list.length > room) setUploadError(`Höchstens ${MAX_IMAGES} Bilder – ${list.length - Math.max(room, 0)} wurden ignoriert.`);
    const accepted = list.slice(0, Math.max(room, 0));

    for (const file of accepted) {
      const ext = TYPES[file.type];
      if (!ext) { setUploadError(`${file.name}: nur JPG, PNG oder WebP.`); continue; }
      if (file.size > MAX_BYTES) { setUploadError(`${file.name}: größer als 5 MB.`); continue; }
      setUploading((n) => n + 1);
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000" });
      setUploading((n) => n - 1);
      if (error) { setUploadError(`${file.name}: Upload fehlgeschlagen.`); continue; }
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
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <section className="card grid gap-3 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold">Fotos</h2>
          <span className="text-sm text-muted">{images.length}/{MAX_IMAGES}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {images.map((url, i) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Foto ${i + 1}`} className="size-full object-cover" />
              {i === 0 && <span className="absolute left-1 top-1 rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold">Titelbild</span>}
              <button type="button" onClick={() => remove(url)} aria-label={`Foto ${i + 1} entfernen`}
                className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-fg/80 text-sm font-bold text-bg">×</button>
              <div className="absolute inset-x-1 bottom-1 flex justify-between">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Nach vorne"
                  className="grid size-7 place-items-center rounded-full bg-surface/90 text-sm disabled:invisible">←</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label="Nach hinten"
                  className="grid size-7 place-items-center rounded-full bg-surface/90 text-sm disabled:invisible">→</button>
              </div>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-line text-center text-sm text-muted hover:border-accent">
              <span>{uploading ? "Lädt…" : <>＋<br />Foto</>}</span>
              <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only"
                onChange={(e) => void onFiles(e.target.files)} disabled={uploading > 0} />
            </label>
          )}
        </div>
        <p className="text-xs text-muted">JPG, PNG oder WebP, max. 5 MB pro Bild. Das erste Bild ist das Titelbild. Keine Gesichter oder persönlichen Daten zeigen.</p>
        {uploadError && <p className="text-sm font-semibold text-danger" role="alert">{uploadError}</p>}
      </section>

      <section className="card grid gap-4 p-4 sm:p-5">
        <h2 className="text-lg font-bold">Details</h2>
        <label className="label">
          Titel
          <input name="title" className="input" required minLength={3} maxLength={80} defaultValue={listing?.title}
            placeholder="z. B. Weiße Sneakersocken nach dem Training" />
        </label>
        <label className="label">
          Beschreibung
          <textarea name="description" className="input min-h-32" maxLength={2000} defaultValue={listing?.description}
            placeholder="Wie wurden sie getragen? Besonderheiten? Extras auf Wunsch?" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label">
            Kategorie
            <select name="category" className="input" required defaultValue={listing?.category ?? ""}>
              <option value="" disabled>Bitte wählen</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="label">
            Material
            <select name="material" className="input" required defaultValue={listing?.material ?? ""}>
              <option value="" disabled>Bitte wählen</option>
              {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label className="label">
            Tragedauer (Tage)
            <input name="wear_days" type="number" inputMode="numeric" min={1} max={30} step={1} required className="input"
              defaultValue={listing?.wear_days ?? 1} />
          </label>
          <label className="label">
            Preis in €
            <input name="price" inputMode="decimal" required className="input" defaultValue={defaultPrice}
              placeholder="12,50" />
            <span className="text-xs font-normal text-muted">5,00 € bis 500,00 €. Versand (4,90 €) zahlt die Käuferin bzw. der Käufer.</span>
          </label>
        </div>
      </section>

      {state.error && <p className="rounded-xl bg-surface-2 p-3 text-sm font-semibold text-danger" role="alert">{state.error}</p>}

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary" disabled={pending || uploading > 0}>
          {pending ? "Speichert…" : listing ? "Änderungen speichern" : "Artikel einstellen"}
        </button>
        <Link href="/dashboard" className="btn-ghost">Abbrechen</Link>
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
  const [toggleState, toggleAction, togglePending] = useActionState(toggle, {});
  const [removeState, removeAction, removePending] = useActionState(remove, {});
  const error = toggleState.error ?? removeState.error;

  return (
    <section className="card grid gap-3 p-4 sm:p-5">
      <h2 className="text-lg font-bold">Sichtbarkeit</h2>
      <p className="text-sm text-muted">
        {status === "active"
          ? "Der Artikel ist im Shop sichtbar. Ausgeblendete Artikel sieht nur du."
          : "Der Artikel ist ausgeblendet und im Shop nicht sichtbar."}
      </p>
      <div className="flex flex-wrap gap-2">
        <form action={toggleAction}>
          <button className="btn-ghost btn-sm" disabled={togglePending}>
            {status === "active" ? "Ausblenden" : "Wieder anzeigen"}
          </button>
        </form>
        <form action={removeAction} onSubmit={(e) => { if (!confirm("Artikel endgültig löschen?")) e.preventDefault(); }}>
          <button className="btn-ghost btn-sm text-danger" disabled={removePending}>Löschen</button>
        </form>
      </div>
      {error && <p className="text-sm font-semibold text-danger" role="alert">{error}</p>}
    </section>
  );
}
