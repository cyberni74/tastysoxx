"use client";
import { useState } from "react";
import { Swatch } from "@/components/Bits";

export function Gallery({ images, title, hue }: { images: string[]; title: string; hue: number }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <Swatch hue={hue} className="aspect-square w-full rounded-2xl" />;
  const current = images[Math.min(active, images.length - 1)];
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current} alt={title} className="size-full object-cover" />
      </div>
      {images.length > 1 && (
        <ul className="grid grid-cols-6 gap-2">
          {images.map((src, i) => (
            <li key={src + i}>
              <button type="button" onClick={() => setActive(i)} aria-label={`Bild ${i + 1} anzeigen`} aria-pressed={i === active}
                className={`block aspect-square w-full overflow-hidden rounded-lg border-2 ${i === active ? "border-accent" : "border-transparent opacity-80 hover:opacity-100"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="size-full object-cover" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
