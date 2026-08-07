"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/shared/lib/format";
import { useOrderStats } from "@/features/orders/hooks/useOrders";

export function DashboardOverview() {
  const { data, isLoading } = useOrderStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const tiles = [
    { label: "طلبات اليوم", value: String(data?.todayOrders ?? 0) },
    { label: "في انتظار المراجعة", value: String(data?.pendingOrders ?? 0) },
    { label: "تم تسليمها", value: String(data?.deliveredOrders ?? 0) },
    { label: "إجمالي المبيعات", value: formatPrice(data?.totalRevenue ?? 0) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile) => (
        <Card key={tile.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{tile.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-extrabold text-brand-900">{tile.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
