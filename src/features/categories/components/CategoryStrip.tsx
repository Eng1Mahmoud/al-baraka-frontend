"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/categories/hooks/useCategories";

export function CategoryStrip() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-11 w-28 rounded-full" />
        ))}
      </div>
    );
  }

  if (!categories?.length) return null;

  return (
    <nav aria-label="التصنيفات" className="flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/products?category=${category.slug}`}
          className="shrink-0 rounded-full border bg-card px-5 py-2.5 text-sm font-semibold text-brand-900 transition-colors hover:border-brand-500 hover:bg-brand-100"
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
