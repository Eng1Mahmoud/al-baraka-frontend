"use client";

import { Bell, BellOff, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiClient, getErrorMessage } from "@/shared/lib/apiClient";
import { usePushSubscription } from "@/features/notifications/hooks/usePushSubscription";

/** The full notification controls, for the settings page. */
export function NotificationSettings() {
  const { isSupported, isSubscribed, isWorking, subscribe, unsubscribe } = usePushSubscription();

  const sendTest = async () => {
    try {
      await apiClient.post("/push/test");
      toast.success("تم إرسال إشعار تجريبي");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!isSupported) {
    return (
      <p className="text-sm text-muted-foreground">
        المتصفح ده مابيدعمش الإشعارات. على الآيفون، ثبّت التطبيق على الشاشة الرئيسية الأول.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {isSubscribed
          ? "الإشعارات مفعّلة — هتوصلك حتى لو التطبيق مقفول."
          : "فعّل الإشعارات عشان يوصلك تنبيه بأي طلب جديد وانت مش فاتح اللوحة."}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={isSubscribed ? "outline" : "default"}
          disabled={isWorking}
          onClick={isSubscribed ? unsubscribe : subscribe}
        >
          {isSubscribed ? (
            <>
              <BellOff className="size-4" aria-hidden />
              إيقاف الإشعارات
            </>
          ) : (
            <>
              <Bell className="size-4" aria-hidden />
              تفعيل الإشعارات
            </>
          )}
        </Button>

        {isSubscribed && (
          <Button variant="ghost" onClick={sendTest}>
            <Send className="size-4" aria-hidden />
            جرّب إشعار
          </Button>
        )}
      </div>
    </div>
  );
}
