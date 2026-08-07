"use client";

import { NotificationControls } from "@/features/notifications/components/NotificationControls";
import { DashboardMobileNav } from "@/features/dashboard/components/DashboardMobileNav";
import { useOrders } from "@/features/orders/hooks/useOrders";

export function DashboardHeader() {
  // The layout-level poll drives the alert; pages reuse the same cached query.
  const { data } = useOrders();
  const pendingCount = data?.pendingCount ?? 0;

  return (
    <header className="flex items-center justify-between gap-2 border-b bg-background px-4 py-3 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <DashboardMobileNav />
        <p className="truncate text-sm text-muted-foreground">
          {pendingCount > 0 ? (
            <>
              <span className="font-bold text-status-pending">{pendingCount}</span> طلب في انتظار
              المراجعة
            </>
          ) : (
            "لا توجد طلبات في انتظار المراجعة"
          )}
        </p>
      </div>

      <NotificationControls latestOrder={data?.items[0]} />
    </header>
  );
}
