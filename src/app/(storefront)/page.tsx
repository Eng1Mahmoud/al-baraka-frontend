import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/features/home/components/Hero";
import { CategoryGrid } from "@/features/categories/components/CategoryGrid";
import { CategorySections } from "@/features/home/components/CategorySections";
import { InstallAppBanner } from "@/features/pwa/components/InstallAppBanner";

export default function HomePage() {
  return (
    <>
      <Hero />

      <InstallAppBanner />

      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <section id="categories" className="scroll-mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1.5 text-sm font-bold text-brand-500">الأقسام</p>
              <h2 className="font-display text-2xl font-bold text-brand-900 md:text-3xl">
                تسوق حسب القسم
              </h2>
            </div>

            <Button asChild variant="ghost" size="sm" className="shrink-0 text-brand-700">
              <Link href="/products">
                كل المنتجات
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <CategoryGrid />
        </section>

        <div className="mt-16">
          <CategorySections />
        </div>

        <section className="mt-16 rounded-3xl border border-brand-100 bg-brand-50 p-8 text-center sm:p-12">
          <span
            aria-hidden
            className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-brand-100 text-brand-700"
          >
            <Search className="size-5" />
          </span>

          <h2 className="mb-2 font-display text-xl font-bold text-brand-900 md:text-2xl">
            بتدور على حاجة معينة؟
          </h2>
          <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            اتصفح كل المنتجات وفلتر بالقسم والسعر لحد ما توصل للي انت عايزه.
          </p>

          <Button asChild size="lg">
            <Link href="/products">
              كل المنتجات
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
          </Button>
        </section>
      </div>
    </>
  );
}
