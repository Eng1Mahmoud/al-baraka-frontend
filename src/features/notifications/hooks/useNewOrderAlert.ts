"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { toast } from "sonner";

// Placeholder chime — swap the file for the shop's own sound, keeping the path.
const SOUND_URL = "/sounds/new-order.mp3";
const SOUND_ENABLED_KEY = "al-baraka-sound-enabled";

/** Whether sound is on is browser state (localStorage), so React subscribes to it. */
const soundPreference = {
  listeners: new Set<() => void>(),

  subscribe(onChange: () => void) {
    soundPreference.listeners.add(onChange);
    return () => soundPreference.listeners.delete(onChange);
  },

  isEnabled: () => localStorage.getItem(SOUND_ENABLED_KEY) === "true",

  enable() {
    localStorage.setItem(SOUND_ENABLED_KEY, "true");
    soundPreference.listeners.forEach((listener) => listener());
  },
};

/**
 * Plays a sound when the newest order id changes.
 *
 * Browsers block audio until the user has interacted with the page, so the sound
 * stays off until an admin enables it once — `enableSound` doubles as that gesture.
 * When the tab is closed the Web Push notification takes over instead.
 */
export function useNewOrderAlert(latestOrderId: string | undefined, latestOrderLabel?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSeenRef = useRef<string | undefined>(undefined);

  const isSoundEnabled = useSyncExternalStore(
    soundPreference.subscribe,
    soundPreference.isEnabled,
    () => false
  );

  useEffect(() => {
    audioRef.current = new Audio(SOUND_URL);
    audioRef.current.preload = "auto";
  }, []);

  const enableSound = async () => {
    const audio = (audioRef.current ??= new Audio(SOUND_URL));

    try {
      // Playing (then resetting) inside the click satisfies the autoplay policy.
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      soundPreference.enable();
      toast.success("تم تفعيل صوت الطلبات الجديدة");
    } catch {
      toast.error("المتصفح منع تشغيل الصوت، حاول مرة أخرى");
    }
  };

  useEffect(() => {
    if (!latestOrderId) return;

    // First poll after mount only records the baseline — no alert for existing orders.
    if (lastSeenRef.current === undefined) {
      lastSeenRef.current = latestOrderId;
      return;
    }

    if (lastSeenRef.current === latestOrderId) return;
    lastSeenRef.current = latestOrderId;

    toast.info(latestOrderLabel ? `طلب جديد: ${latestOrderLabel}` : "وصل طلب جديد");

    if (isSoundEnabled) {
      audioRef.current?.play().catch(() => undefined);
    }
  }, [latestOrderId, latestOrderLabel, isSoundEnabled]);

  return { isSoundEnabled, enableSound };
}
