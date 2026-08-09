"use client";

import { Clock, Phone, Truck } from "lucide-react";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { useDeliveryAreas } from "@/features/delivery-areas/hooks/useDeliveryAreas";

/** Live shop details — phone, hours and delivery areas come from the dashboard. */
export function StoreContactCard() {
  const { data: settings } = useSettings();
  const { data: areas = [] } = useDeliveryAreas(true);

  const phone = settings?.storePhone 
  const hours = settings?.workingHours 

  return (
    <div className="rounded-2xl bg-panel p-6 text-panel-foreground sm:p-8">
      <h2 className="mb-5 font-display text-xl font-bold text-white">تواصل معنا</h2>

      <dl className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="mb-1.5 flex items-center gap-2 text-xs text-panel-muted">
            <Phone className="size-4" aria-hidden />
            رقم الطلبات
          </dt>
          <dd>
            <a
              href={`tel:${phone?.replace(/\s/g, "")}`}
              dir="ltr"
              className="text-sm hover:text-white"
            >
              {phone}
            </a>
          </dd>
        </div>

        <div>
          <dt className="mb-1.5 flex items-center gap-2 text-xs text-panel-muted">
            <Clock className="size-4" aria-hidden />
            مواعيد العمل
          </dt>
          <dd className="text-sm">{hours}</dd>
        </div>

        <div>
          <dt className="mb-1.5 flex items-center gap-2 text-xs text-panel-muted">
            <Truck className="size-4" aria-hidden />
            التوصيل
          </dt>
          <dd className="text-sm">
            {areas.length ? `${areas.length} مناطق` : "حسب المنطقة"}
            <span className="block text-xs text-panel-muted">
              السعر بيتحدد حسب منطقتك عند الطلب
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
