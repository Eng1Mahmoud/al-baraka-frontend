"use client";

export interface BarRow {
  label: string;
  value: number;
  /** Overrides the default series hue — only for rows whose colour carries meaning. */
  color?: string;
  /** Shown after the value, e.g. a revenue figure beside a quantity. */
  note?: string;
}

interface BarListProps {
  rows: BarRow[];
  formatValue: (value: number) => string;
  emptyLabel: string;
}

/**
 * Ranked magnitude as labelled bars.
 *
 * Every bar is the same hue unless a row asks otherwise: shading bars by their own
 * length would burn the colour channel restating the length the bar already shows.
 * The exception is the status breakdown, where the colour *is* the status and matches
 * the badge on the orders table.
 *
 * Values ride the bar ends rather than living in a tooltip, so nothing here needs a
 * pointer to be read.
 */
export function BarList({ rows, formatValue, emptyLabel }: BarListProps) {
  if (!rows.length) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const top = Math.max(...rows.map((row) => row.value), 1);

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            {/* Text wears text tokens — the colour lives in the bar beside it. */}
            <span className="min-w-0 truncate text-sm">{row.label}</span>
            <span className="shrink-0 text-sm font-semibold tabular-nums">
              {formatValue(row.value)}
              {row.note && (
                <span className="ms-2 font-normal text-muted-foreground">{row.note}</span>
              )}
            </span>
          </div>

          {/* The track is a lighter wash of the same surface, so a short bar still
              reads against something and the row keeps its full width. */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              // Rounded at the data end, square at the baseline it grows from.
              className="h-full rounded-e-full"
              style={{
                width: `${Math.max((row.value / top) * 100, row.value > 0 ? 2 : 0)}%`,
                background: row.color ?? "var(--chart-1)",
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
