"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Where the pre-hydration capture script in the root layout parks the event. */
type WindowWithInstall = Window & { __abInstall?: BeforeInstallPromptEvent | null };

const CAPTURE_EVENT = "ab:installprompt";
const DISMISSED_KEY = "al-baraka-install-dismissed";

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  // iOS Safari predates display-mode and reports it here instead.
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

/** iPadOS reports itself as a Mac, so touch support is what separates it from a desktop. */
const isIosSafari = () => {
  const ua = window.navigator.userAgent;
  const isApple =
    /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  // Chrome and Firefox on iOS can't install at all — only Safari can.
  return isApple && !/crios|fxios/i.test(ua);
};

const subscribeToNothing = () => () => {};

const promptStore = {
  subscribe(onChange: () => void) {
    window.addEventListener(CAPTURE_EVENT, onChange);
    return () => window.removeEventListener(CAPTURE_EVENT, onChange);
  },

  getSnapshot: () => (window as WindowWithInstall).__abInstall ?? null,

  /** After prompting: the event is single-use and must not be offered again. */
  clear() {
    (window as WindowWithInstall).__abInstall = null;
    window.dispatchEvent(new Event(CAPTURE_EVENT));
  },
};

const standaloneStore = {
  subscribe(onChange: () => void) {
    const media = window.matchMedia("(display-mode: standalone)");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  },
  getSnapshot: () => isStandalone(),
};

const DISMISS_DAYS = 14;

const dismissedUntil = () => {
  const stored = Number(localStorage.getItem(DISMISSED_KEY));
  return Number.isFinite(stored) ? stored : 0;
};

const dismissStore = {
  listeners: new Set<() => void>(),

  subscribe(onChange: () => void) {
    dismissStore.listeners.add(onChange);
    return () => dismissStore.listeners.delete(onChange);
  },

  getSnapshot: () => Date.now() < dismissedUntil(),

  notify: () => dismissStore.listeners.forEach((listener) => listener()),

  dismiss() {
    localStorage.setItem(DISMISSED_KEY, String(Date.now() + DISMISS_DAYS * 86_400_000));
    dismissStore.notify();
  },

  /** Installing wipes the snooze, so removing the app later gets a clean offer. */
  reset() {
    localStorage.removeItem(DISMISSED_KEY);
    dismissStore.notify();
  },
};

export function useInstallPrompt() {
  const promptEvent = useSyncExternalStore(
    promptStore.subscribe,
    promptStore.getSnapshot,
    () => null
  );

  const isInstalled = useSyncExternalStore(
    standaloneStore.subscribe,
    standaloneStore.getSnapshot,
    () => false
  );

  const isApple = useSyncExternalStore(subscribeToNothing, isIosSafari, () => false);

  // Hidden during SSR and the first client render: better to appear a moment late
  // than to flash at someone who already said no.
  const isDismissed = useSyncExternalStore(
    dismissStore.subscribe,
    dismissStore.getSnapshot,
    () => true
  );

  useEffect(() => {
    // The capture script already drops the parked event on install; this clears the
    // snooze too, so removing the app later gets a clean offer.
    const onInstalled = () => dismissStore.reset();

    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  const install = useCallback(async () => {
    if (!promptEvent) return;

    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;

    // Single-use: it can't be prompted with twice. Chrome fires a fresh one on a
    // later visit if they declined, so drop this one either way.
    promptStore.clear();
    return outcome;
  }, [promptEvent]);

  return {
    /** Chromium: a real install dialog is available. */
    canInstall: Boolean(promptEvent) && !isInstalled,
    /** iOS Safari: no API, so the customer has to be shown the menu path. */
    needsIosSteps: isApple && !isInstalled,
    isInstalled,
    isDismissed,
    install,
    dismiss: dismissStore.dismiss,
  };
}
