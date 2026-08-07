"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useProducts } from "@/features/products/hooks/useProducts";
import type { ProductFilters } from "@/features/products/types/product";

export function ProductGrid({ filters = { availableOnly: true } }: { filters?: ProductFilters }) {
  const { data, isLoading, isError } = useProducts(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="py-10 text-center text-sm text-destructive">تعذر تحميل المنتجات، حدّث الصفحة.</p>;
  }

  if (!data?.items.length) {
    return (
      <p className="rounded-2xl border border-dashed py-10 text-center text-sm text-muted-foreground">
        لا توجد منتجات بعد. أضف أول منتج من لوحة التحكم.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {data.items.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
