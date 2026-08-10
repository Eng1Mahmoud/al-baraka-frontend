import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { DashboardAnalytics } from "@/features/dashboard/components/DashboardAnalytics";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="نظرة عامة" />

      {/* The tiles are today-and-lifetime figures, so they sit above the range picker
          rather than under it — a filter only ever scopes what is below it. */}
      <DashboardOverview />

      <div className="mt-8">
        <DashboardAnalytics />
      </div>
    </>
  );
}
