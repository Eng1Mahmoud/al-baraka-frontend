"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIntersection } from "@/shared/hooks/useIntersection";

interface InfiniteScrollAreaProps {
  children: ReactNode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  /** The next page failed — auto-loading has to stop and ask. */
  isFetchNextPageError?: boolean;
  fetchNextPage: () => void;
  /** Shown once the last page is in. Omit to end quietly. */
  endLabel?: string;
  className?: string;
}

/** Enough rows to work in, short enough to leave the heading and search box in view. */
const MAX_HEIGHT = "max-h-[75vh]";

/**
 * A bounded, self-scrolling list that pulls the next page as it nears the bottom.
 *
 * The cap is a definite height rather than `flex-1`: <main> above is itself a scroll
 * container, so the wrapper this sits in is sized by its content and has no spare
 * height to hand out — a flex-grown child would simply grow to fit every row and
 * never scroll. A short list still takes only the height it needs.
 */
export function InfiniteScrollArea({
  children,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError = false,
  fetchNextPage,
  endLabel,
  className,
}: InfiniteScrollAreaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadNextPage = useCallback(() => fetchNextPage(), [fetchNextPage]);

  // Held off while a page is in flight or the last one failed — otherwise a failing
  // request would be retried on every scroll frame. `rootRef` is what makes the
  // trigger fire early: the sentinel is clipped by this box, not by the viewport.
  useIntersection(
    sentinelRef,
    loadNextPage,
    hasNextPage && !isFetchingNextPage && !isFetchNextPageError,
    rootRef
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        MAX_HEIGHT,
        "overflow-auto",
        // shadcn's <Table> wraps itself in an `overflow-x-auto` div, and CSS promotes
        // the other axis to `auto` alongside it — making that div the scrollport a
        // sticky header would pin itself to, one that never scrolls. Handing both axes
        // to this box instead puts the header back under the right scroller.
        "**:data-[slot=table-container]:overflow-visible",
        className
      )}
    >
      {children}

      <div className="flex justify-center px-4 py-4" aria-live="polite">
        {isFetchNextPageError ? (
          <div className="text-center">
            <p className="mb-2 text-sm text-destructive">تعذر تحميل باقي النتائج.</p>
            <Button variant="outline" size="sm" onClick={loadNextPage}>
              حاول تاني
            </Button>
          </div>
        ) : isFetchingNextPage ? (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            بنحمّل المزيد...
          </span>
        ) : hasNextPage ? (
          // The sentinel needs height to be observable at all, and reserving it keeps
          // the end-message appearing from nudging the last row.
          <span className="h-5" aria-hidden />
        ) : (
          endLabel && <span className="text-sm text-muted-foreground">{endLabel}</span>
        )}
      </div>

      {/* Last child so it enters the root's view only once the rows above are past.
          Given a hairline of height because a zero-sized box is not reliably observed. */}
      <div ref={sentinelRef} className="h-px" aria-hidden />
    </div>
  );
}
