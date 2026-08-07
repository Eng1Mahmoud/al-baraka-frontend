"use client";

import { cn } from "@/lib/utils";
import { INSTALL_COPY } from "@/features/pwa/config";
import { InstallAppButton } from "@/features/pwa/components/InstallAppButton";
import { useInstallPrompt } from "@/features/pwa/hooks/useInstallPrompt";

interface InstallAppCalloutProps {
  /** Overrides the default line — checkout has a sharper reason than the footer. */
  body?: string;
  tone?: "dark" | "light";
  className?: string;
}

/**
 * A titled block offering the install, for places that need their own heading and
 * spacing — the footer column, the order confirmation.
 *
 * It owns the whole block rather than just the button so that a browser which can't
 * install leaves no orphaned heading behind. `isDismissed` is deliberately ignored:
 * the dismiss on the home banner silences that banner, not every mention of the app.
 */
export function InstallAppCallout({
  body = INSTALL_COPY.body,
  tone = "dark",
  className,
}: InstallAppCalloutProps) {
  const { canInstall, needsIosSteps } = useInstallPrompt();

  if (!canInstall && !needsIosSteps) return null;

  return (
    <div className={className}>
      <h2
        className={cn(
          "mb-1 text-xs font-bold",
          tone === "light" ? "text-brand-300" : "text-brand-900"
        )}
      >
        {INSTALL_COPY.title}
      </h2>

      <p
        className={cn(
          "mb-3 text-xs",
          tone === "light" ? "text-brand-100/80" : "text-muted-foreground"
        )}
      >
        {body}
      </p>

      <InstallAppButton tone={tone} />
    </div>
  );
}
