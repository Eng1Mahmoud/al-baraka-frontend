import { WOOD } from "@/shared/components/illustrations/materials";

/**
 * The market crate. Used at small sizes to give empty states something to say —
 * an empty shelf is still the shop, not an error.
 */
export function CrateIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 320"
      className={className}
      role="img"
      aria-label="قفص خشبي مليان خضار وفاكهة"
    >
      {/* leafy greens at the back */}
      <g>
        <path
          d="M150 150c-28-6-46-30-40-56 26-6 52 10 58 34"
          fill="var(--color-brand-500)"
        />
        <path d="M158 152c8-30 34-48 60-42 4 26-14 50-40 56" fill="var(--color-brand-700)" />
        <path d="M155 158c2-22 0-40-6-56" stroke="var(--color-brand-900)" strokeWidth="4" fill="none" />
      </g>

      {/* produce sitting in the crate */}
      <circle cx="112" cy="176" r="34" fill="var(--color-fruit-tomato)" />
      <path d="M112 142c-6-8-2-16 6-16-2 8 0 12-6 16z" fill="var(--color-brand-700)" />

      <circle cx="196" cy="170" r="38" fill="var(--color-fruit-citrus)" />
      <circle cx="196" cy="170" r="38" fill="none" stroke="var(--color-fruit-tomato)" strokeOpacity="0.25" strokeWidth="3" />

      <ellipse cx="278" cy="180" rx="34" ry="28" fill="var(--color-fruit-lemon)" />

      <circle cx="248" cy="140" r="22" fill="var(--color-fruit-plum)" />
      <circle cx="286" cy="132" r="16" fill="var(--color-fruit-plum)" fillOpacity="0.8" />

      {/* the crate itself, drawn over the produce so items sit inside it */}
      <g>
        <rect x="60" y="196" width="300" height="96" rx="10" fill={WOOD.mid} />
        <rect x="60" y="196" width="300" height="96" rx="10" fill="none" stroke={WOOD.dark} strokeWidth="4" />
        <rect x="72" y="214" width="276" height="14" rx="7" fill={WOOD.light} />
        <rect x="72" y="242" width="276" height="14" rx="7" fill={WOOD.light} />
        <rect x="72" y="270" width="276" height="12" rx="6" fill={WOOD.light} />
        <rect x="150" y="196" width="14" height="96" fill={WOOD.dark} fillOpacity="0.5" />
        <rect x="256" y="196" width="14" height="96" fill={WOOD.dark} fillOpacity="0.5" />
      </g>

      {/* the PLU sticker motif, the same one used on product cards */}
      <g transform="rotate(-8 330 240)">
        <circle cx="330" cy="240" r="34" fill="var(--color-fruit-lemon)" />
        <circle
          cx="330"
          cy="240"
          r="30"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        <text
          x="330"
          y="236"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="var(--color-brand-900)"
        >
          طازج
        </text>
        <text
          x="330"
          y="252"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="var(--color-brand-900)"
        >
          النهاردة
        </text>
      </g>
    </svg>
  );
}
