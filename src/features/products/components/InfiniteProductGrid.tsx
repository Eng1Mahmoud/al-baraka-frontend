"use client";

import { useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useIntersection } from "@/shared/hooks/useIntersection";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useInfiniteProducts } from "@/features/products/hooks/useProducts";
import { useProductFilters } from "@/features/products/hooks/useProductFilters";

/** One row's worth, so the grid grows by a believable amount while the page lands. */
const NEXT_PAGE_PLACEHOLDERS = 4;

export function InfiniteProductGrid() {
  const { filters, clearFilters, activeCount } = useProductFilters();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteProducts(filters);

  // Wrapped rather than handed to the JSX directly: `isFetchNextPageError` discriminates
  // TanStack's result union, so inside a branch guarded on it every co-destructured
  // binding — `fetchNextPage` included — narrows to `never`. This alias is outside
  // that union, and stable because `fetchNextPage` itself is.
  const loadNextPage = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  // The trigger fires while the sentinel is still 300px below the fold, and is held
  // off while a page is already in flight or the last one failed — otherwise a
  // failing request would be retried on every scroll frame.
  useIntersection(
    sentinelRef,
    loadNextPage,
    hasNextPage && !isFetchingNextPage && !isFetchNextPageError
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-2xl border border-dashed py-12 text-center text-sm text-destructive">
        تعذر تحميل المنتجات. حدّث الصفحة وحاول تاني.
      </p>
    );
  }

  const products = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed py-14 text-center">
        <p className="mb-3 text-sm text-muted-foreground">مفيش منتجات مطابقة لاختياراتك.</p>
        {activeCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            امسح الفلاتر
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{total} منتج</p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}

        {/* Placeholders in the grid itself, so the next page slots into the layout
            instead of the page jumping when it lands. */}
        {isFetchingNextPage &&
          Array.from({ length: NEXT_PAGE_PLACEHOLDERS }).map((_, index) => (
            <Skeleton key={`next-${index}`} className="h-64 rounded-2xl" />
          ))}
      </div>

      {/*
        The sentinel sits 300px before the true end (see useIntersection's rootMargin),
        so the next page is already in flight by the time the user gets here.
      */}
      <div ref={sentinelRef} className="flex justify-center py-6" aria-live="polite">
        {isFetchNextPageError ? (
          // The only case still needing a tap: auto-loading cannot retry itself
          // without spinning on a failing request.
          <div className="text-center">
            <p className="mb-3 text-sm text-destructive">تعذر تحميل باقي المنتجات.</p>
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
          // Reserves the strip's height so the end-message appearing does not shift
          // the page under a user who is still scrolling.
          <span className="h-5" aria-hidden />
        ) : (
          <span className="text-sm text-muted-foreground">وصلت لآخر المنتجات</span>
        )}
      </div>
    </div>
  );
}
