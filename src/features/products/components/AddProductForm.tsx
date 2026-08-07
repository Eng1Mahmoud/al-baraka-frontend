"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/features/products/components/ProductForm";
import { useCreateProduct } from "@/features/products/hooks/useProducts";
import type { ProductFormValues } from "@/features/products/schemas/productSchema";

export function AddProductForm() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  const handleSubmit = async (values: ProductFormValues) => {
    await createProduct.mutateAsync(values);
    router.push("/dashboard/products");
  };

  return <ProductForm onSubmit={handleSubmit} submitLabel="حفظ المنتج" />;
}
