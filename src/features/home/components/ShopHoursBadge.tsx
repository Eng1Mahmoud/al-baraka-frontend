"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/features/settings/hooks/useSettings";

/**
 * The opening line of the home page: when the shop takes orders and when it delivers.
 *
 * Read from Settings rather than written here, because it is the sentence most likely
 * to change — a shop that extends delivery by an hour edits it from the dashboard, and
 * a claim about opening hours that only a deploy can correct is one that will be wrong
 * at some point.
 */
export function ShopHoursBadge() {
  const { data: settings, isLoading } = useSettings();
  const hours = settings?.workingHours?.trim();

  if (isLoading) {
    return <Skeleton className="mb-4 h-7 w-56 max-w-full rounded-full" />;
  }

  return (
    <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-3.5 py-1.5 text-xs font-bold text-brand-700">
      <span className="size-1.5 rounded-full bg-brand-500" aria-hidden />
      {/* Falls back to the promise itself when the shop hasn't filled its hours in. */}
      {hours || "السوق فتح، والطلبات شغالة"}
    </p>
  );
}
