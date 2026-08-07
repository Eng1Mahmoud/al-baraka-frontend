import { PageHeader } from "@/features/dashboard/components/PageHeader";
import { EditProductForm } from "@/features/products/components/EditProductForm";

export default async function EditProductPage({ params }: PageProps<"/dashboard/products/[id]">) {
  const { id } = await params;

  return (
    <>
      <PageHeader title="تعديل المنتج" className="max-w-2xl" />

      <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-4 sm:p-6">
        <EditProductForm id={id} />
      </div>
    </>
  );
}
