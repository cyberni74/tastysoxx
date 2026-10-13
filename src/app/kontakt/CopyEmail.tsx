"use client";
import { useState } from "react";
import { useT } from "@/i18n/client";
import { info } from "@/i18n/messages/info";

export function CopyEmail({ email }: { email: string }) {
  const t = useT(info);
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
        {copied ? t("contact.copied") : t("contact.copy")}
      </button>
    </div>
  );
}
