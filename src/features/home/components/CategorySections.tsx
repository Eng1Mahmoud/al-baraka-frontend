"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProductSlider } from "@/features/products/components/ProductSlider";
import { CrateIllustration } from "@/features/home/components/CrateIllustration";
import { useHomeSections } from "@/features/products/hooks/useProducts";

export function CategorySections() {
  const { data: sections, isLoading, isError } = useHomeSections();

  if (isLoading) {
    return (
      <div className="space-y-12">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-7 w-40" />

            {/*
              Scrolls like the slider it stands in for. Four cards overflow a phone,
              and the body is `overflow-x-hidden`, so a plain flex row would just be
              sliced off mid-card — reading as a broken layout rather than a rail.

              The widths mirror ProductSlider's `basis-44/52/56` minus the `ps-4`
              its items carry, and `gap-4` replaces that padding, so the placeholder
              rail lands where the real cards will.
            */}
            <div className="no-scrollbar flex gap-4 overflow-x-auto py-3">
              {Array.from({ length: 4 }).map((__, cardIndex) => (
                <Skeleton
                  key={cardIndex}
                  className="h-64 w-40 shrink-0 rounded-2xl sm:w-48 lg:w-52"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-2xl border border-dashed py-10 text-center text-sm text-destructive">
        تعذر تحميل المنتجات. حدّث الصفحة وحاول تاني.
      </p>
    );
  }

  if (!sections?.length) {
    return (
      <div className="rounded-2xl border border-dashed px-6 py-12 text-center">
        <CrateIllustration className="mx-auto mb-4 w-36" />
        <p className="text-sm text-muted-foreground">
          لسه مفيش منتجات معروضة. تابعنا، المنتجات في الطريق.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {sections.map(({ category, products }) => (
        <section key={category._id} aria-labelledby={`category-${category.slug}`}>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2
                id={`category-${category.slug}`}
                className="font-display text-2xl font-bold text-brand-900"
              >
                {category.name}
              </h2>
              <p className="text-sm text-muted-foreground">{products.length} منتج متاح</p>
            </div>

            <Button asChild variant="ghost" size="sm" className="shrink-0 text-brand-700">
              <Link href={`/products?category=${category.slug}`}>
                عرض الكل
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <ProductSlider products={products} />
        </section>
      ))}
    </div>
  );
}
