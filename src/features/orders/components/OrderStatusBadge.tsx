import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/shared/config/site";
import type { OrderStatus } from "@/features/orders/types/order";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
        ORDER_STATUS_STYLES[status]
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
