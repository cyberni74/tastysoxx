"use client";
import { useActionState, useState, useTransition } from "react";
import type { OrderStatus } from "@/lib/types";
import { changeOrderStatus, submitReview, type ActionState } from "./actions";

export function OrderActions({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [msg, setMsg] = useState<ActionState>({});
  const [pending, start] = useTransition();

  function run(next: "cancelled" | "completed") {
    if (next === "cancelled" && !window.confirm("Bestellung wirklich stornieren? Die Artikel werden wieder freigegeben.")) return;
    start(async () => setMsg(await changeOrderStatus(orderId, next)));
  }

  if (status !== "pending_payment" && status !== "shipped") return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      {status === "pending_payment" && (
        <button type="button" className="btn-ghost btn-sm" disabled={pending} onClick={() => run("cancelled")}>
          {pending ? "Bitte warten…" : "Stornieren"}
        </button>
      )}
      {status === "shipped" && (
        <button type="button" className="btn-primary btn-sm" disabled={pending} onClick={() => run("completed")}>
          {pending ? "Bitte warten…" : "Erhalt bestätigen"}
        </button>
      )}
      {msg.error && <p role="alert" className="text-sm font-medium text-danger">{msg.error}</p>}
    </div>
  );
}

export function ReviewForm({ orderId, sellerName }: { orderId: string; sellerName: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitReview, {});
  const [rating, setRating] = useState(0);

  if (state.ok) return <p role="status" className="rounded-xl bg-accent-soft p-3 text-sm font-medium">{state.ok}</p>;

  return (
    <form action={action} className="grid gap-3 rounded-xl border border-line bg-surface-2 p-4">
      <input type="hidden" name="order_id" value={orderId} />
      <fieldset>
        <legend className="text-sm font-semibold">Wie zufrieden bist du mit {sellerName}?</legend>
        <div className="mt-1 flex gap-1" role="radiogroup">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer text-3xl leading-none" title={`${n} von 5 Sternen`}>
              <input type="radio" name="rating" value={n} required className="sr-only" checked={rating === n} onChange={() => setRating(n)} />
              <span aria-hidden className={n <= rating ? "text-star" : "text-line"}>★</span>
              <span className="sr-only">{n} {n === 1 ? "Stern" : "Sterne"}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="label">
        Kommentar <span className="font-normal text-muted">(optional)</span>
        <textarea name="body" rows={3} maxLength={1000} className="input resize-y" placeholder="Versand, Verpackung, Kommunikation …" />
      </label>
      {state.error && <p role="alert" className="text-sm font-medium text-danger">{state.error}</p>}
      <div>
        <button className="btn-primary btn-sm" disabled={pending || rating === 0}>{pending ? "Wird gesendet…" : "Bewertung abschicken"}</button>
      </div>
    </form>
  );
}
