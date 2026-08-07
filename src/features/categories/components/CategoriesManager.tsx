"use client";

import Image from "next/image";
import { Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteButton } from "@/shared/components/DeleteButton";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { EditCategoryDialog } from "@/features/categories/components/EditCategoryDialog";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/features/categories/hooks/useCategories";

export function CategoriesManager() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6">
      <Card>
        <CardHeader>
          <CardTitle>إضافة قسم</CardTitle>
          <CardDescription>الأقسام بتظهر في الصفحة الرئيسية وفي فلترة المنتجات.</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryForm
            onSubmit={(values) => createCategory.mutateAsync(values)}
            submitLabel="إضافة القسم"
            resetOnSuccess
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : !categories?.length ? (
        <p className="rounded-xl border border-dashed bg-card py-12 text-center text-sm text-muted-foreground">
          لا توجد أقسام بعد. ابدأ بإضافة أول قسم من فوق.
        </p>
      ) : (
        <ul className="divide-y rounded-xl border bg-card">
          {categories.map((category) => (
            <li key={category._id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-brand-100">
                {category.image ? (
                  <Image src={category.image} alt="" fill sizes="56px" className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-brand-500">
                    <Leaf className="size-5" aria-hidden />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-brand-900">{category.name}</p>
                <p className="text-xs text-muted-foreground">ترتيب العرض: {category.order}</p>
              </div>

              <div className="flex gap-1">
                <EditCategoryDialog category={category} />
                <DeleteButton
                  title={`حذف قسم «${category.name}»؟`}
                  description="لا يمكن حذف قسم يحتوي على منتجات — انقل منتجاته أولًا."
                  onConfirm={() => deleteCategory.mutate(category._id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
