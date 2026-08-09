import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

/** One field: its label, the input, and the hint some of them carry. */
function FieldSkeleton({ rows = 1, hint = false }: { rows?: number; hint?: boolean }) {
  return (
    <div>
      <Skeleton className="h-3.5 w-20" />
      <Skeleton className="mt-2 w-full rounded-lg" style={{ height: rows === 1 ? 36 : 24 + rows * 20 }} />
      {hint && <Skeleton className="mt-1.5 h-3 w-40 max-w-full" />}
    </div>
  );
}

/**
 * Stands in for the checkout screen while the cart is being priced.
 *
 * Shaped like the page it replaces rather than being one grey panel: the form and the
 * summary land where they were already outlined, so the screen resolves instead of
 * rearranging itself the moment the data arrives.
 *
 * @param lines how many order lines the summary should outline — the local cart knows
 * this before the server has priced anything.
 * @param withArea whether to leave room for the delivery-area select, which only
 * appears once the shop has areas set up.
 */
export function CheckoutSkeleton({ lines = 2, withArea = true }: { lines?: number; withArea?: boolean }) {
  const rows = Math.min(Math.max(lines, 1), 5);

  return (
    <div role="status" aria-label="بنحضّر صفحة إتمام الطلب">
      <Skeleton className="mb-6 h-8 w-40 md:h-9 md:w-48" />

      <div className="grid gap-8 md:grid-cols-[1fr_300px] md:items-start">
        <div className="space-y-5 rounded-2xl border bg-card p-5">
          <Skeleton className="h-4 w-64 max-w-full" />

          <FieldSkeleton />
          <FieldSkeleton hint />
          {withArea && <FieldSkeleton hint />}
          <FieldSkeleton rows={3} />
          <FieldSkeleton rows={2} />

          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <aside className="rounded-2xl border bg-card p-5">
          <Skeleton className="mb-4 h-5 w-24" />

          <ul className="mb-4 space-y-2">
            {Array.from({ length: rows }).map((_, index) => (
              <li key={index} className="flex justify-between gap-3">
                <Skeleton className="h-4 w-32 max-w-full flex-1" />
                <Skeleton className="h-4 w-14 shrink-0" />
              </li>
            ))}
          </ul>

          <Separator className="my-3" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between pt-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          <Skeleton className="mt-4 h-10 w-full rounded-lg" />
          <Skeleton className="mx-auto mt-3 h-8 w-full rounded-lg" />
        </aside>
      </div>
    </div>
  );
}
