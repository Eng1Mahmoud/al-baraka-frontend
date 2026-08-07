"use client";

import { Download, Share, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { INSTALL_COPY } from "@/features/pwa/config";
import { useInstallPrompt } from "@/features/pwa/hooks/useInstallPrompt";

interface InstallAppButtonProps {
  /** `light` for dark surfaces (the footer), `dark` for cards and the page body. */
  tone?: "dark" | "light";
  size?: "sm" | "default" | "lg";
  className?: string;
}

/**
 * The install action itself, wherever it appears.
 *
 * Renders nothing on a browser that can't install and nothing inside the installed
 * app — so a caller can drop it in without guarding. On iOS Safari, where there is
 * no install API at all, it shows the two menu taps instead of a button that would
 * do nothing.
 */
export function InstallAppButton({ tone = "dark", size = "sm", className }: InstallAppButtonProps) {
  const { canInstall, needsIosSteps, install } = useInstallPrompt();

  if (canInstall) {
    return (
      <Button
        size={size}
        onClick={() => void install()}
        className={cn(
          tone === "light" && "bg-brand-300 text-brand-900 hover:bg-brand-300/85",
          className
        )}
      >
        <Download className="size-4" aria-hidden />
        {INSTALL_COPY.action}
      </Button>
    );
  }

  if (needsIosSteps) return <IosInstallSteps tone={tone} className={className} />;

  return null;
}

/** Safari's install lives in a menu, so the only honest instruction is where to tap. */
export function IosInstallSteps({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs",
        tone === "light" ? "text-brand-300" : "text-muted-foreground",
        className
      )}
    >
      من قائمة المشاركة
      <Share className="size-3.5 shrink-0" aria-hidden />
      اختر
      <span
        className={cn(
          "inline-flex items-center gap-1 font-semibold",
          tone === "light" ? "text-white" : "text-brand-700"
        )}
      >
        <SquarePlus className="size-3.5 shrink-0" aria-hidden />
        إضافة إلى الشاشة الرئيسية
      </span>
    </p>
  );
}
