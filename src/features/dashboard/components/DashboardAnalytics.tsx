"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/shared/lib/format";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/shared/config/site";
import { ChartCard } from "@/shared/components/charts/ChartCard";
import { TrendChart, type TrendPoint } from "@/shared/components/charts/TrendChart";
import { BarList } from "@/shared/components/charts/BarList";
import { useOrderAnalytics } from "@/features/orders/hooks/useOrders";

/** Presets, not a calendar: nobody fights a date grid to say "last 30 days". */
const RANGES = [
  { days: 7, label: "٧ أيام" },
  { days: 14, label: "١٤ يوم" },
  { days: 30, label: "٣٠ يوم" },
  { days: 90, label: "٩٠ يوم" },
] as const;

const dayLabel = new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "numeric" });
const fullDayLabel = new Intl.DateTimeFormat("ar-EG", { dateStyle: "full" });
const countFormatter = new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 });

/** Axis ticks and revenue values want the currency short, not spelled out per gridline. */
const compactPrice = (value: number) =>
  value >= 1000 ? `${countFormatter.format(Math.round(value / 100) / 10)}ألف` : countFormatter.format(value);

export function DashboardAnalytics() {
  const [days, setDays] = useState<number>(14);
  const { data, isPending, isFetching } = useOrderAnalytics(days);

  const points: TrendPoint[] =
    data?.daily.map((day) => {
      const date = new Date(`${day.date}T00:00:00`);

      return {
        label: dayLabel.format(date),
        fullLabel: fullDayLabel.format(date),
        value: day.orders,
      };
    }) ?? [];

  const revenuePoints: TrendPoint[] =
    data?.daily.map((day, index) => ({ ...points[index]!, value: day.revenue })) ?? [];

  const statusRows =
    data?.byStatus
      .slice()
      .sort((a, b) => b.count - a.count)
      .map((row) => ({
        label: ORDER_STATUS_LABELS[row.status],
        value: row.count,
        color: ORDER_STATUS_COLORS[row.status],
      })) ?? [];

  const productRows =
    data?.topProducts.map((product) => ({
      label: product.name,
      value: product.quantity,
      note: formatPrice(product.revenue),
    })) ?? [];

  if (isPending) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-72 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* One row, above everything it scopes — never a range picker per card. */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">الفترة:</span>
        {RANGES.map((range) => (
          <button
            key={range.days}
            type="button"
            onClick={() => setDays(range.days)}
            aria-pressed={days === range.days}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              days === range.days
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:border-brand-500 hover:bg-brand-50"
            )}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="الطلبات اليومية"
          subtitle="عدد الطلبات في كل يوم، بدون الملغية"
          isRefreshing={isFetching}
          table={
            <DailyTable
              points={points}
              header="الطلبات"
              format={(value) => countFormatter.format(value)}
            />
          }
        >
          <TrendChart
            points={points}
            name="الطلبات اليومية"
            formatValue={(value) => countFormatter.format(value)}
          />
        </ChartCard>

        <ChartCard
          title="المبيعات اليومية"
          subtitle="إجمالي المبيعات في كل يوم، بدون الملغية"
          isRefreshing={isFetching}
          table={<DailyTable points={revenuePoints} header="المبيعات" format={formatPrice} />}
        >
          {/* A second card rather than a second axis on the one above: orders and
              pounds share no scale, and overlaying them would invent a correlation. */}
          {/* Ticks stay compact so they don't crowd the axis; the tooltip is where the
              reader goes for the exact figure, so it gets the full currency. */}
          <TrendChart
            points={revenuePoints}
            name="المبيعات اليومية"
            formatValue={compactPrice}
            formatTooltip={formatPrice}
          />
        </ChartCard>

        <ChartCard
          title="الطلبات حسب الحالة"
          subtitle="كل الطلبات منذ بداية المتجر"
          isRefreshing={isFetching}
          table={<RowTable rows={statusRows} first="الحالة" second="عدد الطلبات" />}
        >
          <BarList
            rows={statusRows}
            formatValue={(value) => countFormatter.format(value)}
            emptyLabel="لا توجد طلبات بعد."
          />
        </ChartCard>

        <ChartCard
          title="أكثر المنتجات مبيعًا"
          subtitle="بالكمية المباعة، وبجوارها قيمتها"
          isRefreshing={isFetching}
          table={<RowTable rows={productRows} first="المنتج" second="الكمية" />}
        >
          <BarList
            rows={productRows}
            formatValue={(value) => countFormatter.format(value)}
            emptyLabel="لسه مفيش مبيعات."
          />
        </ChartCard>
      </div>
    </div>
  );
}

const TABLE_CLASS = "w-full text-sm";
const TH_CLASS = "sticky top-0 bg-card py-2 text-start font-medium text-muted-foreground";
const TD_CLASS = "border-t py-2 tabular-nums";

function DailyTable({
  points,
  header,
  format,
}: {
  points: TrendPoint[];
  header: string;
  format: (value: number) => string;
}) {
  return (
    <table className={TABLE_CLASS}>
      <thead>
        <tr>
          <th className={TH_CLASS}>اليوم</th>
          <th className={cn(TH_CLASS, "text-end")}>{header}</th>
        </tr>
      </thead>
      <tbody>
        {points.map((point) => (
          <tr key={point.fullLabel}>
            <td className={TD_CLASS}>{point.fullLabel}</td>
            <td className={cn(TD_CLASS, "text-end")}>{format(point.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RowTable({
  rows,
  first,
  second,
}: {
  rows: { label: string; value: number; note?: string }[];
  first: string;
  second: string;
}) {
  return (
    <table className={TABLE_CLASS}>
      <thead>
        <tr>
          <th className={TH_CLASS}>{first}</th>
          <th className={cn(TH_CLASS, "text-end")}>{second}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <td className={TD_CLASS}>{row.label}</td>
            <td className={cn(TD_CLASS, "text-end")}>
              {countFormatter.format(row.value)}
              {row.note && <span className="ms-2 text-muted-foreground">{row.note}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
