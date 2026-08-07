import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { ProductsTable } from "@/features/products/components/ProductsTable";

export default function DashboardProductsPage() {
  return (
    <>
      <PageHeader
        title="المنتجات"
        description="أضف وعدّل المنتجات وأسعارها ومخزونها."
        action={
          <Button asChild>
            <Link href="/dashboard/products/add">
              <Plus className="size-4" aria-hidden />
              أضف منتج
            </Link>
          </Button>
        }
      />

      <ProductsTable />
    </>
  );
}
