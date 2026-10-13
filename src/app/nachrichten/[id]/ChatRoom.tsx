"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/types";
import { useLocale, useT } from "@/i18n/client";
import { seller } from "@/i18n/messages/seller";
import { INTL } from "@/i18n/config";


function mergeMessage(list: Message[], m: Message): Message[] {
  if (list.some((x) => x.id === m.id)) return list;
  return [...list, m].sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function ChatRoom({ conversationId, meId, initial }: { conversationId: string; meId: string; initial: Message[] }) {
  const t = useT(seller);
  const locale = useLocale();
  const timeFmt = useMemo(
    () => new Intl.DateTimeFormat(INTL[locale], { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" }),
    [locale],
  );
  const [messages, setMessages] = useState<Message[]>(initial);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;
    // Realtime applies RLS, so it needs the user's token before subscribing.
    void supabase.auth.getSession().then(async ({ data }: { data: { session: Session | null } }) => {
      if (cancelled) return;
      if (data.session) await supabase.realtime.setAuth(data.session.access_token);
      channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
          (payload: { new: Message }) => setMessages((prev) => mergeMessage(prev, payload.new)),
        )
        .subscribe();
    });
    return () => {
      cancelled = true;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  async function send() {
    const text = body.trim();
    if (!text || sending) return;
    if (text.length > 2000) { setError(t("chat.tooLong")); return; }
    const supabase = getBrowserClient();
    if (!supabase) { setError(t("act.noDb")); return; }
    setSending(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("messages").insert({ conversation_id: conversationId, sender_id: meId, body: text })
      .select("*").single();
    setSending(false);
    if (err || !data) { setError(t("chat.failed")); return; }
    setBody("");
    setMessages((prev) => mergeMessage(prev, data as Message));
  }

  return (
    <div className="card flex flex-col overflow-hidden">
      <p className="border-b border-line bg-accent-soft px-4 py-2 text-xs">
        {t("chat.safety")}
      </p>
      <div ref={scroller} className="flex h-[58dvh] min-h-72 flex-col gap-2 overflow-y-auto p-3 sm:p-4" aria-live="polite">
        {messages.length === 0 && <p className="m-auto text-sm text-muted">{t("chat.empty")}</p>}
        {messages.map((m) => {
          const mine = m.sender_id === meId;
          return (
            <div key={m.id} className={`flex max-w-[85%] flex-col ${mine ? "self-end items-end" : "self-start items-start"}`}>
              <div className={`whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[15px] ${mine ? "rounded-br-md bg-accent text-accent-fg" : "rounded-bl-md bg-surface-2"}`}>
                {m.body}
              </div>
              <time className="mt-0.5 px-1 text-[11px] text-muted" dateTime={m.created_at}>{timeFmt.format(new Date(m.created_at))}</time>
            </div>
          );
        })}
      </div>
      <form className="flex items-end gap-2 border-t border-line p-2.5" onSubmit={(e) => { e.preventDefault(); void send(); }}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(); }
          }}
          rows={1}
          maxLength={2000}
          placeholder={t("chat.placeholder")}
          aria-label={t("chat.label")}
          className="input max-h-32 min-h-11 flex-1 resize-none"
        />
        <button type="submit" className="btn-primary shrink-0" disabled={sending || !body.trim()}>{t("chat.send")}</button>
      </form>
      {error && <p className="px-3 pb-2 text-sm font-semibold text-danger" role="alert">{error}</p>}
    </div>
  );
}
