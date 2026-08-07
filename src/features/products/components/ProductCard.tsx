import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatPricePerUnit } from "@/shared/lib/format";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { SOLD_OUT_LABEL, isSoldOut } from "@/features/products/lib/availability";
import type { Product } from "@/features/products/types/product";

interface ProductCardProps {
  product: Product;
  /** Shows the PLU sticker. Reserve it for genuinely exceptional items. */
  highlight?: "fresh" | "discount" | null;
}

const STICKER = {
  fresh: { label: "طازج اليوم", className: "bg-fruit-lemon text-foreground" },
  discount: { label: "خصم", className: "bg-fruit-tomato text-white" },
} as const;

export function ProductCard({ product, highlight = null }: ProductCardProps) {
  const effectivePrice = product.discountPrice ?? product.price;
  const image = product.images[0];
  const soldOut = isSoldOut(product);

  // A discount on something nobody can buy is just noise, so the sticker stands down
  // and lets the sold-out badge be the only claim on the card.
  const sticker = soldOut ? null : (highlight ?? (product.discountPrice ? "discount" : null));

  return (
    <article className="relative flex h-full flex-col rounded-2xl border bg-card p-3.5 transition-shadow hover:shadow-md">
      {sticker && <span className={`plu-sticker ${STICKER[sticker].className}`}>{STICKER[sticker].label}</span>}

      <Link
        href={`/products/${product.slug}`}
        className="flex-1 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div className="relative mb-3 aspect-4/3 overflow-hidden rounded-xl bg-brand-100">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 240px"
              className={cn("object-cover", soldOut && "grayscale")}
            />
          ) : (
            <span className="flex h-full items-center justify-center text-brand-500">
              <Leaf className="size-8" aria-hidden />
            </span>
          )}

          {/* Sold-out items stay on the shelf — a customer who came looking for one
              deserves an answer, not a product that quietly vanished. The label sits
              at the top where the eye lands first; the grey photo backs it up. */}
          {soldOut && (
            <span className="absolute top-2 start-2 rounded-full bg-brand-900/90 px-2.5 py-1 text-[11px] font-bold text-white">
              {SOLD_OUT_LABEL}
            </span>
          )}
        </div>

        <h3 className="font-display text-base font-bold text-brand-900">{product.name}</h3>
        <p className="mb-2 text-xs text-muted-foreground">{product.category.name}</p>

        <p className="flex flex-wrap items-baseline gap-x-2">
          <span
            className={cn(
              "text-lg font-extrabold",
              soldOut ? "text-muted-foreground" : "text-brand-700"
            )}
          >
            {formatPricePerUnit(effectivePrice, product.unit)}
          </span>
          {product.discountPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
          )}
        </p>
      </Link>

      <div className="mt-3">
        <AddToCartButton product={product} className="w-full justify-center" />
      </div>
    </article>
  );
}
