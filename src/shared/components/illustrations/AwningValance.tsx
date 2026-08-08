
export function AwningValance({ className, id = "awning-stripes" }: { className?: string; id?: string }) {
  return (
    <svg aria-hidden width="100%" height="28" className={className}>
      <defs>
        <pattern id={id} width="48" height="28" patternUnits="userSpaceOnUse">
          <path
            d="M0 0h48v20a12 8 0 0 0-24 0 12 8 0 0 0-24 0Z"
            fill="var(--color-brand-700)"
          />
          <path d="M24 0h24v20a12 8 0 0 0-24 0Z" fill="#ffffff" />
        </pattern>
      </defs>

      <rect width="100%" height="28" fill={`url(#${id})`} />
    </svg>
  );
}
