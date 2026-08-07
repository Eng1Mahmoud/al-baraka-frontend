"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DashboardNav } from "@/features/dashboard/components/DashboardSidebar";

export function DashboardMobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="فتح القائمة">
          <Menu className="size-5" aria-hidden />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-64 bg-sidebar p-4 text-sidebar-foreground">
        <SheetTitle className="sr-only">قائمة لوحة التحكم</SheetTitle>
        <DashboardNav onNavigate={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
