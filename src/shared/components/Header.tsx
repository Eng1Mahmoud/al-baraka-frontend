import Link from "next/link";
import { Logo } from "@/shared/components/Logo";
import { CartButton } from "@/features/cart/components/CartButton";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن البركة" },
  { href: "/#categories", label: "الأقسام" },
  { href: "/products", label: "كل المنتجات" },
  // "Do you deliver to me?" decides whether the rest of the shop is worth browsing,
  // so it sits in the nav rather than only at the bottom of the page.
  { href: "/delivery-areas", label: "مناطق التوصيل" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <Logo withTagline />
          <nav className="hidden gap-5 text-sm font-medium sm:flex">
            {NAV_LINKS.map((link) => (
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

        <CartButton />
      </div>
    </header>
  );
}
