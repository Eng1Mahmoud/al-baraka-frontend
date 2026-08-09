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
  pendingCount: number;
}

export interface OrderStats {
  todayOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}
