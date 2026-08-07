import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { AdminsManager } from "@/features/admins/components/AdminsManager";

export default function AdminsPage() {
  return (
    <>
      <PageHeader
        title="المشرفون"
        description="المدير العام وحده هو اللي يقدر يضيف أو يحذف حسابات المشرفين."
        className="max-w-3xl"
      />

      <AdminsManager />
    </>
  );
}
