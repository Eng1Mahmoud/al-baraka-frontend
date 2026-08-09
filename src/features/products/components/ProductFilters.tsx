"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { usePriceBounds } from "@/features/products/hooks/useProducts";
import { useProductFilters } from "@/features/products/hooks/useProductFilters";

export function ProductFilters() {
  const { filters, setFilter, clearFilters, activeCount } = useProductFilters();
  const { data: categories = [] } = useCategories();
  const { data: bounds } = usePriceBounds();

  // Typing shouldn't refetch on every keystroke.
  const [searchDraft, setSearchDraft] = useState(filters.search ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((filters.search ?? "") !== searchDraft) setFilter("search", searchDraft || undefined);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchDraft, filters.search, setFilter]);

  return (
    <div className="space-y-6 rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-brand-900">تصفية</h2>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="size-3.5" aria-hidden />
            مسح ({activeCount})
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="search">ابحث</Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="search"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="طماطم، موز..."
            className="ps-9"
          />
        </div>
      </div>

      <Separator />

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium">القسم</legend>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("category", undefined)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              !filters.category
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:border-brand-500 hover:bg-brand-50"
            )}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => setFilter("category", category.slug)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                filters.category === category.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:border-brand-500 hover:bg-brand-50"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </fieldset>

      <Separator />

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium">السعر</legend>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder={bounds ? `من ${bounds.min}` : "من"}
            defaultValue={filters.minPrice ?? ""}
            onBlur={(event) => setFilter("minPrice", event.target.value || undefined)}
            aria-label="أقل سعر"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            min={0}
            inputMode="numeric"
            placeholder={bounds ? `إلى ${bounds.max}` : "إلى"}
            defaultValue={filters.maxPrice ?? ""}
            onBlur={(event) => setFilter("maxPrice", event.target.value || undefined)}
            aria-label="أعلى سعر"
          />
        </div>
      </fieldset>

      <Separator />

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="availableOnly" className="font-normal">
          المتاح فقط
        </Label>
        <Switch
          id="availableOnly"
          checked={Boolean(filters.availableOnly)}
          onCheckedChange={(checked) => setFilter("availableOnly", checked)}
        />
      </div>
    </div>
  );
}
