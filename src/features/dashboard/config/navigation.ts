import { LayoutDashboard, ShoppingBag, Carrot, Tags, Settings, Users } from "lucide-react";
import type { UserRole } from "@/features/auth/types/auth";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** Omit to show for every signed-in role. */
  roles?: UserRole[];
}

export const DASHBOARD_NAV: NavItem[] = [
  { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/dashboard/products", label: "المنتجات", icon: Carrot },
  { href: "/dashboard/categories", label: "التصنيفات", icon: Tags },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
  { href: "/dashboard/admins", label: "المشرفون", icon: Users, roles: ["superadmin"] },
];
