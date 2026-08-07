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
