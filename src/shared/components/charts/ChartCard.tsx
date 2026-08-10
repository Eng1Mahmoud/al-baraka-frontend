"use client";

import { useState, type ReactNode } from "react";
import { BarChart3, TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** The plot. */
  children: ReactNode;
  /** The same numbers as rows — never a second, lesser version of the data. */
  table: ReactNode;
  /** True while a new range loads: the frame holds, the plot just dims. */
  isRefreshing?: boolean;
  className?: string;
}

/**
 * The frame every chart shares: a title, the plot, and a switch to the same figures
 * as a table.
 *
 * The table is not a fallback — it is how the values stay reachable for a screen
 * reader, for anyone who cannot separate the colours, and for anyone who just wants
 * the number rather than the shape.
 */
export function ChartCard({
  title,
  subtitle,
  children,
  table,
  isRefreshing = false,
  className,
}: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <section className={cn("rounded-xl border bg-card p-4 sm:p-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-brand-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setShowTable((shown) => !shown)}
          aria-pressed={showTable}
          aria-label={showTable ? `${title}: عرض كرسم بياني` : `${title}: عرض كجدول`}
          title={showTable ? "عرض كرسم بياني" : "عرض كجدول"}
          className="shrink-0 text-muted-foreground"
        >
          {showTable ? (
            <BarChart3 className="size-4" aria-hidden />
          ) : (
            <TableIcon className="size-4" aria-hidden />
          )}
        </Button>
      </div>

      {/* Dimmed rather than replaced by a skeleton: a reload that blanks the card
          costs the reader their place and jumps the page height. */}
      <div className={cn("transition-opacity", isRefreshing && "opacity-50")}>
        {showTable ? (
          <div className="max-h-72 overflow-auto">{table}</div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
