"use client";

import { useState } from "react";
import { useMeasuredWidth } from "@/shared/hooks/useMeasuredWidth";

export interface TrendPoint {
  /** Short axis label, e.g. "٧/٨". */
  label: string;
  /** Full label for the tooltip and the table. */
  fullLabel: string;
  value: number;
}

interface TrendChartProps {
  points: TrendPoint[];
  /** What the series is, for the tooltip row and the accessible summary. */
  name: string;
  /** Axis ticks — keep it short, it repeats down the gridlines. */
  formatValue: (value: number) => string;
  /** The precise reading. Falls back to the tick format when they are the same thing. */
  formatTooltip?: (value: number) => string;
  height?: number;
}

/** Room for the y ticks, the x labels, and the end dot's ring. */
const PAD = { top: 12, right: 10, bottom: 26, left: 46 };
const TICKS = 4;

/**
 * The axis top, chosen so the gridlines land on round numbers.
 *
 * Picked from the *step* rather than the maximum: rounding 46 up to 50 gives ticks of
 * 12.5, which then print as 13 / 25 / 38 and read as though the grid were uneven.
 * Sizing the step first costs some headroom above the peak and buys 0 / 20 / 40 / 60.
 */
function niceScale(max: number, ticks: number) {
  if (max <= 0) return ticks;

  const rough = max / ticks;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = ([1, 2, 2.5, 5, 10].find((factor) => rough <= factor * magnitude) ?? 10) * magnitude;

  return step * ticks;
}

/**
 * A single series over time: 2px line, a 10% wash beneath it, and a crosshair that
 * snaps to the nearest day.
 *
 * One series, so one hue and no legend — the card's title already names what is
 * plotted, and a legend box with a single swatch would only restate it.
 *
 * Deliberately not a dual-axis chart. Orders and revenue live on scales that have no
 * shared meaning; drawing them together would invent a correlation out of where the
 * two axes happened to be aligned. They get one card each.
 */
export function TrendChart({
  points,
  name,
  formatValue,
  formatTooltip = formatValue,
  height = 200,
}: TrendChartProps) {
  const [wrapperRef, width] = useMeasuredWidth<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Nothing to lay out against until the first measurement lands.
  if (width === 0 || points.length === 0) {
    return <div ref={wrapperRef} style={{ height }} aria-hidden />;
  }

  const plotWidth = Math.max(width - PAD.left - PAD.right, 1);
  const plotHeight = height - PAD.top - PAD.bottom;
  const top = niceScale(Math.max(...points.map((point) => point.value)), TICKS);

  const x = (index: number) =>
    PAD.left + (points.length === 1 ? plotWidth / 2 : (index * plotWidth) / (points.length - 1));
  const y = (value: number) => PAD.top + plotHeight - (value / top) * plotHeight;

  const line = points.map((point, index) => `${x(index)},${y(point.value)}`).join(" ");
  const area = `${PAD.left},${PAD.top + plotHeight} ${line} ${x(points.length - 1)},${PAD.top + plotHeight}`;

  const last = points.length - 1;
  const active = activeIndex === null ? null : points[activeIndex];

  // Every third day, so the labels never collide at a fortnight's width. The last day
  // is always shown — it is the one the reader is looking for.
  const labelEvery = Math.max(1, Math.ceil(points.length / 7));

  const pointerToIndex = (clientX: number, target: SVGSVGElement) => {
    const bounds = target.getBoundingClientRect();
    const offset = clientX - bounds.left - PAD.left;
    const step = points.length === 1 ? plotWidth : plotWidth / (points.length - 1);

    return Math.min(Math.max(Math.round(offset / step), 0), last);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`${name}: ${points[0]?.fullLabel} إلى ${points[last]?.fullLabel}`}
        onPointerMove={(event) => setActiveIndex(pointerToIndex(event.clientX, event.currentTarget))}
        onPointerLeave={() => setActiveIndex(null)}
        className="touch-pan-y"
      >
        {/* Hairline, solid, one step off the surface — a grid should be findable, not read. */}
        {Array.from({ length: TICKS + 1 }).map((_, index) => {
          const value = (top / TICKS) * index;

          return (
            <g key={index}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(value)}
                y2={y(value)}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={y(value) + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px] tabular-nums"
              >
                {formatValue(value)}
              </text>
            </g>
          );
        })}

        {/* A wash, never a saturated block. */}
        <polygon points={area} fill="var(--chart-1)" fillOpacity={0.1} />
        <polyline
          points={line}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) =>
          index % labelEvery === 0 || index === last ? (
            <text
              key={point.fullLabel}
              x={x(index)}
              y={height - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px] tabular-nums"
            >
              {point.label}
            </text>
          ) : null
        )}

        {activeIndex !== null && (
          <line
            x1={x(activeIndex)}
            x2={x(activeIndex)}
            y1={PAD.top}
            y2={PAD.top + plotHeight}
            stroke="var(--chart-1)"
            strokeWidth={1}
          />
        )}

        {/* The end dot marks where the series stops; the ring keeps it legible where it
            sits on the line. The hovered day borrows the same treatment. */}
        {[last, activeIndex].map((index, slot) =>
          index === null || (slot === 1 && index === last) ? null : (
            <circle
              key={slot}
              cx={x(index)}
              cy={y(points[index]!.value)}
              r={4}
              fill="var(--chart-1)"
              stroke="var(--card)"
              strokeWidth={2}
            />
          )
        )}
      </svg>

      {active && (
        <div
          // Flips to the other side of the crosshair near the end, so it never leaves
          // the card.
          style={{
            insetInlineStart: activeIndex! > last / 2 ? undefined : x(activeIndex!) + 10,
            insetInlineEnd: activeIndex! > last / 2 ? width - x(activeIndex!) + 10 : undefined,
          }}
          className="pointer-events-none absolute top-2 rounded-lg border bg-popover px-2.5 py-1.5 shadow-card"
        >
          {/* Value first: the reader already knows which series they are on. */}
          <p className="text-sm font-bold text-brand-900 tabular-nums">
            {formatTooltip(active.value)}
          </p>
          <p className="text-[11px] text-muted-foreground">{active.fullLabel}</p>
        </div>
      )}
    </div>
  );
}
