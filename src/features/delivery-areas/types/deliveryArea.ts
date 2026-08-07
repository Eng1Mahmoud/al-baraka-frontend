export interface DeliveryArea {
  _id: string;
  name: string;
  /** Delivery price for this area. */
  price: number;
  isActive: boolean;
  order: number;
  createdAt: string;
}
