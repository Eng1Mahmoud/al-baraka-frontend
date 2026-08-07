import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { CategoriesManager } from "@/features/categories/components/CategoriesManager";

export default function DashboardCategoriesPage() {
  return (
    <>
      <PageHeader
        title="الأقسام"
        description="نظّم المنتجات في أقسام يتصفحها العميل."
        className="max-w-3xl"
      />
      <CategoriesManager />
    </>
  );
}
