import type { Metadata } from "next";
import { CartView } from "@/features/cart/components/CartView";

export const metadata: Metadata = {
  title: "السلة",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 md:py-10">
      <h1 className="mb-6 font-display text-2xl font-bold text-brand-900 md:text-3xl">السلة</h1>
      <CartView />
    </div>
  );
}
