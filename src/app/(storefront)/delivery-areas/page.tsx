import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Banknote, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeliveryAreasList } from "@/features/delivery-areas/components/DeliveryAreasList";
import { StoreContactCard } from "@/features/settings/components/StoreContactCard";

export const metadata: Metadata = {
  title: "مناطق التوصيل",
  description:
    "المناطق اللي بنوصلها وسعر التوصيل لكل منطقة. التوصيل خلال ساعة والدفع كاش عند الاستلام.",
};

/** The three things a customer weighs before ordering, once each. */
const FACTS = [
  { icon: Truck, title: "التوصيل خلال ساعة", note: "من وقت ما نأكد الطلب على التليفون" },
  { icon: Banknote, title: "سعر التوصيل حسب المنطقة", note: "بيتحدد لما تختار منطقتك عند الطلب" },
  { icon: Clock, title: "طول ساعات العمل", note: "اطلب في أي وقت والمحل فاتح" },
];

export default function DeliveryAreasPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      <header>
        <p className="mb-3 text-sm font-bold tracking-wide text-brand-500">التوصيل</p>

        <h1 className="mb-4 font-display text-3xl leading-[1.25] font-extrabold text-brand-900 md:text-[2.5rem]">
          بنوصل لفين
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          دي المناطق اللي بنغطيها دلوقتي وسعر التوصيل لكل واحدة. لو منطقتك مش هنا، كلمنا
          وهنشوف نوصلك إزاي.
        </p>
      </header>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {FACTS.map((fact) => (
          <li key={fact.title} className="rounded-2xl border bg-card p-5">
            <fact.icon className="mb-3 size-5 text-brand-700" aria-hidden />
            <p className="mb-1 text-sm font-bold text-brand-900">{fact.title}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{fact.note}</p>
          </li>
        ))}
      </ul>

      <section className="mt-12">
        <h2 className="mb-5 font-display text-2xl font-bold text-brand-900">المناطق والأسعار</h2>
        <DeliveryAreasList />
      </section>

      <section className="mt-14">
        <StoreContactCard />
      </section>

      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href="/products">
            ابدأ التسوق
            <ArrowLeft className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}
