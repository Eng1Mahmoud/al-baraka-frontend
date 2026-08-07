import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { AddProductForm } from "@/features/products/components/AddProductForm";

export default function AddProductPage() {
  return (
    <>
      <PageHeader title="إضافة منتج" className="max-w-2xl" />

      <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-4 sm:p-6">
        <AddProductForm />
      </div>
    </>
  );
}
