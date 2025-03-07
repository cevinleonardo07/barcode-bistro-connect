import { MenuItem, Order, OrderStatus, PaymentMethod, PaymentStatus, Payment, SalesReport, Table } from "@/types";

// Menu Items
export const menuItems: MenuItem[] = [
  {
    id: "m1",
    name: "Nasi Goreng Special",
    description: "Nasi goreng dengan telur, ayam, dan sayuran",
    price: 45000,
    category: "Main",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1170&auto=format&fit=crop",
    available: true
  },
  {
    id: "m2",
    name: "Mie Goreng",
    description: "Mie goreng dengan telur dan sayuran",
    price: 40000,
    category: "Main",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=992&auto=format&fit=crop",
    available: true
  },
  {
    id: "m3",
    name: "Sate Ayam",
    description: "Sate ayam dengan bumbu kacang",
    price: 35000,
    category: "Appetizer",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=987&auto=format&fit=crop",
    available: true
  },
  {
    id: "m4",
    name: "Es Teh Manis",
    description: "Teh manis dingin",
    price: 10000,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=1064&auto=format&fit=crop",
    available: true
  },
  {
    id: "m5",
    name: "Jus Alpukat",
    description: "Jus alpukat segar",
    price: 18000,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1623073284788-4d12c0e9522a?q=80&w=1170&auto=format&fit=crop",
    available: true
  },
  {
    id: "m6",
    name: "Pisang Goreng",
    description: "Pisang goreng dengan madu",
    price: 25000,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1623239715130-50a72f3aad84?q=80&w=1170&auto=format&fit=crop",
    available: true
  },
  {
    id: "m7",
    name: "Ayam Goreng",
    description: "Ayam goreng dengan sambal",
    price: 38000,
    category: "Main",
    image: "https://images.unsplash.com/photo-1588171397433-9a4c611dc53b?q=80&w=1171&auto=format&fit=crop",
    available: true
  },
  {
    id: "m8",
    name: "Sop Buntut",
    description: "Sop buntut sapi dengan rempah",
    price: 65000,
    category: "Main",
    image: "https://images.unsplash.com/photo-1583835746434-cf1534389335?q=80&w=1074&auto=format&fit=crop",
    available: true
  }
];

// Tables
export const tables: Table[] = [
  { id: 1, number: 1, seats: 2, status: "available" },
  { id: 2, number: 2, seats: 2, status: "available" },
  { id: 3, number: 3, seats: 4, status: "available" },
  { id: 4, number: 4, seats: 4, status: "available" },
  { id: 5, number: 5, seats: 6, status: "available" },
  { id: 6, number: 6, seats: 6, status: "available" },
  { id: 7, number: 7, seats: 8, status: "available" },
  { id: 8, number: 8, seats: 8, status: "available" }
];

// Mock payment data
export const payments: Payment[] = [
  {
    id: "payment-1",
    orderId: "order-1689231433-123",
    amount: 110000,
    method: PaymentMethod.CASH,
    status: PaymentStatus.PAID,
    customerName: "John Doe",
    createdAt: new Date(2023, 10, 15, 13, 15),
    updatedAt: new Date(2023, 10, 15, 13, 15)
  },
  {
    id: "payment-2",
    orderId: "order-1689231433-124",
    amount: 58000,
    method: PaymentMethod.BANK_TRANSFER,
    status: PaymentStatus.PENDING,
    transactionId: "TRX-12345678",
    customerName: "Jane Smith",
    createdAt: new Date(Date.now() - 15 * 60000),
    updatedAt: new Date(Date.now() - 15 * 60000)
  },
  {
    id: "payment-3",
    orderId: "order-1689231433-125",
    amount: 100000,
    method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.FAILED,
    transactionId: "TRX-87654321",
    customerName: "Bob Johnson",
    createdAt: new Date(Date.now() - 5 * 60000),
    updatedAt: new Date(Date.now() - 5 * 60000),
    notes: "Card declined"
  },
  {
    id: "payment-4",
    orderId: "order-1689231433-126",
    amount: 75000,
    method: PaymentMethod.E_WALLET,
    status: PaymentStatus.PAID,
    transactionId: "EW-123456",
    customerName: "Alice Brown",
    createdAt: new Date(2023, 10, 14, 18, 30),
    updatedAt: new Date(2023, 10, 14, 18, 30)
  },
  {
    id: "payment-5",
    orderId: "order-1689231433-127",
    amount: 120000,
    method: PaymentMethod.DEBIT_CARD,
    status: PaymentStatus.PAID,
    transactionId: "DC-789012",
    customerName: "Charlie Davis",
    createdAt: new Date(2023, 10, 14, 12, 45),
    updatedAt: new Date(2023, 10, 14, 12, 45)
  }
];

// Orders
export const orders: Order[] = [
  {
    id: "order-1689231433-123",
    tableNumber: 1,
    items: [
      {
        id: "item-1689231433-123",
        menuItemId: "m1",
        name: "Nasi Goreng Special",
        price: 45000,
        quantity: 2
      },
      {
        id: "item-1689231433-124",
        menuItemId: "m4",
        name: "Es Teh Manis",
        price: 10000,
        quantity: 2
      }
    ],
    status: OrderStatus.COMPLETED,
    totalAmount: 110000,
    createdAt: new Date(2023, 10, 15, 12, 30),
    updatedAt: new Date(2023, 10, 15, 13, 15)
  },
  {
    id: "order-1689231433-124",
    tableNumber: 3,
    items: [
      {
        id: "item-1689231433-125",
        menuItemId: "m2",
        name: "Mie Goreng",
        price: 40000,
        quantity: 1
      },
      {
        id: "item-1689231433-126",
        menuItemId: "m5",
        name: "Jus Alpukat",
        price: 18000,
        quantity: 1
      }
    ],
    status: OrderStatus.PREPARING,
    totalAmount: 58000,
    createdAt: new Date(Date.now() - 20 * 60000), // 20 minutes ago
    updatedAt: new Date(Date.now() - 15 * 60000)
  },
  {
    id: "order-1689231433-125",
    tableNumber: 5,
    items: [
      {
        id: "item-1689231433-127",
        menuItemId: "m3",
        name: "Sate Ayam",
        price: 35000,
        quantity: 2
      },
      {
        id: "item-1689231433-128",
        menuItemId: "m4",
        name: "Es Teh Manis",
        price: 10000,
        quantity: 3
      }
    ],
    status: OrderStatus.NEW,
    totalAmount: 100000,
    createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    updatedAt: new Date(Date.now() - 5 * 60000)
  }
];

// Helper functions to simulate backend operations
export const getMenuItems = (): MenuItem[] => {
  return menuItems;
};

export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  return menuItems.filter(item => item.category === category);
};

export const getMenuCategories = (): string[] => {
  const categories = new Set(menuItems.map(item => item.category));
  return Array.from(categories);
};

export const getTables = (): Table[] => {
  return tables;
};

export const getTableById = (id: number): Table | undefined => {
  return tables.find(table => table.id === id);
};

export const updateTableStatus = (id: number, status: "available" | "occupied" | "reserved", orderId?: string): Table | undefined => {
  const tableIndex = tables.findIndex(table => table.id === id);
  if (tableIndex === -1) return undefined;
  
  tables[tableIndex] = {
    ...tables[tableIndex],
    status,
    currentOrderId: orderId
  };
  
  return tables[tableIndex];
};

export const getOrders = (): Order[] => {
  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getOrdersByStatus = (status: OrderStatus): Order[] => {
  return orders.filter(order => order.status === status)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getOrderById = (id: string): Order | undefined => {
  return orders.find(order => order.id === id);
};

export const createOrder = (tableNumber: number, items: Order["items"]): Order => {
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const newOrder: Order = {
    id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    tableNumber,
    items,
    status: OrderStatus.NEW,
    totalAmount,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  orders.push(newOrder);
  
  // Update table status
  const table = tables.find(t => t.number === tableNumber);
  if (table) {
    updateTableStatus(table.id, "occupied", newOrder.id);
  }
  
  return newOrder;
};

export const updateOrderStatus = (id: string, status: OrderStatus): Order | undefined => {
  const orderIndex = orders.findIndex(order => order.id === id);
  if (orderIndex === -1) return undefined;
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date()
  };
  
  // If order is completed or cancelled, update table status
  if (status === OrderStatus.COMPLETED || status === OrderStatus.CANCELLED) {
    const table = tables.find(t => t.number === orders[orderIndex].tableNumber);
    if (table) {
      updateTableStatus(table.id, "available", undefined);
    }
  }
  
  return orders[orderIndex];
};

// Payment related functions
export const getPayments = (): Payment[] => {
  return payments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getPaymentsByStatus = (status: PaymentStatus): Payment[] => {
  return payments.filter(payment => payment.status === status)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getPaymentsByMethod = (method: PaymentMethod): Payment[] => {
  return payments.filter(payment => payment.method === method)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getPaymentsByDateRange = (startDate: Date, endDate: Date): Payment[] => {
  return payments.filter(payment => {
    const paymentDate = new Date(payment.createdAt);
    return paymentDate >= startDate && paymentDate <= endDate;
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getPaymentById = (id: string): Payment | undefined => {
  return payments.find(payment => payment.id === id);
};

export const updatePaymentStatus = (id: string, status: PaymentStatus, notes?: string): Payment | undefined => {
  const paymentIndex = payments.findIndex(payment => payment.id === id);
  if (paymentIndex === -1) return undefined;
  
  payments[paymentIndex] = {
    ...payments[paymentIndex],
    status,
    notes: notes ? notes : payments[paymentIndex].notes,
    updatedAt: new Date()
  };
  
  return payments[paymentIndex];
};

export const generateSalesReport = (startDate: Date, endDate: Date): SalesReport => {
  const relevantPayments = getPaymentsByDateRange(startDate, endDate).filter(p => p.status === PaymentStatus.PAID);
  
  const totalRevenue = relevantPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const transactionCount = relevantPayments.length;
  
  const paymentMethodBreakdown = relevantPayments.reduce((acc, payment) => {
    acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
    return acc;
  }, {} as Record<PaymentMethod, number>);
  
  // Ensure all payment methods are represented in the breakdown
  Object.values(PaymentMethod).forEach(method => {
    if (!paymentMethodBreakdown[method]) {
      paymentMethodBreakdown[method] = 0;
    }
  });
  
  return {
    totalRevenue,
    paymentMethodBreakdown,
    periodStart: startDate,
    periodEnd: endDate,
    transactionCount
  };
};

// Generate QR code URL for a table
export const getTableQRCodeUrl = (tableNumber: number): string => {
  // In a real app, this would generate an actual URL linking to the order page for this table
  // For this demo, we'll just return a placeholder
  return `/order/${tableNumber}`;
};
