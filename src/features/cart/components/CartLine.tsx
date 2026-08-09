"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, formatPricePerUnit } from "@/shared/lib/format";
import { useCartStore } from "@/features/cart/store/cartStore";
import type { ValidatedCartItem } from "@/features/cart/types/cart";

export function CartLine({ item }: { item: ValidatedCartItem }) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  const remove = useCartStore((state) => state.remove);

  // The count comes from the local cart, not the server's echo of it, so tapping
  // "+" moves the number on the same frame instead of waiting out a round trip.
  // Price and stock still come from the server — those are its call, not ours.
  const quantity = useCartStore(
    (state) => state.items.find((line) => line.productId === item.productId)?.quantity ?? item.quantity
  );

  if (item.removed) {
    return (
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-sm text-muted-foreground">{item.issue}</p>
        <Button variant="ghost" size="sm" className="shrink-0" onClick={() => remove(item.productId)}>
          <Trash2 className="size-4" aria-hidden />
          إزالة
        </Button>
      </div>
    );
  }

  const maxReached = item.stock != null && quantity >= item.stock;
  const overStock = item.stock != null && item.stock > 0 && quantity > item.stock;

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-brand-100 sm:size-20">
        {item.image ? (
          <Image src={item.image} alt="" fill sizes="(min-width: 640px) 80px, 64px" className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-brand-500">
            <Leaf className="size-6" aria-hidden />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {/*
          The line total sits beside the name rather than at the end of the row.
          Kept as a third column it took width from the stepper, and on a 320px screen
          the stepper needs more than what was left — the buttons spilled past the card.
        */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/products/${item.slug}`} className="font-semibold text-brand-900 hover:underline">
              {item.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatPricePerUnit(item.price ?? 0, item.unit ?? "")}
            </p>
          </div>

          <p className="shrink-0 font-bold text-brand-700">
            {formatPrice((item.price ?? 0) * quantity)}
          </p>
        </div>

        {item.issue && (
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-destructive">
            {item.issue}

            {overStock && (
              <button
                type="button"
                onClick={() => setQuantity(item.productId, item.stock!)}
                className="font-bold underline underline-offset-2 hover:no-underline"
              >
                خلي الكمية {item.stock}
              </button>
            )}
          </p>
        )}

        <div className="mt-2 flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setQuantity(item.productId, quantity - 1)}
            aria-label="تقليل الكمية"
          >
            <Minus className="size-3.5" aria-hidden />
          </Button>

          <span className="min-w-8 text-center text-sm font-bold">{quantity}</span>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={maxReached}
            onClick={() => setQuantity(item.productId, quantity + 1)}
            aria-label="زيادة الكمية"
          >
            <Plus className="size-3.5" aria-hidden />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="ms-1 text-destructive hover:text-destructive sm:ms-2"
            onClick={() => remove(item.productId)}
            aria-label="إزالة من السلة"
          >
            <Trash2 className="size-4" aria-hidden />
            {/* The icon carries it on a phone; the word is what makes it unmissable
                once there is room for it. */}
            <span className="hidden sm:inline">إزالة</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
