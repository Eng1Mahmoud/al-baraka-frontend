import Link from "next/link";
import { Logo } from "@/shared/components/Logo";
import { STORE_LINKS } from "@/shared/config/site";
import { FooterContact } from "@/features/settings/components/FooterContact";
import { InstallAppCallout } from "@/features/pwa/components/InstallAppCallout";

export function Footer() {
  return (
    <footer className="mt-16 bg-panel text-panel-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
        <div className="flex flex-wrap justify-between gap-8 pb-8">
          <div className="min-w-[200px]">
            <Logo tone="light" />
            <p className="mt-3 max-w-56 text-sm text-panel-muted">
              خضار وفاكهة طازجة توصلك خلال ساعة.
            </p>
          </div>

          <nav aria-label="روابط مهمة" className="min-w-[140px]">
            <h2 className="mb-3 text-xs font-bold text-panel-muted">روابط مهمة</h2>
            <ul className="space-y-2 text-sm">
              {STORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-[180px]">
            <h2 className="mb-3 text-xs font-bold text-panel-muted">تواصل معنا</h2>
            <FooterContact />
          </div>

        
          <InstallAppCallout tone="light" className="min-w-[180px]" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-white/10 py-4 text-center text-[11px] text-panel-muted">
          <span>© {new Date().getFullYear()} البركة. جميع الحقوق محفوظة.</span>
          <span aria-hidden="true">·</span>
      
          <Link href="/login" className="transition-colors hover:text-white">
                  تسجيل الدخول
          </Link>
        </div>
      </div>
    </footer>
  );
}
