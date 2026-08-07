import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { MobileFiltersSheet } from "@/features/products/components/MobileFiltersSheet";
import { ProductSortSelect } from "@/features/products/components/ProductSortSelect";
import { InfiniteProductGrid } from "@/features/products/components/InfiniteProductGrid";

export const metadata: Metadata = {
  title: "كل المنتجات",
  description: "اتصفح كل الخضار والفاكهة المتاحة، مع الفلترة بالقسم والسعر.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 md:mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-900 md:text-3xl">كل المنتجات</h1>
          <p className="text-sm text-muted-foreground">اختار اللي محتاجه وضيفه للسلة.</p>
        </div>

        {/* Filters read the URL, so anything using them needs a Suspense boundary. */}
        <div className="flex items-center gap-2">
          <Suspense fallback={<Skeleton className="h-9 w-20" />}>
            <MobileFiltersSheet />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-9 w-44" />}>
            <ProductSortSelect />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block">
          <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
            <ProductFilters />
          </Suspense>
        </aside>

        <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
          <InfiniteProductGrid />
        </Suspense>
      </div>
    </div>
  );
}
