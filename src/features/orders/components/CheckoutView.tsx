"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBasket, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/shared/lib/format";
import { AppForm } from "@/shared/components/forms/AppForm";
import { SelectField, TextField, TextareaField } from "@/shared/components/forms/fields";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useCartHydrated, useValidatedCart } from "@/features/cart/hooks/useCart";
import { useDeliveryAreas } from "@/features/delivery-areas/hooks/useDeliveryAreas";
import { useCreateOrder } from "@/features/orders/hooks/useCreateOrder";
import { OrderPlaced } from "@/features/orders/components/OrderPlaced";
import { CheckoutSkeleton } from "@/features/orders/components/CheckoutSkeleton";
import { createCheckoutSchema } from "@/features/orders/schemas/checkoutSchema";

export function CheckoutView() {
  const isHydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const { data: areas = [], isLoading: isLoadingAreas } = useDeliveryAreas(true);
  const [areaId, setAreaId] = useState<string>("");

  // Re-prices the delivery line as soon as an area is picked.
  const { data: cart, isLoading } = useValidatedCart(areaId || undefined);
  const createOrder = useCreateOrder();
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);

  const requiresArea = areas.length > 0;

  if (placedOrderNumber) {
    return <OrderPlaced orderNumber={placedOrderNumber} />;
  }

  // The local cart already knows how many lines the summary will have, so the outline
  // is the right height before the server has priced anything. Before hydration it
  // hasn't been read yet and two is the safe guess — it holds for one render.
  if (!isHydrated || isLoadingAreas || (isLoading && items.length > 0)) {
    return <CheckoutSkeleton lines={isHydrated ? items.length : 2} withArea={requiresArea || isLoadingAreas} />;
  }

  if (!items.length || !cart) {
    return (
      <div className="rounded-2xl border border-dashed bg-card py-16 text-center">
        <ShoppingBasket className="mx-auto mb-3 size-10 text-brand-300" aria-hidden />
        <p className="mb-5 text-sm text-muted-foreground">مفيش حاجة في السلة عشان تكمل الطلب.</p>
        <Button asChild>
          <Link href="/products">تصفح المنتجات</Link>
        </Button>
      </div>
    );
  }

  // Checked here as well as on the cart page: a cart can go stale while this form is
  // being filled in, and an order is created whole or not at all. Better to send the
  // customer back to the one screen that can fix it than to let them finish typing
  // and lose it to a toast.
  if (!cart.canCheckout) {
    return (
      <div className="rounded-2xl border border-dashed bg-card py-14 text-center">
        <TriangleAlert className="mx-auto mb-3 size-10 text-destructive" aria-hidden />
        <p className="mb-1 font-semibold text-brand-900">في حاجات في السلة اتغيرت</p>
        <p className="mx-auto mb-5 max-w-sm text-sm text-muted-foreground">
          منتجات خلصت أو اتشالت من المتجر بعد ما حطيتها في السلة. راجع السلة وصلّحها
          وارجع كمّل.
        </p>
        <Button asChild>
          <Link href="/cart">
            راجع السلة
            <ArrowLeft className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-bold text-brand-900 md:text-3xl">إتمام الطلب</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_300px] md:items-start">
        <AppForm
          // Built from runtime data: the area field is only required once the store
          // actually has delivery areas configured.
          schema={createCheckoutSchema(requiresArea)}
          defaultValues={{ deliveryAreaId: "" }}
          isPending={createOrder.isPending}
          submitLabel="تأكيد الطلب"
          submitClassName="w-full"
          className="space-y-5 rounded-2xl border bg-card p-5"
          onSubmit={async (values) => {
            const order = await createOrder.mutateAsync(values);
            setPlacedOrderNumber(order.orderNumber);
          }}
        >
          <p className="text-sm text-muted-foreground">
            مش محتاج حساب — سيب بياناتك وهنتواصل معاك لتأكيد الطلب.
          </p>

          <TextField name="name" label="الاسم" autoComplete="name" placeholder="محمد أحمد" required />

          <TextField
            name="phone"
            label="رقم الهاتف"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            placeholder="01012345678"
            hint="هنتصل بيك عليه لتأكيد الطلب"
            required
          />

          {requiresArea && (
            <SelectField
              name="deliveryAreaId"
              label="منطقة التوصيل"
              placeholder="اختر المنطقة"
              hint="سعر التوصيل بيتحدد حسب المنطقة"
              required
              // Mirrored into local state as well as the form: the cart query is keyed
              // by area, so picking one re-prices the delivery line in the summary.
              onValueChange={setAreaId}
              options={areas.map((area) => ({
                value: area._id,
                label: `${area.name} — ${area.price > 0 ? formatPrice(area.price) : "توصيل مجاني"}`,
              }))}
            />
          )}

          <TextareaField
            name="address"
            label="العنوان بالتفصيل"
            rows={3}
            autoComplete="street-address"
            placeholder="الشارع، رقم العقار، الدور، الشقة، وأقرب علامة مميزة"
            required
          />

          <TextareaField
            name="notes"
            label="ملاحظات للطلب"
            rows={2}
            placeholder="مثال: الطماطم تكون ناضجة"
          />
        </AppForm>

        <aside className="rounded-2xl border bg-card p-5 md:sticky md:top-24">
          <h2 className="mb-4 font-semibold text-brand-900">ملخص الطلب</h2>

          <ul className="mb-4 space-y-2 text-sm">
            {cart.items
              .filter((item) => !item.removed && !item.issue)
              .map((item) => (
                <li key={item.productId} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0">{formatPrice(item.lineTotal ?? 0)}</span>
                </li>
              ))}
          </ul>

          <Separator className="my-3" />

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">المجموع</dt>
              <dd>{formatPrice(cart.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                التوصيل
                {cart.selectedArea && (
                  <span className="block text-xs">{cart.selectedArea.name}</span>
                )}
              </dt>
              <dd>
                {cart.requiresArea && !cart.selectedArea ? (
                  <span className="text-xs text-status-pending">اختر المنطقة</span>
                ) : cart.deliveryFee > 0 ? (
                  formatPrice(cart.deliveryFee)
                ) : (
                  "مجاني"
                )}
              </dd>
            </div>
            <div className="flex justify-between pt-2 text-base">
              <dt className="font-semibold text-brand-900">الإجمالي</dt>
              <dd className="font-extrabold text-brand-700">{formatPrice(cart.total)}</dd>
            </div>
          </dl>

          <p className="mt-4 rounded-lg bg-brand-50 p-3 text-xs text-brand-900">
            طريقة الدفع: كاش عند الاستلام
          </p>

          <Button asChild variant="ghost" size="sm" className="mt-3 w-full">
            <Link href="/cart">
              <ArrowLeft className="size-4 rotate-180" aria-hidden />
              تعديل السلة
            </Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
