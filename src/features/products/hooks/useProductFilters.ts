"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductFilters, ProductSort } from "@/features/products/types/product";

const SORT_VALUES: ProductSort[] = ["newest", "price-asc", "price-desc", "name"];

/**
 * Filters live in the URL, not in component state — so a filtered list can be
 * shared, bookmarked, and survives the back button.
 */
export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortParam = searchParams.get("sort") as ProductSort | null;

  const filters: ProductFilters = {
    category: searchParams.get("category") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    availableOnly: searchParams.get("availableOnly") === "true",
    sort: sortParam && SORT_VALUES.includes(sortParam) ? sortParam : "newest",
  };

  const setFilter = useCallback(
    (key: keyof ProductFilters, value: string | number | boolean | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === undefined || value === "" || value === false) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const activeCount = ["category", "search", "minPrice", "maxPrice", "availableOnly"].filter((key) =>
    searchParams.has(key)
  ).length;

  return { filters, setFilter, clearFilters, activeCount };
}
