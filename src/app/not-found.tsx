import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/shared/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-brand-50 px-6 py-16 text-center">
      <Logo className="mb-10" />

      {/* An empty crate: the 404 told in the shop's own vocabulary. */}
      <svg
        viewBox="0 0 240 170"
        className="mb-8 w-56"
        role="img"
        aria-label="قفص فاضي"
      >
        <rect x="20" y="60" width="200" height="80" rx="10" fill="#C99A5B" />
        <rect x="20" y="60" width="200" height="80" rx="10" fill="none" stroke="#A87B41" strokeWidth="4" />
        <rect x="32" y="76" width="176" height="12" rx="6" fill="#E0B478" />
        <rect x="32" y="100" width="176" height="12" rx="6" fill="#E0B478" />
        <rect x="32" y="124" width="176" height="10" rx="5" fill="#E0B478" />
        <rect x="90" y="60" width="12" height="80" fill="#A87B41" fillOpacity="0.5" />
        <rect x="150" y="60" width="12" height="80" fill="#A87B41" fillOpacity="0.5" />
        <path
          d="M120 44c-10-4-16-14-13-24 10-2 20 4 23 13"
          fill="var(--color-brand-500)"
          opacity="0.6"
        />
      </svg>

      <p className="mb-2 font-display text-5xl font-extrabold text-brand-900">٤٠٤</p>
      <h1 className="mb-3 font-display text-xl font-bold text-brand-900">
        الصفحة دي مش موجودة
      </h1>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground">
        يمكن الرابط اتغير أو المنتج اتشال. جرّب ترجع للرئيسية أو تتصفح المنتجات.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="size-4" aria-hidden />
            الصفحة الرئيسية
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">
            <Search className="size-4" aria-hidden />
            تصفح المنتجات
          </Link>
        </Button>
      </div>
    </main>
  );
}
