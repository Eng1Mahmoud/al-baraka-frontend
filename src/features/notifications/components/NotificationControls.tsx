"use client";

import { Bell, BellOff, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewOrderAlert } from "@/features/notifications/hooks/useNewOrderAlert";
import { usePushSubscription } from "@/features/notifications/hooks/usePushSubscription";
import type { Order } from "@/features/orders/types/order";

/**
 * One control, because there is now one alert: the system notification. It rings the
 * same way whether this tab is focused or the app is closed, so there is no second
 * in-page sound to switch on separately.
 *
 * When it's off the button says so plainly — with no notification there is no alert
 * at all, only the list quietly updating.
 */
export function NotificationControls({ latestOrder }: { latestOrder?: Order }) {
  useNewOrderAlert(latestOrder);
  const { isSupported, isSubscribed, isWorking, subscribe, unsubscribe } = usePushSubscription();

  if (!isSupported) {
    return (
      <span className="hidden text-xs text-muted-foreground sm:inline">
        المتصفح ده مايدعمش الإشعارات
      </span>
    );
  }

  if (isSubscribed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled={isWorking}
        onClick={unsubscribe}
        className="text-brand-700"
        title="الإشعارات مفعّلة على الجهاز ده — اضغط لإيقافها"
      >
        <BellRing className="size-4" aria-hidden />
        <span className="hidden sm:inline">الإشعارات مفعّلة</span>
      </Button>
    );
  }

  return (
    <Button size="sm" disabled={isWorking} onClick={subscribe} className="shrink-0">
      {isWorking ? (
        <Bell className="size-4 animate-pulse" aria-hidden />
      ) : (
        <BellOff className="size-4" aria-hidden />
      )}
      <span className="hidden sm:inline">فعّل تنبيه الطلبات</span>
      <span className="sm:hidden">تنبيه</span>
    </Button>
  );
}
