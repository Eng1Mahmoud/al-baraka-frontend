"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/shared/components/BrandMark";
import { INSTALL_COPY } from "@/features/pwa/config";
import {
  InstallAppButton,
  IosInstallSteps,
} from "@/features/pwa/components/InstallAppButton";
import { useInstallPrompt } from "@/features/pwa/hooks/useInstallPrompt";

/**
 * The home page's offer to install.
 *
 * Shows the brand mark rather than a generic download glyph: it's the thing that will
 * actually appear on their screen, so it previews the outcome instead of describing
 * it. Rendered from `BrandMark`, not the icon PNG — same artwork, one less request,
 * and it can't be served stale from the image cache after the logo changes.
 *
 * Renders nothing unless the browser can install, nothing inside the installed app,
 * and nothing for two weeks after it's dismissed — a shop that asks on every visit
 * is worse than one that asks once.
 */
export function InstallAppBanner() {
  const { canInstall, needsIosSteps, isDismissed, dismiss } = useInstallPrompt();

  if (isDismissed || (!canInstall && !needsIosSteps)) return null;

  return (
    <section className="border-b border-brand-100 bg-brand-50">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
        <BrandMark className="hidden size-13 shrink-0 rounded-2xl shadow-card sm:flex" />

        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-brand-900 sm:text-base">
            {INSTALL_COPY.title}
          </p>
          <p className="text-xs text-muted-foreground sm:text-sm">{INSTALL_COPY.body}</p>

          {/* On iOS the steps sit under the copy, where there's room to read them —
              squeezed into the button slot they wrap into an unreadable column. */}
          {needsIosSteps && <IosInstallSteps className="mt-1.5" />}
        </div>

        {canInstall && <InstallAppButton size="default" className="shrink-0" />}

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={dismiss}
          aria-label="إخفاء عرض التثبيت"
          className="shrink-0 text-muted-foreground"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
    </section>
  );
}
