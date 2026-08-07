"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/shared/components/Logo";
import { AwningValance } from "@/shared/components/illustrations/AwningValance";
import { HEADER_LINKS } from "@/shared/config/site";

/**
 * The header's nav on small screens.
 *
 * The bar itself only has room for the logo and the cart, and the links it drops were
 * unreachable anywhere else — which on a phone is the whole shop, and is where nearly
 * all of it is browsed.
 *
 * It opens as the stall does: the awning hangs over the header and the shop's sections
 * are the goods laid out beneath it. The same valance as the hero, so pulling the menu
 * out lands somewhere the customer has already been rather than in a panel that could
 * belong to any shop.
 */
export function StoreMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="فتح القائمة">
          <Menu className="size-5" aria-hidden />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-72 gap-0 bg-background p-0">
        <SheetTitle className="sr-only">قائمة التنقل</SheetTitle>

        <div className="relative bg-brand-50 px-4 pt-5 pb-9">
          <Logo withTagline />
          {/* Its own pattern id: on the home page the hero's valance is in the document too. */}
          <AwningValance id="awning-drawer" className="absolute inset-x-0 bottom-0 w-full" />
        </div>

        <nav className="flex flex-col gap-0.5 p-3">
          {HEADER_LINKS.map((link) => {
            // The hash links share a pathname with "/", so only an exact match counts.
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-4 py-3 font-display text-base transition-colors",
                  isActive
                    ? "bg-brand-50 font-bold text-brand-900"
                    : "text-foreground/80 hover:bg-brand-50/60 hover:text-brand-900"
                )}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-y-2.5 inset-s-0 w-1 rounded-full bg-brand-500"
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
