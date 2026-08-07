"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/features/products/components/ProductCard";
import type { Product } from "@/features/products/types/product";

/**
 * `transition-none` and the flattened active state keep the arrows still when
 * pressed — the button's stock press effect nudges them, and a control that only
 * moves the rail shouldn't move itself. Hidden rather than greyed at each end, as
 * before.
 */
const ARROW_CLASS =
  "bg-background shadow-md transition-none active:not-aria-[haspopup]:translate-y-0 disabled:opacity-0";

/**
 * Horizontal product rail, on Embla via the shadcn carousel.
 *
 * Slide widths are set as flex-basis on the item, which includes the 1rem gutter
 * `CarouselItem` adds — so `basis-44` is a 10rem card, matching the grid elsewhere.
 *
 * The vertical padding is load-bearing: Embla's viewport clips overflow, and the PLU
 * sticker deliberately hangs outside its card's top corner.
 */
export function ProductSlider({ products }: { products: Product[] }) {
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
        // No animation, per the rest of this rail's behaviour.
        duration: 0,
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
