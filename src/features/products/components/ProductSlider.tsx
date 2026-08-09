"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/features/products/components/ProductCard";
import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";
import type { Product } from "@/features/products/types/product";

const ARROW_CLASS =
  "bg-background shadow-md transition-[color,background-color,box-shadow,opacity] active:not-aria-[haspopup]:translate-y-0 disabled:opacity-0";

/**
 * Embla's scroll duration — a scalar of its own, not milliseconds. Its default is 25;
 * a little under that keeps the rail feeling answerable rather than gliding.
 */
const SCROLL_DURATION = 22;

export function ProductSlider({ products }: { products: Product[] }) {
  // Embla moves the rail from JavaScript, so a media query can't quiet it — the
  // preference has to be read and the duration collapsed to an instant jump.
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Carousel
      opts={{
        // The whole storefront is dir="rtl"; Embla has to be told separately, or it
        // reads the first product as the far end of the rail.
        direction: "rtl",
        align: "start",
        // Snap points are grouped by however many cards actually fit, so one click
        // advances a full screen of products at every breakpoint.
        slidesToScroll: "auto",
        containScroll: "trimSnaps",
        duration: prefersReducedMotion ? 0 : SCROLL_DURATION,
      }}
    >
      <CarouselContent className="py-3">
        {products.map((product) => (
          <CarouselItem key={product._id} className="basis-44 sm:basis-52 lg:basis-56">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* aria-label overrides the carousel's built-in English sr-only text. */}
      <CarouselPrevious
        size="icon-lg"
        aria-label="المنتجات السابقة"
        className={`${ARROW_CLASS} -start-2 md:-start-4 cursor-pointer`}
      />
      <CarouselNext
        size="icon-lg"
        aria-label="المنتجات التالية"
        className={`${ARROW_CLASS} -end-2 md:-end-4 cursor-pointer`}
      />
    </Carousel>
  );
}
