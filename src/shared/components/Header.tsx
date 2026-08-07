import Link from "next/link";
import { Logo } from "@/shared/components/Logo";
import { StoreMobileNav } from "@/shared/components/StoreMobileNav";
import { CartButton } from "@/features/cart/components/CartButton";
import { HEADER_LINKS, STAFF_LINK } from "@/shared/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-6">
          <StoreMobileNav />
          <Logo withTagline />

          <nav className="hidden gap-5 text-sm font-medium sm:flex">
            {HEADER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-900 transition-colors hover:text-brand-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <CartButton />
        </div>
      </div>
    </header>
  );
}
