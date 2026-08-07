"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings, useUpdateSettings } from "@/features/settings/hooks/useSettings";

/**
 * The unit list the product form offers ("كجم", "قطعة", ...). Editable here so
 * adding a new way to sell something never needs a code change.
 */
export function UnitsManager() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [draft, setDraft] = useState("");

  const units = settings?.units ?? [];

  const addUnit = () => {
    const value = draft.trim();
    if (!value) return;

    if (units.includes(value)) {
      toast.error("الوحدة دي موجودة بالفعل");
      return;
    }

    updateSettings.mutate({ units: [...units, value] });
    setDraft("");
  };

  const removeUnit = (unit: string) => {
    // Products already saved with this unit keep it — this only changes the choices
    // offered from now on.
    updateSettings.mutate({ units: units.filter((item) => item !== unit) });
  };

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {units.map((unit) => (
          <span
            key={unit}
            className="flex items-center gap-1.5 rounded-full border bg-brand-50 py-1.5 ps-3 pe-1.5 text-sm"
          >
            {unit}
            <button
              type="button"
              onClick={() => removeUnit(unit)}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={`حذف وحدة ${unit}`}
            >
              <X className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        {!units.length && <p className="text-sm text-muted-foreground">مفيش وحدات مضافة.</p>}
      </div>

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addUnit();
            }
          }}
          placeholder="مثال: نصف كيلو"
          aria-label="وحدة جديدة"
        />
        <Button type="button" onClick={addUnit} disabled={updateSettings.isPending}>
          <Plus className="size-4" aria-hidden />
          إضافة
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        حذف وحدة بيشيلها من اختيارات المنتج الجديد فقط — المنتجات المحفوظة بيها متتأثرش.
      </p>
    </div>
  );
}
