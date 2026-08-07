"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/features/categories/components/CategoryForm";
import { useUpdateCategory } from "@/features/categories/hooks/useCategories";
import type { Category } from "@/features/categories/types/category";

export function EditCategoryDialog({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const updateCategory = useUpdateCategory(category._id);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="size-4" aria-hidden />
          تعديل
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>تعديل «{category.name}»</DialogTitle>
        </DialogHeader>

        <CategoryForm
          defaultValues={{
            name: category.name,
            image: category.image ?? "",
            order: category.order,
          }}
          submitLabel="حفظ التغييرات"
          onSubmit={async (values) => {
            await updateCategory.mutateAsync(values);
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
