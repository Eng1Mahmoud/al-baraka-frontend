"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/shared/lib/format";
import { ORDER_STATUS_LABELS } from "@/shared/config/site";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { useOrders, useUpdateOrderStatus } from "@/features/orders/hooks/useOrders";
import type { Order, OrderStatus } from "@/features/orders/types/order";

const STATUS_FILTERS = ["all", ...Object.keys(ORDER_STATUS_LABELS)] as const;

function StatusPicker({
  order,
  onChange,
  className,
}: {
  order: Order;
  onChange: (status: OrderStatus) => void;
  className?: string;
}) {
  return (
    <Select value={order.status} onValueChange={(value) => onChange(value as OrderStatus)}>
      <SelectTrigger className={className} size="sm" aria-label={`تغيير حالة الطلب ${order.orderNumber}`}>
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
  );
}

export function OrdersTable() {
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const { data, isLoading } = useOrders(status === "all" ? {} : { status });
  const updateStatus = useUpdateOrderStatus();

  const changeStatus = (id: string, next: OrderStatus) => updateStatus.mutate({ id, status: next });

  return (
    <div className="space-y-4">
      <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
        <SelectTrigger className="w-full sm:w-48" aria-label="تصفية بالحالة">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_FILTERS.map((value) => (
            <SelectItem key={value} value={value}>
              {value === "all" ? "كل الطلبات" : ORDER_STATUS_LABELS[value as OrderStatus]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : !data?.items.length ? (
        <p className="rounded-xl border border-dashed bg-card py-10 text-center text-sm text-muted-foreground">
          لا توجد طلبات في هذه الحالة.
        </p>
      ) : (
        <>
          {/* Cards on phones — seven columns of table is unreadable at 375px. */}
          <ul className="space-y-3 md:hidden">
            {data.items.map((order) => (
              <li key={order._id} className="rounded-xl border bg-card p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <Link href={`/dashboard/orders/${order._id}`} className="min-w-0 hover:underline">
                    <p className="font-medium text-brand-900">{order.customer.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{order.orderNumber}</p>
                  </Link>
                  <OrderStatusBadge status={order.status} />
                </div>

                <dl className="mb-3 space-y-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">الهاتف</dt>
                    <dd dir="ltr">{order.customer.phone}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">الإجمالي</dt>
                    <dd className="font-bold text-brand-700">{formatPrice(order.total)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">التاريخ</dt>
                    <dd className="text-xs">{formatDate(order.createdAt)}</dd>
                  </div>
                </dl>

                <StatusPicker
                  order={order}
                  onChange={(next) => changeStatus(order._id, next)}
                  className="w-full"
                />
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead>الإجمالي</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تغيير الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-xs">
                      <Link href={`/dashboard/orders/${order._id}`} className="hover:underline">
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{order.customer.name}</TableCell>
                    <TableCell dir="ltr" className="text-start">
                      {order.customer.phone}
                    </TableCell>
                    <TableCell>{formatPrice(order.total)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <StatusPicker
                        order={order}
                        onChange={(next) => changeStatus(order._id, next)}
                        className="w-36"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
