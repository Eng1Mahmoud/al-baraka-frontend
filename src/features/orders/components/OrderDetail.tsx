"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Phone, StickyNote, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, formatPrice } from "@/shared/lib/format";
import { ORDER_STATUS_LABELS } from "@/shared/config/site";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import {
  useOrder,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from "@/features/orders/hooks/useOrders";
import type { OrderStatus } from "@/features/orders/types/order";

export function OrderDetail({ id }: { id: string }) {
  const { data: order, isLoading, isError } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const updatePayment = useUpdatePaymentStatus();

  if (isLoading) return <Skeleton className="mx-auto h-96 w-full max-w-3xl rounded-xl" />;

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-dashed bg-card py-12 text-center">
        <p className="mb-4 text-sm text-destructive">الطلب ده مش موجود.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/orders">رجوع للطلبات</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-1 -ms-2">
            <Link href="/dashboard/orders">
              <ArrowRight className="size-4" aria-hidden />
              كل الطلبات
            </Link>
          </Button>
          <h1 className="font-display text-2xl font-bold text-brand-900" dir="ltr">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات العميل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="flex items-center gap-2.5">
            <User className="size-4 shrink-0 text-brand-500" aria-hidden />
            {order.customer.name}
          </p>
          <p className="flex items-center gap-2.5">
            <Phone className="size-4 shrink-0 text-brand-500" aria-hidden />
            <a href={`tel:${order.customer.phone}`} dir="ltr" className="hover:underline">
              {order.customer.phone}
            </a>
          </p>
          <p className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
            <span>
              {order.deliveryArea && (
                <span className="block font-medium text-brand-900">{order.deliveryArea.name}</span>
              )}
              {order.customer.address}
            </span>
          </p>
          {order.customer.notes && (
            <p className="flex items-start gap-2.5 text-muted-foreground">
              <StickyNote className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
              {order.customer.notes}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {order.items.map((item) => (
              <li key={item.product} className="flex justify-between gap-3">
                <span>
                  {item.name}
                  <span className="text-muted-foreground">
                    {" "}
                    × {item.quantity} {item.unit}
                  </span>
                </span>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">المجموع</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                التوصيل
                {order.deliveryArea && (
                  <span className="block text-xs">{order.deliveryArea.name}</span>
                )}
              </dt>
              <dd>{order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : "مجاني"}</dd>
            </div>
            <div className="flex justify-between text-base">
              <dt className="font-semibold text-brand-900">الإجمالي</dt>
              <dd className="font-extrabold text-brand-700">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إدارة الطلب</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">حالة الطلب</p>
            <Select
              value={order.status}
              onValueChange={(value) =>
                updateStatus.mutate({ id: order._id, status: value as OrderStatus })
              }
            >
              <SelectTrigger className="w-full" aria-label="حالة الطلب">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">الدفع (كاش عند الاستلام)</p>
            <Button
              variant={order.paymentStatus === "paid" ? "outline" : "default"}
              className="w-full"
              disabled={updatePayment.isPending}
              onClick={() =>
                updatePayment.mutate({
                  id: order._id,
                  paymentStatus: order.paymentStatus === "paid" ? "unpaid" : "paid",
                })
              }
            >
              {order.paymentStatus === "paid" ? "تحصيل الفلوس: تم ✓ (تراجع)" : "علّم كمدفوع"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
