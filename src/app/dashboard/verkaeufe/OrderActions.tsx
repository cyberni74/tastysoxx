"use client";
import { useActionState } from "react";
import type { OrderStatus } from "@/lib/types";
import { setOrderStatus } from "./actions";

export function OrderActions({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [state, action, pending] = useActionState(setOrderStatus, {});
  if (status !== "pending_payment" && status !== "paid") return null;

  return (
    <form action={action} className="grid gap-2"
      onSubmit={(e) => {
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        if (submitter?.value === "cancelled" && !confirm("Bestellung wirklich stornieren? Die Artikel werden wieder freigegeben.")) e.preventDefault();
      }}>
      <input type="hidden" name="order_id" value={orderId} />
      <div className="flex flex-wrap gap-2">
        {status === "pending_payment" && (
          <>
            <button name="status" value="paid" className="btn-primary btn-sm" disabled={pending}>Zahlung erhalten</button>
            <button name="status" value="cancelled" className="btn-ghost btn-sm text-danger" disabled={pending}>Stornieren</button>
          </>
        )}
        {status === "paid" && (
          <button name="status" value="shipped" className="btn-primary btn-sm" disabled={pending}>Als versendet markieren</button>
        )}
      </div>
      {state.error && <p className="text-sm font-semibold text-danger" role="alert">{state.error}</p>}
    </form>
  );
}
