/**
 * Static site chrome. Anything a shop owner changes day to day (phone, delivery
 * fee, working hours) lives in the Settings document and is edited from the
 * dashboard — these are only the fallbacks used before settings load.
 */


export const STORE_LINKS = [
  { href: "/products", label: "كل المنتجات" },
  { href: "/track", label: "تتبع طلبك" },
  { href: "/delivery-areas", label: "مناطق التوصيل" },
  { href: "/about", label: "من نحن" },
] as const;

/** The header's own nav. Shared by the desktop bar and the mobile drawer. */
export const HEADER_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن البركة" },
  { href: "/#categories", label: "الأقسام" },
  { href: "/products", label: "كل المنتجات" },
  // "Do you deliver to me?" decides whether the rest of the shop is worth browsing,
  // so it sits in the nav rather than only at the bottom of the page.
  { href: "/delivery-areas", label: "مناطق التوصيل" },
] as const;

export const ORDER_STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  preparing: "تحت التجهيز",
  out_for_delivery: "في الطريق",
  delivered: "تم التسليم",
  cancelled: "ملغي",
} as const;

/** Tailwind classes per status — mirrors the --color-status-* tokens. */
export const ORDER_STATUS_STYLES = {
  pending: "bg-status-pending/15 text-status-pending border-status-pending/30",
  confirmed: "bg-status-confirmed/15 text-status-confirmed border-status-confirmed/30",
  preparing: "bg-status-preparing/15 text-status-preparing border-status-preparing/30",
  out_for_delivery: "bg-status-delivering/15 text-status-delivering border-status-delivering/30",
  delivered: "bg-status-delivered/15 text-status-delivered border-status-delivered/30",
  cancelled: "bg-status-cancelled/15 text-status-cancelled border-status-cancelled/30",
} as const;
