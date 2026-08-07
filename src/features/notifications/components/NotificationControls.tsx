"use client";

import { Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewOrderAlert } from "@/features/notifications/hooks/useNewOrderAlert";
import { usePushSubscription } from "@/features/notifications/hooks/usePushSubscription";
import type { Order } from "@/features/orders/types/order";

/**
 * Two separate switches, because they cover different situations:
 * sound only works while this tab is open, push works when it is closed.
 */
export function NotificationControls({ latestOrder }: { latestOrder?: Order }) {
  const { isSoundEnabled, enableSound } = useNewOrderAlert(latestOrder?._id, latestOrder?.orderNumber);
  const { isSupported, isSubscribed, isWorking, subscribe, unsubscribe } = usePushSubscription();

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {!isSoundEnabled ? (
        <Button variant="outline" size="sm" onClick={enableSound}>
          <VolumeX className="size-4" aria-hidden />
          <span className="hidden sm:inline">تفعيل الصوت</span>
        </Button>
      ) : (
        <span
          className="flex items-center gap-1.5 text-xs text-brand-700"
          title="صوت الطلبات الجديدة مفعّل"
        >
          <Volume2 className="size-4" aria-hidden />
          <span className="hidden sm:inline">الصوت مفعّل</span>
        </span>
      )}

      {isSupported && (
        <Button
          variant={isSubscribed ? "ghost" : "default"}
          size="sm"
          disabled={isWorking}
          onClick={isSubscribed ? unsubscribe : subscribe}
        >
          {isSubscribed ? (
            <>
              <BellOff className="size-4" aria-hidden />
              <span className="hidden sm:inline">إيقاف الإشعارات</span>
            </>
          ) : (
            <>
              <Bell className="size-4" aria-hidden />
              <span className="hidden sm:inline">تفعيل الإشعارات</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
