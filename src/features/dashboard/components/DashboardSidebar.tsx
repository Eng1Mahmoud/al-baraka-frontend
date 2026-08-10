"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/shared/components/Logo";
import { DASHBOARD_NAV } from "@/features/dashboard/config/navigation";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/useAuth";

/** Shared by the desktop sidebar and the mobile drawer. */
export function DashboardNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const items = DASHBOARD_NAV.filter((item) => !item.roles || (user && item.roles.includes(user.role)));

  /*
    The most specific match wins, rather than every prefix match lighting up.

    `/dashboard` is a prefix of every other entry, so on `/dashboard/orders/abc` the
    plain prefix test made "نظرة عامة" and "الطلبات" both look current — and the
    overview item was highlighted on every screen in the dashboard. Taking the longest
    matching href settles that without an `exact` flag on each entry.
  */
  const activeHref = items.reduce(
    (best, item) =>
      (pathname === item.href || pathname.startsWith(`${item.href}/`)) &&
      item.href.length > best.length
        ? item.href
        : best,
    ""
  );

  return (
    <div className="flex h-full flex-col gap-6">
      <Logo tone="light" className="px-2 pt-2" />

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-primary font-semibold text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div>
        {user && (
          <p className="mb-2 px-3 text-xs text-sidebar-foreground/70">
            {user.name} · {user.role === "superadmin" ? "مدير عام" : "مشرف"}
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => logout.mutate()}
        >
          <LogOut className="size-4" aria-hidden />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  return (
    // Its own scroller: the shell is pinned to the viewport now, so a nav that ever
    // outgrows a short screen scrolls here rather than being clipped.
    <aside className="hidden w-60 shrink-0 overflow-y-auto bg-sidebar p-4 text-sidebar-foreground md:block">
      <DashboardNav />
    </aside>
  );
}
