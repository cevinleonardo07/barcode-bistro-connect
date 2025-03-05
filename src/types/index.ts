
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export enum OrderStatus {
  NEW = "new",
  PREPARING = "preparing",
  READY = "ready",
  DELIVERED = "delivered",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  customerId?: string;
}

export interface Table {
  id: number;
  number: number;
  seats: number;
  status: "available" | "occupied" | "reserved";
  currentOrderId?: string;
}
