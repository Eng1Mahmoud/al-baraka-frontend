"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { useProductFilters } from "@/features/products/hooks/useProductFilters";

/** On small screens the filter panel lives in a drawer instead of a sidebar. */
export function MobileFiltersSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeCount } = useProductFilters();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <SlidersHorizontal className="size-4" aria-hidden />
          تصفية
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto p-4">
        <SheetTitle className="sr-only">تصفية المنتجات</SheetTitle>
        <ProductFilters />
        <Button className="mt-4 w-full" onClick={() => setIsOpen(false)}>
          عرض النتائج
        </Button>
      </SheetContent>
    </Sheet>
  );
}
