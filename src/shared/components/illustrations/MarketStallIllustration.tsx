import { BRASS, WOOD } from "@/shared/components/illustrations/materials";

/**
 * The stall counter — the home page's opening image.
 *
 * The two things a customer actually watches at a greengrocer are the crate the
 * produce comes out of and the scale it goes onto, so those are the whole scene:
 * a brass balance with produce in one pan and weights in the other, resting level,
 * and a crate still piled above its rim. The PLU sticker is the same motif used on
 * product cards, so the drawing and the catalogue share a vocabulary.
 *
 * Drawn rather than photographed: the shop has no photography yet, and SVG stays
 * sharp at any size, weighs nothing, and reads the brand tokens directly.
 */
export function MarketStallIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 380"
      className={className}
      role="img"
      aria-label="منضدة سوق عليها ميزان نحاسي وقفص مليان خضار وفاكهة"
    >
      {/* Greens go in first so the fruit piled on top of them reads as in front. */}
      <g>
        <path
          d="M292 152c-24-6-38-26-33-48 22-4 44 10 49 30"
          fill="var(--color-brand-500)"
        />
        <path d="M298 154c6-26 28-42 50-36 4 22-12 42-34 48" fill="var(--color-brand-700)" />
        <path
          d="M296 160c1-20-1-36-6-50"
          stroke="var(--color-brand-900)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Produce piled above the crate rim — drawn before the crate so it sits inside. */}
      <circle cx="336" cy="146" r="17" fill="var(--color-fruit-plum)" />
      <circle cx="382" cy="140" r="13" fill="var(--color-fruit-plum)" fillOpacity="0.75" />

      <circle cx="300" cy="184" r="30" fill="var(--color-fruit-citrus)" />
      <circle
        cx="300"
        cy="184"
        r="30"
        fill="none"
        stroke="var(--color-fruit-tomato)"
        strokeOpacity="0.2"
        strokeWidth="3"
      />

      <circle cx="360" cy="176" r="26" fill="var(--color-fruit-tomato)" />
      <path d="M360 150c-6-8-2-16 6-16-2 8 0 12-6 16z" fill="var(--color-brand-700)" />

      <ellipse cx="410" cy="186" rx="26" ry="22" fill="var(--color-fruit-lemon)" />

      {/* The crate */}
      <g>
        <rect
          x="262"
          y="196"
          width="180"
          height="90"
          rx="10"
          fill={WOOD.mid}
          stroke={WOOD.dark}
          strokeWidth="4"
        />
        <rect x="274" y="212" width="156" height="12" rx="6" fill={WOOD.light} />
        <rect x="274" y="240" width="156" height="12" rx="6" fill={WOOD.light} />
        <rect x="274" y="266" width="156" height="12" rx="6" fill={WOOD.light} />
        <rect x="310" y="196" width="12" height="90" fill={WOOD.dark} fillOpacity="0.45" />
        <rect x="382" y="196" width="12" height="90" fill={WOOD.dark} fillOpacity="0.45" />
      </g>

      {/* The counter the crate and the scale stand on */}
      <g>
        <rect x="48" y="286" width="384" height="20" rx="6" fill={WOOD.mid} />
        <rect x="56" y="306" width="368" height="14" rx="4" fill={WOOD.dark} />
        <rect x="80" y="320" width="16" height="42" rx="4" fill={WOOD.dark} />
        <rect x="384" y="320" width="16" height="42" rx="4" fill={WOOD.dark} />
        <rect x="88" y="336" width="304" height="10" rx="5" fill={WOOD.dark} fillOpacity="0.6" />
      </g>

      {/* The brass balance. The beam sits level: produce in one pan, weights in the
          other, which is the whole promise of weighing after the order is placed. */}
      <g>
        <ellipse cx="150" cy="284" rx="36" ry="9" fill={BRASS.dark} />
        <ellipse cx="150" cy="279" rx="36" ry="9" fill={BRASS.mid} />
        <rect x="143" y="178" width="14" height="102" rx="7" fill={BRASS.mid} />
        <circle cx="150" cy="174" r="9" fill={BRASS.dark} />
        <rect x="76" y="162" width="148" height="9" rx="4.5" fill={BRASS.mid} />
        <circle cx="150" cy="166" r="7" fill={BRASS.dark} />

        <path
          d="M80 171 64 202M80 171l16 31M220 171l-16 31M220 171l16 31"
          stroke={BRASS.dark}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        <circle cx="70" cy="195" r="13" fill="var(--color-fruit-tomato)" />
        <circle cx="92" cy="197" r="11" fill="var(--color-fruit-tomato)" fillOpacity="0.85" />
        <path
          d="M56 202h48c0 12-10.7 20-24 20s-24-8-24-20z"
          fill={BRASS.mid}
          stroke={BRASS.dark}
          strokeWidth="2"
        />

        <rect x="213" y="176" width="14" height="10" rx="2" fill={BRASS.dark} />
        <rect x="208" y="186" width="24" height="16" rx="3" fill={BRASS.dark} />
        <path
          d="M196 202h48c0 12-10.7 20-24 20s-24-8-24-20z"
          fill={BRASS.mid}
          stroke={BRASS.dark}
          strokeWidth="2"
        />
      </g>

      {/* A couple of lemons left on the counter, so it reads as mid-shift. */}
      <ellipse cx="212" cy="272" rx="16" ry="13" fill="var(--color-fruit-lemon)" />
      <ellipse
        cx="240"
        cy="275"
        rx="13"
        ry="11"
        fill="var(--color-fruit-lemon)"
        fillOpacity="0.85"
      />

      {/* The PLU sticker motif, the same one used on product cards */}
      <g transform="rotate(-8 426 96)">
        <circle cx="426" cy="96" r="34" fill="var(--color-fruit-lemon)" />
        <circle
          cx="426"
          cy="96"
          r="30"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        <text
          x="426"
          y="92"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="var(--color-brand-900)"
        >
          طازج
        </text>
        <text
          x="426"
          y="108"
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
