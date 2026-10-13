"use client";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="select-all break-all rounded-xl bg-surface-2 px-3 py-2 font-mono text-base">{email}</span>
      <button type="button" onClick={copy} className="btn-ghost btn-sm" aria-live="polite">
        {copied ? "Kopiert ✓" : "Kopieren"}
      </button>
    </div>
  );
}
