import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackOrderView } from "@/features/orders/components/TrackOrderView";

export const metadata: Metadata = {
  title: "تتبع الطلب",
};

export default function TrackPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6 md:py-12">
      <h1 className="mb-2 font-display text-2xl font-bold text-brand-900">تتبع طلبك</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        اكتب رقم الطلب ورقم الهاتف اللي طلبت بيه.
      </p>

      <Suspense fallback={<Skeleton className="h-64 rounded-2xl" />}>
        <TrackOrderView />
      </Suspense>
    </div>
  );
}
