import { OrderDetail } from "@/features/orders/components/OrderDetail";

export default async function OrderDetailPage({ params }: PageProps<"/dashboard/orders/[id]">) {
  const { id } = await params;

  return <OrderDetail id={id} />;
}
