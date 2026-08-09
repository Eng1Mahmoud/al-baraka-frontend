"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, ShoppingBasket, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/shared/lib/format";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useCartHydrated, useValidatedCart } from "@/features/cart/hooks/useCart";
import { CartLine } from "@/features/cart/components/CartLine";
import { CartSkeleton } from "@/features/cart/components/CartSkeleton";

export function CartView() {
  const isHydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const reconcile = useCartStore((state) => state.reconcile);
  const { data: cart, isLoading, isError, isFetching } = useValidatedCart();

  // Only the very first load gets a skeleton. Re-validating after a quantity change
  // keeps the previous result on screen (see `useValidatedCart`), so there is
  // nothing to stand in for.
  //
  // Before hydration the stored cart hasn't been read yet and the row count is
  // genuinely unknown, so it guesses two — small enough not to overshoot an empty
  // cart, and it only holds for one render.
  if (!isHydrated || (isLoading && items.length > 0)) {
    return <CartSkeleton lines={isHydrated ? items.length : 2} />;
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-card py-16 text-center">
        <ShoppingBasket className="mx-auto mb-3 size-10 text-brand-300" aria-hidden />
        <p className="mb-5 text-sm text-muted-foreground">السلة فاضية.</p>
        <Button asChild>
          <Link href="/products">
            ابدأ التسوق
            <ArrowLeft className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    );
  }

  if (isError || !cart) {
    return (
      <p className="rounded-2xl border border-dashed py-12 text-center text-sm text-destructive">
        تعذر تحديث السلة من الخادم. حدّث الصفحة وحاول تاني.
      </p>
    );
  }

  // While the new totals are in flight the held-over result still lists whatever was
  // just deleted, so a removed line would sit there for a round trip. The local cart
  // is authoritative about what is *in* the cart; the server about what it costs.
  const lines = cart.items.filter((line) =>
    items.some((item) => item.productId === line.productId)
  );

  const hasIssues = lines.some((item) => item.removed || item.issue);

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_300px] md:items-start">
      <ul className="divide-y rounded-2xl border bg-card">
        {lines.map((item) => (
          <li key={item.productId} className="p-4">
            <CartLine item={item} />
          </li>
        ))}
      </ul>

      <aside className="rounded-2xl border bg-card p-5 md:sticky md:top-24">
        <h2 className="mb-4 font-semibold text-brand-900">ملخص الطلب</h2>

        <dl
          aria-busy={isFetching}
          className={cn("space-y-2.5 text-sm transition-opacity", isFetching && "opacity-60")}
        >
          <div className="flex justify-between">
            <dt className="text-muted-foreground">المجموع</dt>
            <dd className="font-medium">{formatPrice(cart.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">التوصيل</dt>
            <dd className="font-medium">
              {cart.requiresArea ? (
                <span className="text-xs text-muted-foreground">حسب المنطقة</span>
              ) : cart.deliveryFee > 0 ? (
                formatPrice(cart.deliveryFee)
              ) : (
                "مجاني"
              )}
            </dd>
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between text-base">
            <dt className="font-semibold text-brand-900">الإجمالي</dt>
            <dd className="font-extrabold text-brand-700">{formatPrice(cart.total)}</dd>
          </div>
        </dl>

        {cart.requiresArea && (
          <p className="mt-3 text-xs text-muted-foreground">
            سعر التوصيل بيتحدد بعد ما تختار منطقتك في الخطوة الجاية.
          </p>
        )}

        {hasIssues && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3">
            <p className="mb-1 flex items-center gap-2 text-xs font-bold text-destructive">
              <TriangleAlert className="size-4 shrink-0" aria-hidden />
              في حاجات في السلة اتغيرت
            </p>
            <p className="mb-3 text-xs text-destructive/90">
              دي منتجات خلصت أو اتشالت من المتجر وإحنا مش واخدين بالنا. صلّح السلة
              هيشيل اللي مابقاش موجود ويظبط الكميات على المتاح دلوقتي.
            </p>

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full bg-card"
              onClick={() => {
                reconcile(cart.items);
                toast.success("تم تحديث السلة");
              }}
            >
              <RefreshCw className="size-4" aria-hidden />
              صلّح السلة
            </Button>
          </div>
        )}

        <Button asChild={cart.canCheckout} disabled={!cart.canCheckout} className="mt-5 w-full" size="lg">
          {cart.canCheckout ? (
            <Link href="/checkout">
              أكمل الطلب
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
          ) : (
            <span>أكمل الطلب</span>
          )}
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">الدفع كاش عند الاستلام</p>
      </aside>
    </div>
  );
}
