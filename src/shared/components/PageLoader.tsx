import { BrandMark } from "@/shared/components/BrandMark";

/**
 * Shown while a route is being fetched.
 *
 * The mark rather than a bare spinner: this is the first thing a visitor sees on a
 * slow connection, and a ring on an empty page could belong to any site. The ring
 * turns around it so there is still proof something is happening.
 */
export function PageLoader({ label = "بنحمّل الصفحة" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6"
    >
      <span className="relative flex size-16 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-700 [animation-duration:900ms] motion-reduce:animate-none"
        />
        <BrandMark className="size-10" />
      </span>

      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
