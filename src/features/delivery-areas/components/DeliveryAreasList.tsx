"use client";

import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/shared/lib/format";
import { useDeliveryAreas } from "@/features/delivery-areas/hooks/useDeliveryAreas";

/**
 * Where the shop delivers, and what each area costs.
 *
 * Price sits on the same line as the name because the two are one answer: "do you
 * come to me" is never asked without "and for how much". Active areas only — an area
 * switched off in the dashboard is one the shop can't serve today, and listing it
 * would promise something the checkout would then refuse.
 */
export function DeliveryAreasList() {
  const { data: areas = [], isLoading } = useDeliveryAreas(true);

  if (isLoading) {
    return (
      <ul className="grid gap-2 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <li key={index}>
            <Skeleton className="h-14 rounded-xl" />
          </li>
        ))}
      </ul>
    );
  }

  if (!areas.length) {
    return (
      <p className="rounded-xl border border-dashed bg-card px-4 py-6 text-center text-sm text-muted-foreground">
        مناطق التوصيل لسه بتتحدد. كلمنا وقولنا انت فين، وهنقولك نوصلك ولا لأ.
      </p>
    );
  }

  return (
    <>
      <ul className="grid gap-2 sm:grid-cols-2">
        {areas.map((area) => (
          <li
            key={area._id}
            className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3"
          >
            <span className="flex min-w-0 items-center gap-2 font-medium text-brand-900">
              <MapPin className="size-4 shrink-0 text-brand-500" aria-hidden />
              <span className="truncate">{area.name}</span>
            </span>

            <span className="shrink-0 text-sm font-bold text-brand-700">
              {formatPrice(area.price)}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        السعر ده تكلفة التوصيل للمنطقة، وبيتضاف على إجمالي الطلب لما تختارها عند إتمام
        الطلب. منطقتك مش في القائمة؟ كلمنا وهنشوف نوصلك إزاي.
      </p>
    </>
  );
}
