"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/shared/lib/format";
import { DeleteButton } from "@/shared/components/DeleteButton";
import {
  useDeliveryAreas,
  useCreateDeliveryArea,
  useUpdateDeliveryArea,
  useDeleteDeliveryArea,
} from "@/features/delivery-areas/hooks/useDeliveryAreas";

export function DeliveryAreasManager() {
  const { data: areas, isLoading } = useDeliveryAreas();
  const createArea = useCreateDeliveryArea();
  const updateArea = useUpdateDeliveryArea();
  const deleteArea = useDeleteDeliveryArea();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addArea = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("اكتب اسم المنطقة");
      return;
    }
    if (price === "" || Number(price) < 0) {
      toast.error("اكتب سعر توصيل صحيح");
      return;
    }

    createArea.mutate(
      { name: trimmed, price: Number(price) },
      {
        onSuccess: () => {
          setName("");
          setPrice("");
        },
      }
    );
  };

  if (isLoading) return <Skeleton className="h-56 rounded-xl" />;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="areaName">اسم المنطقة</Label>
          <Input
            id="areaName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="المعادي"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="areaPrice">سعر التوصيل</Label>
          <Input
            id="areaPrice"
            type="number"
            min="0"
            step="5"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="20"
          />
        </div>

        <Button type="button" onClick={addArea} disabled={createArea.isPending}>
          <Plus className="size-4" aria-hidden />
          إضافة
        </Button>
      </div>

      {!areas?.length ? (
        <p className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
          مفيش مناطق مضافة. من غير مناطق، بيتحسب سعر التوصيل الموحد من بيانات المتجر.
        </p>
      ) : (
        <ul className="divide-y rounded-xl border">
          {areas.map((area) => (
            <li key={area._id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-brand-900">{area.name}</p>
                <p className="text-sm text-muted-foreground">
                  {area.price > 0 ? formatPrice(area.price) : "توصيل مجاني"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor={`active-${area._id}`} className="text-xs font-normal">
                  متاحة
                </Label>
                <Switch
                  id={`active-${area._id}`}
                  checked={area.isActive}
                  onCheckedChange={(checked) =>
                    updateArea.mutate({ id: area._id, values: { isActive: checked } })
                  }
                />
              </div>

              <DeleteButton
                title={`حذف منطقة «${area.name}»؟`}
                description="الطلبات القديمة هتحتفظ باسم المنطقة وسعرها وقت الطلب."
                onConfirm={() => deleteArea.mutate(area._id)}
              />
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        أول ما تضيف منطقة واحدة، العميل هيبقى لازم يختار منطقته عند إتمام الطلب، وسعر
        التوصيل بيتحسب منها. إخفاء منطقة بيمنع اختيارها من غير ما يحذفها.
      </p>
    </div>
  );
}
