import Link from "next/link";
import { ArrowLeft, Banknote, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AwningValance } from "@/shared/components/illustrations/AwningValance";
import { MarketStallIllustration } from "@/shared/components/illustrations/MarketStallIllustration";

const PROMISES = [
  { icon: Clock, title: "من السوق كل صباح", note: "بنختار الصنف بإيدينا قبل ما نشتريه" },
  { icon: Truck, title: "التوصيل خلال ساعة", note: "لكل المناطق اللي بنغطيها" },
  { icon: Banknote, title: "الدفع عند الاستلام", note: "كاش على الباب، من غير تسجيل" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-50">
      <AwningValance className="absolute inset-x-0 top-0 z-10 w-full" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pt-20 pb-14 md:grid-cols-[1.05fr_1fr] md:pt-24 md:pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-3.5 py-1.5 text-xs font-bold text-brand-700">
            <span className="size-1.5 rounded-full bg-brand-500" aria-hidden />
            السوق فتح، والطلبات شغالة
          </p>

          <h1 className="mb-4 font-display text-4xl leading-[1.15] font-extrabold text-brand-900 md:text-6xl">
            طازة من السوق،
            <span className="relative mx-2 inline-block">
              لحد باب بيتك
              {/* hand-drawn underline instead of a highlight block */}
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 start-0 h-2.5 w-full text-fruit-lemon"
              >
                <path
                  d="M2 8c40-6 100-7 196-3"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="mb-7 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            بنختار الخضار والفاكهة بإيدينا أول ما السوق يفتح، ونوصلهالك خلال ساعة. تدفع كاش لما
            الطلب يوصل — من غير حسابات ولا تسجيل.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/products">
                تسوق دلوقتي
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#categories">شوف الأقسام</Link>
            </Button>
          </div>
        </div>

        <MarketStallIllustration className="mx-auto w-full max-w-lg" />
      </div>

      <div className="relative border-t border-brand-100 bg-card">
        <ul className="mx-auto grid w-full max-w-6xl gap-x-6 gap-y-5 px-6 py-6 sm:grid-cols-3">
          {PROMISES.map((promise) => (
            <li key={promise.title} className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <promise.icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-bold text-brand-900">{promise.title}</span>
                <span className="block text-xs text-muted-foreground">{promise.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
