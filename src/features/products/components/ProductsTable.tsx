"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatPricePerUnit } from "@/shared/lib/format";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useInfiniteProducts, useDeleteProduct } from "@/features/products/hooks/useProducts";
import { DeleteButton } from "@/shared/components/DeleteButton";
import { InfiniteScrollArea } from "@/shared/components/InfiniteScrollArea";
import { SearchInput } from "@/shared/components/SearchInput";

/** A table row is compact, so a page can be larger than the storefront's card grid. */
const PAGE_SIZE = 20;

function ProductThumb({ image, className }: { image?: string; className?: string }) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden rounded-lg bg-brand-100", className)}>
      {image ? (
        <Image src={image} alt="" fill sizes="56px" className="object-cover" />
      ) : (
        <span className="flex h-full items-center justify-center text-brand-500">
          <Leaf className="size-4" aria-hidden />
        </span>
      )}
    </span>
  );
}

/** The Select has no empty value, so "all" stands in for no category filter. */
const ALL_CATEGORIES = "all";

export function ProductsTable() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);

  const { data: categories = [] } = useCategories();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } =
    useInfiniteProducts(
      {
        search: search || undefined,
        category: category === ALL_CATEGORIES ? undefined : category,
      },
      PAGE_SIZE
    );

  const deleteProduct = useDeleteProduct();
  const products = data?.pages.flatMap((page) => page.items) ?? [];

  // Rendered in every branch below: filters that hide themselves the moment they
  // return nothing leave no way to undo the term that emptied the list.
  const filters = (
    <div className="flex flex-col gap-2 sm:flex-row">
      <SearchInput
        value={search}
        onChange={setSearch}
        label="ابحث في المنتجات"
        placeholder="ابحث باسم المنتج..."
        className="sm:flex-1"
      />

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full sm:w-48" aria-label="تصفية بالتصنيف">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_CATEGORIES}>كل التصنيفات</SelectItem>
          {categories.map((item) => (
            // Filtered by slug, which is what the list endpoint takes.
            <SelectItem key={item._id} value={item.slug}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {filters}
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="space-y-4">
        {filters}
        <p className="rounded-xl border border-dashed bg-card py-10 text-center text-sm text-muted-foreground">
          {search || category !== ALL_CATEGORIES
            ? "مفيش منتج مطابق لاختياراتك."
            : "لا توجد منتجات بعد. ابدأ بإضافة أول منتج."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filters}

      <InfiniteScrollArea
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isFetchNextPageError={isFetchNextPageError}
        fetchNextPage={fetchNextPage}
        endLabel="وصلت لآخر المنتجات"
        // The card chrome moves onto the scroll box itself from md up, so the sticky
        // header below has an opaque surface to sit on as rows pass under it.
        className="md:rounded-xl md:border md:bg-card"
      >
        {/* Cards on phones, table from md up. */}
        <ul className="space-y-3 md:hidden">
          {products.map((product) => (
            <li key={product._id} className="rounded-xl border bg-card p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <ProductThumb image={product.images[0]} className="size-14" />
                  <div className="min-w-0">
                    <p className="font-medium text-brand-900">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category.name}</p>
                  </div>
                </div>
                <Badge variant={product.isAvailable ? "default" : "secondary"}>
                  {product.isAvailable ? "متاح" : "غير متاح"}
                </Badge>
              </div>

              <p className="mb-1 text-sm font-bold text-brand-700">
                {formatPricePerUnit(product.discountPrice ?? product.price, product.unit)}
              </p>
              <p className="mb-3 text-xs text-muted-foreground">المخزون: {product.stock}</p>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/dashboard/products/${product._id}`}>
                    <Pencil className="size-4" aria-hidden />
                    تعديل
                  </Link>
                </Button>
                <DeleteButton
                  title={`حذف "${product.name}"؟`}
                  description="سيُحذف المنتج نهائيًا من المتجر. الطلبات السابقة تحتفظ ببياناتها."
                  onConfirm={() => deleteProduct.mutate(product._id)}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Table>
            {/* Stays put as rows scroll under it — the column names are the only thing
                telling a bare row of numbers what it means. */}
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead>المنتج</TableHead>
                <TableHead>التصنيف</TableHead>
                <TableHead>السعر / الوحدة</TableHead>
                <TableHead>المخزون</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <ProductThumb image={product.images[0]} className="size-11" />
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.category.name}</TableCell>
                  <TableCell>
                    {formatPricePerUnit(product.discountPrice ?? product.price, product.unit)}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.isAvailable ? "default" : "secondary"}>
                      {product.isAvailable ? "متاح" : "غير متاح"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/products/${product._id}`}>
                          <Pencil className="size-4" aria-hidden />
                          تعديل
                        </Link>
                      </Button>
                      <DeleteButton
                        title={`حذف "${product.name}"؟`}
                        description="سيُحذف المنتج نهائيًا من المتجر. الطلبات السابقة تحتفظ ببياناتها."
                        onConfirm={() => deleteProduct.mutate(product._id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </InfiniteScrollArea>
    </div>
  );
}
