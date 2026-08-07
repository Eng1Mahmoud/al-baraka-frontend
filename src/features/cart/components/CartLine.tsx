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
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{item.issue}</p>
        <Button variant="ghost" size="sm" onClick={() => remove(item.productId)}>
          <Trash2 className="size-4" aria-hidden />
          إزالة
        </Button>
      </div>
    );
  }

  const maxReached = item.stock != null && quantity >= item.stock;
  const overStock = item.stock != null && item.stock > 0 && quantity > item.stock;

  return (
    <div className="flex gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-brand-100">
        {item.image ? (
          <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-brand-500">
            <Leaf className="size-6" aria-hidden />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link href={`/products/${item.slug}`} className="font-semibold text-brand-900 hover:underline">
          {item.name}
        </Link>
        <p className="text-xs text-muted-foreground">
          {formatPricePerUnit(item.price ?? 0, item.unit ?? "")}
        </p>

        {item.issue && (
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-destructive">
            {item.issue}

            {/* Asking for more than the shop has is the one issue with an obvious
                fix, so offer it rather than making them tap "−" down to it. */}
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
            className="ms-2 text-destructive hover:text-destructive"
            onClick={() => remove(item.productId)}
          >
            <Trash2 className="size-4" aria-hidden />
            إزالة
          </Button>
        </div>
      </div>

      {/* Recomputed from the live count for the same reason — the server works it
          out exactly this way, so it lands on the same number a moment later. */}
      <p className="shrink-0 font-bold text-brand-700">
        {formatPrice((item.price ?? 0) * quantity)}
      </p>
    </div>
  );
}
