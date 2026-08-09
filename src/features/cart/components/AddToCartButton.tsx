"use client";

import { Minus, Plus, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useCartHydrated } from "@/features/cart/hooks/useCart";
import { isSoldOut } from "@/features/products/lib/availability";
import type { Product } from "@/features/products/types/product";

export function AddToCartButton({ product, className }: { product: Product; className?: string }) {
  const isHydrated = useCartHydrated();
  const item = useCartStore((state) => state.items.find((line) => line.productId === product._id));
  const add = useCartStore((state) => state.add);
  const setQuantity = useCartStore((state) => state.setQuantity);

  // The "غير متاح" label already sits on the product itself, so the button doesn't
  // repeat it — it stays the add button, switched off. What it does is unchanged;
  // it just can't be done right now.
  if (isSoldOut(product)) {
    return (
      <Button disabled size="sm" className={className}>
        <ShoppingBasket className="size-4" aria-hidden />
        أضف للسلة
      </Button>
    );
  }

  if (!isHydrated || !item) {
    return (
      <Button
        size="sm"
        className={className}
        onClick={() => {
          add(product);
          toast.success(`تمت إضافة ${product.name} للسلة`);
        }}
      >
        <ShoppingBasket className="size-4" aria-hidden />
        أضف للسلة
      </Button>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className ?? ""}`}>
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => setQuantity(product._id, item.quantity - 1)}
        aria-label="تقليل الكمية"
      >
        <Minus className="size-3.5" aria-hidden />
      </Button>

      <span className="min-w-8 text-center text-sm font-bold" aria-live="polite">
        {item.quantity}
      </span>

      <Button
        variant="outline"
        size="icon"
        className="size-8"
        disabled={item.quantity >= product.stock}
        onClick={() => setQuantity(product._id, item.quantity + 1)}
        aria-label="زيادة الكمية"
      >
        <Plus className="size-3.5" aria-hidden />
      </Button>
    </div>
  );
}
