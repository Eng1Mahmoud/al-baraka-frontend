import { WOOD } from "@/shared/components/illustrations/materials";

export function TwoCratesIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 250"
      className={className}
      role="img"
      aria-label="قفصان متطابقان من الخضار والفاكهة، واحد لبيتنا وواحد لبيتك، وبينهما علامة يساوي"
    >
      <Crate x={24} label="بيتنا" />
      <Crate x={266} label="بيتك" />

      <rect x="212" y="158" width="36" height="12" rx="6" fill="var(--color-brand-300)" />
      <rect x="212" y="180" width="36" height="12" rx="6" fill="var(--color-brand-300)" />
    </svg>
  );
}

/** One crate, drawn from the same coordinates both times — the point is that they match. */
function Crate({ x, label }: { x: number; label: string }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <ellipse cx="85" cy="222" rx="88" ry="8" fill="var(--color-brand-900)" opacity="0.07" />

      {/* Greens first, so the fruit piled over them reads as in front. */}
      <path d="M112 116c-20-5-32-22-28-40 18-3 37 8 41 25" fill="var(--color-brand-500)" />
      <path d="M117 118c5-21 23-34 41-29 3 18-10 34-28 39" fill="var(--color-brand-700)" />
      <path
        d="M116 122c1-16-1-28-5-38"
        stroke="var(--color-brand-900)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      <circle cx="70" cy="92" r="15" fill="var(--color-fruit-plum)" />
      <circle cx="46" cy="118" r="27" fill="var(--color-fruit-tomato)" />
      <circle cx="96" cy="110" r="25" fill="var(--color-fruit-citrus)" />
      <ellipse cx="140" cy="120" rx="23" ry="19" fill="var(--color-fruit-lemon)" />

      <rect
        x="0"
        y="132"
        width="170"
        height="84"
        rx="10"
        fill={WOOD.mid}
        stroke={WOOD.dark}
        strokeWidth="4"
      />
      <rect x="12" y="146" width="146" height="11" rx="5.5" fill={WOOD.light} />
      <rect x="12" y="172" width="146" height="11" rx="5.5" fill={WOOD.light} />
      <rect x="12" y="196" width="146" height="10" rx="5" fill={WOOD.light} />
      <rect x="44" y="132" width="11" height="84" fill={WOOD.dark} fillOpacity="0.4" />
      <rect x="116" y="132" width="11" height="84" fill={WOOD.dark} fillOpacity="0.4" />

      {/* The shipping label stuck on the crate face */}
      <rect
        x="52"
        y="160"
        width="66"
        height="30"
        rx="15"
        fill="#ffffff"
        stroke="var(--color-brand-100)"
        strokeWidth="2"
      />
      <text
        x="85"
        y="180"
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        fill="var(--color-brand-900)"
      >
        {label}
      </text>
    </g>
  );
}
