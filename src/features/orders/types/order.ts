export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city?: string;
    notes?: string;
  };
  items: OrderItem[];
  /** Snapshot of the delivery area chosen at checkout. */
  deliveryArea?: { area: string; name: string; price: number };
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "cash_on_delivery";
  paymentStatus: PaymentStatus;
  createdAt: string;
}

/**
 * What the public /track lookup returns.
 *
 * Without the customer block: order numbers are sequential, so the endpoint answers
 * to a guessed one, and it must not hand out a name, phone or address when it does.
 */
export type TrackedOrder = Omit<Order, "customer">;

export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  pages: number;
  hasMore: boolean;
  pendingCount: number;
}

export interface OrderStats {
  todayOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

/** One day in the trend series. Every day in the window is present, quiet ones as zeros. */
export interface DailyPoint {
  /** `YYYY-MM-DD`, in the shop's own timezone. */
  date: string;
  orders: number;
  revenue: number;
}

export interface OrderAnalytics {
  daily: DailyPoint[];
  /** Every status the shop has orders in — cancelled included, unlike the totals above. */
  byStatus: { status: OrderStatus; count: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
}
