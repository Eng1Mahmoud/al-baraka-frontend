/**
 * The striped awning that hangs over the top of the hero.
 *
 * Every produce stall in the market has one, so it does the job a decorative wave
 * divider would do on a generic page — separating the sticky header from the hero —
 * while saying where the shop actually is. Scallops, not a wave: the shape has to
 * read as canvas.
 *
 * The scallops are a fixed-size SVG pattern rather than a stretched shape, so they
 * keep their proportions at every viewport width instead of smearing on wide screens.
 * It renders once per page — the pattern id is a constant, not generated.
 */
export function AwningValance({ className }: { className?: string }) {
  return (
    <svg aria-hidden width="100%" height="28" className={className}>
      <defs>
        <pattern id="awning-stripes" width="48" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M0 0h48v20a12 8 0 0 0-24 0 12 8 0 0 0-24 0Z"
            fill="var(--color-brand-700)"
          />
          <path d="M24 0h24v20a12 8 0 0 0-24 0Z" fill="#ffffff" />
        </pattern>
      </defs>

      <rect width="100%" height="28" fill="url(#awning-stripes)" />
    </svg>
  );
}
