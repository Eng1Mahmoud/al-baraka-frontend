import { cn } from "@/lib/utils";

/*
 * The Al-Baraka mark: the Arabic letter ب, the shop's own initial.
 *
 * Drawn as paths rather than set in Changa, so it renders identically before webfonts
 * load and can never shift on a font fallback — and so the same geometry produces the
 * favicon and the app icons.
 *
 * Proportion is what makes it read as a letter and not a smile: the bowl is far wider
 * than it is deep, flat along the bottom, with its right terminal rising higher than
 * its left the way the written letter does. The dot is fruit-lemon, the same accent as
 * the PLU sticker — the one spot of colour in the identity.
 *
 * These numbers are the source for `public/icons/*` and `src/app/favicon.ico`. Changing
 * them here means regenerating those.
 */
const BOWL = "M 18 30 C 18 52, 25 60, 37 60 L 65 60 C 77 60, 84 52, 84 24";
const STROKE = 13;
const DOT = { cx: 51, cy: 82, r: 8.5 };

/** The inked bounds, stroke included — the viewBox is cropped to them so the mark
 *  optically centres in whatever box it's given. */
const BOX = { x: 11.5, y: 17.5, w: 79, h: 73 };

interface BrandMarkProps {
  /** `dark` for light surfaces, `light` for the footer and sidebar. */
  tone?: "dark" | "light";
  className?: string;
}

export function BrandMark({ tone = "dark", className }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-xl",
        tone === "dark" ? "bg-brand-700" : "bg-white",
        className
      )}
    >
      <svg
        viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`}
        className="h-[52%] w-[64%] overflow-visible"
        aria-hidden
      >
        <path
          d={BOWL}
          fill="none"
          stroke={tone === "dark" ? "#ffffff" : "var(--color-brand-700)"}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={DOT.cx} cy={DOT.cy} r={DOT.r} fill="var(--color-fruit-lemon)" />
      </svg>
    </span>
  );
}
