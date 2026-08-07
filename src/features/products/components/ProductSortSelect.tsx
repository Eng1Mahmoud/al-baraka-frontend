"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProductFilters } from "@/features/products/hooks/useProductFilters";
import type { ProductSort } from "@/features/products/types/product";

const SORT_LABELS: Record<ProductSort, string> = {
  newest: "الأحدث",
  "price-asc": "الأقل سعرًا",
  "price-desc": "الأعلى سعرًا",
  name: "الاسم (أ - ي)",
};

export function ProductSortSelect() {
  const { filters, setFilter } = useProductFilters();

  return (
    <Select
      value={filters.sort ?? "newest"}
      onValueChange={(value) => setFilter("sort", value as ProductSort)}
    >
      <SelectTrigger className="w-44" aria-label="ترتيب المنتجات">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
