"use client";

import { Clock, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/features/settings/hooks/useSettings";


export function FooterContact() {
  const { data: settings, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 bg-white/10" />
        <Skeleton className="h-3 w-40 bg-white/10" />
      </div>
    );
  }

  const phone = settings?.storePhone 
  const hours = settings?.workingHours 

  return (
    <>
      {/* Spaces are fine to read and fatal to dial, so they're stripped from the href. */}
      <a
        href={`tel:${phone?.replace(/\s/g, "")}`}
        className="flex items-center gap-2 text-sm transition-colors hover:text-white"
      >
        <Phone className="size-4 shrink-0" aria-hidden />
        <span dir="ltr">{phone}</span>
      </a>

      <p className="mt-2 flex items-start gap-2 text-xs text-panel-muted">
        <Clock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        {hours}
      </p>
    </>
  );
}
