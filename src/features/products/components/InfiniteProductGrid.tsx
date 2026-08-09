"use client";

import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useIntersection } from "@/shared/hooks/useIntersection";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useInfiniteProducts } from "@/features/products/hooks/useProducts";
import { useProductFilters } from "@/features/products/hooks/useProductFilters";

export function InfiniteProductGrid() {
  const { filters, clearFilters, activeCount } = useProductFilters();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts(filters);

  useIntersection(sentinelRef, fetchNextPage, hasNextPage && !isFetchingNextPage);

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
      </div>

      <div ref={sentinelRef} className="flex justify-center py-6">
        {isFetchingNextPage ? (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            بنحمّل المزيد...
          </span>
        ) : hasNextPage ? (
          <Button variant="outline" onClick={() => fetchNextPage()}>
            عرض المزيد
          </Button>
        ) : (
          <span className="text-sm text-muted-foreground">وصلت لآخر المنتجات</span>
        )}
      </div>
    </div>
  );
}
