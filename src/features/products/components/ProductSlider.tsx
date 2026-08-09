"use client";

import { useState } from "react";
import Autoplay from "embla-carousel-autoplay";
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

/** Long enough to read a card and decide, short enough that the rail feels alive. */
const AUTOPLAY_DELAY = 4500;

/**
 * Roughly what fits on the widest layout — `basis-56` cards across a `max-w-6xl` row.
 *
 * Below this the rail has nothing to scroll on a desktop, and a carousel looping a
 * row that already fits on screen is movement for its own sake.
 */
const FITS_WITHOUT_SCROLLING = 5;

export function ProductSlider({ products }: { products: Product[] }) {
  // Embla moves the rail from JavaScript, so a media query can't quiet it — the
  // preference has to be read and the duration collapsed to an instant jump.
  const prefersReducedMotion = usePrefersReducedMotion();

  const autoplays = !prefersReducedMotion && products.length > FITS_WITHOUT_SCROLLING;

  /*
    Built once, in state, because the plugin owns a running timer — rebuilt on every
    render it would restart that timer and the rail would keep resetting instead of
    advancing.

    stopOnInteraction: once someone takes hold of the rail it stays where they put it.
    A carousel that resumes and slides a card out from under the cursor is the reason
    people dislike them. Hovering or tabbing in pauses it for the same reason.
  */
  const [autoplay] = useState(() =>
    Autoplay({
      delay: AUTOPLAY_DELAY,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    })
  );

  const plugins = autoplays ? [autoplay] : [];

  return (
    <Carousel
      plugins={plugins}
      opts={{
        // The whole storefront is dir="rtl"; Embla has to be told separately, or it
        // reads the first product as the far end of the rail.
        direction: "rtl",
        align: "start",
        // Snap points are grouped by however many cards actually fit, so one click
        // advances a full screen of products at every breakpoint.
        slidesToScroll: "auto",
        // Only while it plays itself: unlooped, autoplay walks to the last card and
        // stops there for good. Left on without autoplay it would instead take a
        // reader who scrolled to the end and silently put them back at the start.
        loop: autoplays,
        // Embla ignores containScroll when looping, so it is only set when it applies.
        containScroll: autoplays ? undefined : "trimSnaps",
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
