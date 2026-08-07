import Link from "next/link";
import { CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSTALL_COPY } from "@/features/pwa/config";
import { InstallAppCallout } from "@/features/pwa/components/InstallAppCallout";

/** Shown in place of the checkout form once the order is saved. */
export function OrderPlaced({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-card p-8 text-center">
      <CheckCircle2 className="mx-auto mb-4 size-14 text-brand-500" aria-hidden />

      <h1 className="mb-2 font-display text-2xl font-bold text-brand-900">وصلنا طلبك</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        هنتصل بيك على رقمك لتأكيد الطلب وميعاد التوصيل.
      </p>

      <div className="mb-6 rounded-xl bg-brand-50 p-4">
        <p className="mb-1 text-xs text-muted-foreground">رقم الطلب</p>
        <p className="font-mono text-lg font-bold text-brand-900" dir="ltr">
          {orderNumber}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          احتفظ بالرقم ده — هتتابع بيه حالة الطلب.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Button asChild>
          <Link href={`/track?order=${orderNumber}`}>
            <Phone className="size-4" aria-hidden />
            تابع حالة الطلب
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/products">اطلب حاجة تانية</Link>
        </Button>
      </div>

      {/* The best moment to ask: they have an order to follow, and following it is
          exactly what the installed app is good for. */}
      <InstallAppCallout
        body={INSTALL_COPY.bodyAfterOrder}
        className="mt-6 border-t pt-5 text-start"
      />
    </div>
  );
}
