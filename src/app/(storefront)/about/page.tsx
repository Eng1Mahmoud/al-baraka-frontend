import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Banknote, Scale, Sunrise } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TwoCratesIllustration } from "@/shared/components/illustrations/TwoCratesIllustration";
import { StoreContactCard } from "@/features/settings/components/StoreContactCard";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "البركة مجموعة محلات خضار وفاكهة، بتشتري من السوق كل يوم وبتوصّل طلبك خلال ساعة بالدفع عند الاستلام.",
};

const STEPS = [
  {
    numeral: "١",
    icon: Sunrise,
    title: "بنختار بإيدينا",
    body: "بننزل سوق الجملة أول ما يفتح ونختار صنف صنف. اللي مايعجبناش، مابنشتريهوش.",
  },
  {
    numeral: "٢",
    icon: Scale,
    title: "بنوزن بعد الطلب",
    body: "مافيش طلبات متجهّزة من بدري. طلبك بيتوزن ويتغلّف بعد ما يوصلنا على طول.",
  },
  {
    numeral: "٣",
    icon: Banknote,
    title: "بتدفع لما يوصل",
    body: "تعاين الطلب على الباب وتدفع كاش وقت الاستلام. مافيش دفع مقدم ولا تسجيل حساب.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 md:py-16">
      <section className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-10">
        <div>
          <p className="mb-4 text-sm font-bold tracking-wide text-brand-500">من نحن</p>

          <h1 className="mb-5 font-display text-3xl leading-[1.25] font-extrabold text-brand-900 md:text-[2.75rem]">
            بنشتري لك زي ما بنشتري لبيتنا
          </h1>

          <p className="text-base leading-loose text-muted-foreground md:text-lg">
            البركة مجموعة محلات خضار وفاكهة، بتشتري من السوق كل يوم. وفروعنا قريبة منك،
            فطلبك بيتجهّز ويوصلك <strong className="font-bold text-brand-900">خلال ساعة</strong> وهو
            لسه طازج.
          </p>
        </div>

        <TwoCratesIllustration className="mx-auto w-full max-w-md" />
      </section>

      <section className="mt-16 md:mt-20">
        <p className="mb-1.5 text-sm font-bold text-brand-500">الطريق من السوق لبابك</p>
        <h2 className="mb-6 font-display text-2xl font-bold text-brand-900 md:text-3xl">
          إزاي الطلب بيوصلك
        </h2>

        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.title} className="relative rounded-2xl border bg-card p-6 shadow-card">
              <step.icon className="absolute end-5 top-6 size-5 text-brand-300" aria-hidden />

              <span
                aria-hidden
                className="mb-4 flex size-11 items-center justify-center rounded-full bg-brand-100 font-display text-lg font-extrabold text-brand-700"
              >
                {step.numeral}
              </span>

              <h3 className="mb-2 font-display text-lg font-bold text-brand-900">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative mt-16 rounded-3xl bg-brand-100 p-8 text-center sm:p-12 md:mt-20">
        <span className="plu-sticker bg-fruit-lemon text-foreground">ضماننا</span>

        <p className="mx-auto max-w-2xl font-display text-xl leading-relaxed font-bold text-brand-900 md:text-2xl">
          لو صنف وصلك مش عاجبك، سيبه مع السواق — مش هتدفع تمنه.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-brand-700">
          ده أسهل من أي سياسة استبدال، وبيخلينا مضطرين نختار صح من الأول.
        </p>
      </section>

      <section className="mt-16 md:mt-20">
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
