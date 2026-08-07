"use client";

import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductForm } from "@/features/products/components/ProductForm";
import { useProduct, useUpdateProduct } from "@/features/products/hooks/useProducts";
import type { ProductFormValues } from "@/features/products/schemas/productSchema";

export function EditProductForm({ id }: { id: string }) {
  const router = useRouter();
  const { data: product, isLoading, isError } = useProduct(id);
  const updateProduct = useUpdateProduct(id);

  if (isLoading) return <Skeleton className="h-96 w-full rounded-xl" />;

  if (isError || !product) {
    return <p className="py-10 text-center text-sm text-destructive">المنتج ده مش موجود.</p>;
  }

  const handleSubmit = async (values: ProductFormValues) => {
    await updateProduct.mutateAsync(values);
    router.push("/dashboard/products");
  };

  return (
    <ProductForm
      // The API populates category as an object; the form needs its id.
      defaultValues={{
        name: product.name,
        description: product.description ?? "",
        category: product.category._id,
        price: product.price,
        discountPrice: product.discountPrice,
        unit: product.unit,
        stock: product.stock,
        images: product.images,
        isAvailable: product.isAvailable,
      }}
      onSubmit={handleSubmit}
      submitLabel="حفظ التغييرات"
    />
  );
}
