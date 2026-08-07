"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/shared/components/forms/FormField";
import { SubmitButton } from "@/shared/components/forms/SubmitButton";
import { formatDate, formatPrice } from "@/shared/lib/format";
import { getErrorMessage } from "@/shared/lib/apiClient";
import { ordersApi } from "@/features/orders/api/orders.api";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import type { Order } from "@/features/orders/types/order";

const trackSchema = z.object({
  orderNumber: z.string().min(4, "رقم الطلب مطلوب"),
  phone: z.string().regex(/^01[0-2,5]\d{8}$/, "رقم الهاتف غير صحيح"),
});

type TrackFormValues = z.infer<typeof trackSchema>;

export function TrackOrderView() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema),
    // The order number can be prefilled from the link; the phone never is — it's
    // the thing that proves the order belongs to whoever is asking.
    defaultValues: { orderNumber: searchParams.get("order") ?? "" },
  });

  const onSubmit = async (values: TrackFormValues) => {
    setError(null);
    try {
      setOrder(await ordersApi.track(values.orderNumber, values.phone));
    } catch (requestError) {
      setOrder(null);
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border bg-card p-5">
        <FormField label="رقم الطلب" htmlFor="orderNumber" error={errors.orderNumber?.message} required>
          <Input id="orderNumber" dir="ltr" placeholder="AB-260807-0001" {...register("orderNumber")} />
        </FormField>

        <FormField label="رقم الهاتف" htmlFor="phone" error={errors.phone?.message} required>
          <Input id="phone" dir="ltr" inputMode="tel" placeholder="01012345678" {...register("phone")} />
        </FormField>

        <SubmitButton isSubmitting={isSubmitting} className="w-full">
          اعرض الطلب
        </SubmitButton>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </form>

      {order && (
        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-sm text-muted-foreground" dir="ltr">
                {order.orderNumber}
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <ul className="space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={item.product} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity} {item.unit}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <Separator className="my-3" />

          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">التوصيل</dt>
              <dd>{order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : "مجاني"}</dd>
            </div>
            <div className="flex justify-between text-base">
              <dt className="font-semibold text-brand-900">الإجمالي</dt>
              <dd className="font-extrabold text-brand-700">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
