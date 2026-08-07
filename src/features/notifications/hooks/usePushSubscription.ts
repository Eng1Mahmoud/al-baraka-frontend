"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { apiClient, getErrorMessage } from "@/shared/lib/apiClient";

/** VAPID keys travel as base64url and must be raw bytes for the Push API. */
const urlBase64ToUint8Array = (base64String: string): Uint8Array<ArrayBuffer> => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);

  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
};

/**
 * Subscribes an admin's device to order push notifications — the only way to be
 * alerted while the tab is closed or the screen is off.
 *
 * On iOS this works only after the PWA is installed to the home screen (iOS 16.4+).
 */
/** Push support is a fixed fact about the browser, so it never needs to re-notify. */
const subscribeToNothing = () => () => {};
const isPushSupported = () => "serviceWorker" in navigator && "PushManager" in window;

export function usePushSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const isSupported = useSyncExternalStore(subscribeToNothing, isPushSupported, () => false);

  useEffect(() => {
    if (!isSupported) return;

    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setIsSubscribed(Boolean(subscription)))
      .catch(() => setIsSubscribed(false));
  }, [isSupported]);

  const subscribe = async () => {
    setIsWorking(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("لم يتم السماح بالإشعارات من إعدادات المتصفح");
        return;
      }

      const { data } = await apiClient.get<{ publicKey: string | null }>("/push/public-key");
      if (!data.publicKey) {
        toast.error("مفاتيح الإشعارات غير مضبوطة على الخادم");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });

      await apiClient.post("/push/subscribe", subscription.toJSON());
      setIsSubscribed(true);
      toast.success("تم تفعيل إشعارات الطلبات على هذا الجهاز");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsWorking(false);
    }
  };

  const unsubscribe = async () => {
    setIsWorking(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) return;

      await apiClient.post("/push/unsubscribe", { endpoint: subscription.endpoint });
      await subscription.unsubscribe();
      setIsSubscribed(false);
      toast.success("تم إيقاف الإشعارات على هذا الجهاز");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsWorking(false);
    }
  };

  return { isSupported, isSubscribed, isWorking, subscribe, unsubscribe };
}
