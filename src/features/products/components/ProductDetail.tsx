"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Leaf, Truck, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatPrice, formatPricePerUnit } from "@/shared/lib/format";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { SOLD_OUT_LABEL, isSoldOut } from "@/features/products/lib/availability";
import { useProductBySlug } from "@/features/products/hooks/useProducts";

export function ProductDetail({ slug }: { slug: string }) {
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="rounded-2xl border border-dashed py-16 text-center">
        <p className="mb-4 text-sm text-muted-foreground">المنتج ده مش موجود أو اتشال.</p>
        <Link href="/products" className="text-sm font-semibold text-brand-700 underline">
          تصفح كل المنتجات
        </Link>
      </div>
    );
  }

  const price = product.discountPrice ?? product.price;
  const image = product.images[activeImage];
  const soldOut = isSoldOut(product);

  return (
    <>
      <nav aria-label="مسار التصفح" className="mb-5 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-brand-700">
          الرئيسية
        </Link>
        <ChevronLeft className="size-3.5" aria-hidden />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-700">
          {product.category.name}
        </Link>
        <ChevronLeft className="size-3.5" aria-hidden />
        <span className="text-brand-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-brand-100">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className={cn("object-cover", soldOut && "grayscale")}
                priority
              />
            ) : (
              <span className="flex h-full items-center justify-center text-brand-500">
                <Leaf className="size-16" aria-hidden />
              </span>
            )}

            {soldOut && (
              <span className="absolute top-3 start-3 rounded-full bg-brand-900/90 px-3.5 py-1.5 text-sm font-bold text-white">
                {SOLD_OUT_LABEL}
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`صورة ${index + 1}`}
                  aria-current={index === activeImage}
                  className={cn(
                    "relative size-16 overflow-hidden rounded-lg border-2 transition-colors",
                    index === activeImage ? "border-brand-700" : "border-transparent"
                  )}
                >
                  <Image src={url} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Badge variant="secondary" className="mb-3">
            {product.category.name}
          </Badge>

          <h1 className="mb-2 font-display text-3xl font-extrabold text-brand-900">{product.name}</h1>

          <p className="mb-4 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-extrabold text-brand-700">
              {formatPricePerUnit(price, product.unit)}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </p>

          {product.description && (
            <p className="mb-5 leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          <p className="mb-5 text-sm">
            {soldOut ? (
              <span className="text-destructive">غير متاح حاليًا</span>
            ) : product.stock <= 5 ? (
              <span className="text-status-pending">آخر {product.stock} متاحين</span>
            ) : (
              <span className="text-brand-700">متاح للطلب</span>
            )}
          </p>

          <AddToCartButton product={product} className="w-full sm:w-auto" />

          <Separator className="my-6" />

          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <Truck className="size-4 text-brand-500" aria-hidden />
              سعر التوصيل حسب منطقتك — تختارها عند إتمام الطلب
            </li>
            <li className="flex items-center gap-2.5">
              <Wallet className="size-4 text-brand-500" aria-hidden />
              الدفع كاش عند الاستلام
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
