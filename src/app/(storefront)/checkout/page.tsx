import type { Metadata } from "next";
import { CheckoutView } from "@/features/orders/components/CheckoutView";

export const metadata: Metadata = {
  title: "إتمام الطلب",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 md:py-10">
      <CheckoutView />
    </div>
  );
}
