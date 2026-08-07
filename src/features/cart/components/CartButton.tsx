"use client";

import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartCount } from "@/features/cart/hooks/useCart";

const cartPlurals = new Intl.PluralRules("ar-EG");

/**
 * Arabic counts three ways before it settles, and a screen reader says this label
 * out loud — "3 منتج" is the kind of wrong that a number badge shouldn't be.
 */
const describeCart = (count: number) => {
  switch (cartPlurals.select(count)) {
    case "one":
      return "منتج واحد في السلة";
    case "two":
      return "منتجين في السلة";
    case "few":
      return `${count} منتجات في السلة`;
    default:
      return `${count} منتج في السلة`;
  }
};

export function CartButton() {
  const count = useCartCount();

  return (
    <Button asChild size="sm" className="relative">
      <Link href="/cart">
        <ShoppingBasket className="size-4" aria-hidden />
        السلة
        {count > 0 && (
          <span
            className="absolute -top-1.5 -end-1.5 flex size-5 items-center justify-center rounded-full bg-fruit-tomato text-[10px] font-bold text-white"
            aria-label={describeCart(count)}
          >
            {count}
          </span>
        )}
      </Link>
    </Button>
  );
}
