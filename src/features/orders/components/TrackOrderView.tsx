"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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

const trackSchema = z.object({
  orderNumber: z.string().trim().min(4, "رقم الطلب مطلوب"),
});

type TrackFormValues = z.infer<typeof trackSchema>;

export function TrackOrderView() {
  const searchParams = useSearchParams();

  // Prefilled from the link the customer is sent after checkout, and looked up
  // straight away — with only the number to go on there is nothing left to fill in,
  // so asking them to press a button first would be asking for nothing.
  const linkedOrder = searchParams.get("order")?.trim() ?? "";
  const [lookup, setLookup] = useState(linkedOrder);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema),
    defaultValues: { orderNumber: linkedOrder },
  });

  const {
    data: order,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["orders", "track", lookup],
    queryFn: () => ordersApi.track(lookup),
    enabled: lookup.length >= 4,
    retry: false,
  });

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit((values) => setLookup(values.orderNumber))}
        className="space-y-4 rounded-2xl border bg-card p-5"
      >
        <FormField
          label="رقم الطلب"
          htmlFor="orderNumber"
          error={errors.orderNumber?.message}
          hint="هتلاقيه في رسالة تأكيد الطلب"
          required
        >
          <Input
            id="orderNumber"
            dir="ltr"
            autoComplete="off"
            placeholder="AB-260807-0001"
            {...register("orderNumber")}
          />
        </FormField>

        <SubmitButton isSubmitting={isFetching} className="w-full">
          اعرض الطلب
        </SubmitButton>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {getErrorMessage(error)}
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
