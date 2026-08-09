import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function CartSkeleton({ lines }: { lines: number }) {
  // Past half a dozen the reflow saved stops being worth a screen of pulsing blocks.
  const rows = Math.min(Math.max(lines, 1), 6);

  return (
    <div
      role="status"
      aria-label="بنحمّل السلة"
      className="grid gap-8 md:grid-cols-[1fr_300px] md:items-start"
    >
      <ul className="divide-y rounded-2xl border bg-card">
        {Array.from({ length: rows }).map((_, index) => (
          <li key={index} className="flex gap-4 p-4">
            <Skeleton className="size-20 shrink-0 rounded-xl" />

            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-36 max-w-full" />
              <Skeleton className="mt-2 h-3 w-24" />

              {/* the quantity stepper: two icon buttons, the count, then remove */}
              <div className="mt-3.5 flex items-center gap-1">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="mx-1 h-4 w-4" />
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="ms-2 h-7 w-20 rounded-lg" />
              </div>
            </div>

            <Skeleton className="h-4 w-14 shrink-0" />
          </li>
        ))}
      </ul>

      <aside className="rounded-2xl border bg-card p-5 md:sticky md:top-24">
        <Skeleton className="mb-4 h-5 w-24" />

        <div className="space-y-2.5">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-16" />
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        <Skeleton className="mt-5 h-9 w-full rounded-lg" />
        <Skeleton className="mx-auto mt-3 h-3 w-32" />
      </aside>
    </div>
  );
}
