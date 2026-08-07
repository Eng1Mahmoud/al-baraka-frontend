"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Leaf } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/categories/hooks/useCategories";

/**
 * Category cards with their photo.
 *
 * The name is always on the card, never only on hover — half the shop's traffic is
 * on a phone, where hover never happens, and a wall of unlabelled photos is a
 * guessing game. The scrim carrying it is tinted with the brand green rather than
 * plain black, for the same reason the card shadows are: a neutral grey over a warm
 * photo reads as dirt, a tinted one reads as depth.
 *
 * Hover deepens the scrim and nudges the chevron, so pointer users get the
 * affordance without the name having been hidden from anyone.
 */
export function CategoryGrid() {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="aspect-4/3 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-2xl border border-dashed py-10 text-center text-sm text-destructive">
        تعذر تحميل الأقسام. حدّث الصفحة وحاول تاني.
      </p>
    );
  }

  if (!categories?.length) {
    return (
      <p className="rounded-2xl border border-dashed py-10 text-center text-sm text-muted-foreground">
        لسه مفيش أقسام معروضة.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/products?category=${category.slug}`}
          className="group relative block aspect-4/3 overflow-hidden rounded-2xl shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          {category.image ? (
            <Image
              src={category.image}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
              className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            /* No photo yet: a green field, not a grey box — and the name still shows. */
            <span
              aria-hidden
              className="flex h-full items-center justify-center bg-linear-to-br from-brand-500 to-brand-700 text-white/40"
            >
              <Leaf className="size-10" />
            </span>
          )}

          <span
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-brand-900/85 via-brand-900/25 to-brand-900/0 transition-colors duration-300 group-hover:from-brand-900/90 group-hover:via-brand-900/45"
          />

          <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 sm:p-4">
            <span className="font-display text-base leading-tight font-bold text-white sm:text-lg">
              {category.name}
            </span>
            <ChevronLeft
              aria-hidden
              className="size-4 shrink-0 text-white/70 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
