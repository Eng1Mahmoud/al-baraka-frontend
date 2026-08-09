"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Never changes after the first client render, so there is nothing to subscribe to. */
const subscribeToNothing = () => () => {};

/**
 * Switches between the light and dark palettes.
 *
 * Toggles against `resolvedTheme`, not `theme`: on a device set to dark, `theme` is
 * the string "system" and flipping it away from that would land on dark again, so
 * the first tap would appear to do nothing.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  // Which theme is active is a fact about the browser and unknowable while rendering
  // on the server, so the icon is held back for one render. Drawn anyway it would
  // show the sun on a dark device until hydration corrected it.
  const isMounted = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("shrink-0", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
      title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
    >
      {/* Holds the button's size before mount so the header doesn't shift under it. */}
      {isMounted ? (
        isDark ? (
          <Sun className="size-5" aria-hidden />
        ) : (
          <Moon className="size-5" aria-hidden />
        )
      ) : (
        <span className="size-5" aria-hidden />
      )}
    </Button>
  );
}
