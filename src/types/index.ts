
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
  payment?: Payment;
  completionTime?: Date;
  assignedChef?: string;
  preparationNotes?: string;
  specialRequests?: string;
}

export interface Table {
  id: number;
  number: number;
  seats: number;
  status: "available" | "occupied" | "reserved";
  currentOrderId?: string;
}

export enum PaymentStatus {
  PAID = "paid",
  PENDING = "pending",
  FAILED = "failed"
}

export enum PaymentMethod {
  CASH = "cash",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  BANK_TRANSFER = "bank_transfer",
  E_WALLET = "e_wallet"
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  customerName?: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface SalesReport {
  totalRevenue: number;
  paymentMethodBreakdown: Record<PaymentMethod, number>;
  periodStart: Date;
  periodEnd: Date;
  transactionCount: number;
}

