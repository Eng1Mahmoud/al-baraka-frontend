import { PageLoader } from "@/shared/components/PageLoader";

/**
 * Sits inside the dashboard layout, so the sidebar and header stay put while only
 * the panel swaps — the root loader would blank those out on every navigation.
 */
export default function DashboardLoading() {
  return <PageLoader label="بنحمّل البيانات" />;
}
