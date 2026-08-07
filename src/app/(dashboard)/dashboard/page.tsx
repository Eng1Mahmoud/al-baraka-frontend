import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="نظرة عامة" />
      <DashboardOverview />
    </>
  );
}
