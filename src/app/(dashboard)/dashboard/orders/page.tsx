import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { OrdersTable } from "@/features/orders/components/OrdersTable";

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="الطلبات" description="بتتحدث تلقائيًا كل 5 ثواني." />
      <OrdersTable />
    </>
  );
}
