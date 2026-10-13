"use client";
import { useActionState } from "react";
import type { OrderStatus } from "@/lib/types";
import { setOrderStatus } from "./actions";
import { useT } from "@/i18n/client";
import { seller } from "@/i18n/messages/seller";

export function OrderActions({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const t = useT(seller);
  const [state, action, pending] = useActionState(setOrderStatus, {});
  if (status !== "pending_payment" && status !== "paid") return null;

  return (
    <form action={action} className="grid gap-2"
      onSubmit={(e) => {
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        if (submitter?.value === "cancelled" && !confirm(t("order.confirmCancel"))) e.preventDefault();
      }}>
      <input type="hidden" name="order_id" value={orderId} />
      <div className="flex flex-wrap gap-2">
        {status === "pending_payment" && (
          <>
            <button name="status" value="paid" className="btn-primary btn-sm" disabled={pending}>{t("order.paid")}</button>
            <button name="status" value="cancelled" className="btn-ghost btn-sm text-danger" disabled={pending}>{t("order.cancel")}</button>
          </>
        )}
        {status === "paid" && (
          <button name="status" value="shipped" className="btn-primary btn-sm" disabled={pending}>{t("order.ship")}</button>
        )}
      </div>
      {state.error && <p className="text-sm font-semibold text-danger" role="alert">{state.error}</p>}
    </form>
  );
}
