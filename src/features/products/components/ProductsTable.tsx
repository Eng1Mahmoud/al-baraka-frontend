"use client";

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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatPricePerUnit } from "@/shared/lib/format";
import { useProducts, useDeleteProduct } from "@/features/products/hooks/useProducts";
import { DeleteButton } from "@/shared/components/DeleteButton";

/**
 * The product photo, at the size it takes to tell two crates of tomatoes apart in a
 * long list. Decorative — `alt=""` — because the name sits right beside it and a
 * screen reader would otherwise read every product twice.
 */
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

export function ProductsTable() {
  const { data, isLoading } = useProducts({ limit: 50 });
  const deleteProduct = useDeleteProduct();

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />;

  if (!data?.items.length) {
    return (
      <p className="rounded-xl border border-dashed bg-card py-10 text-center text-sm text-muted-foreground">
        لا توجد منتجات بعد. ابدأ بإضافة أول منتج.
      </p>
    );
  }

  return (
    <>
      {/* Cards on phones, table from md up. */}
      <ul className="space-y-3 md:hidden">
        {data.items.map((product) => (
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

      <div className="hidden overflow-x-auto rounded-xl border bg-card md:block">
        <Table>
          <TableHeader>
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
            {data.items.map((product) => (
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
    </>
  );
}
