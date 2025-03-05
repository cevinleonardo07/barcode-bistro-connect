
import { MenuItem, Order, OrderStatus, Table } from "@/types";

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

// Orders
export const orders: Order[] = [];

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

// Generate QR code URL for a table
export const getTableQRCodeUrl = (tableNumber: number): string => {
  // In a real app, this would generate an actual URL linking to the order page for this table
  // For this demo, we'll just return a placeholder
  return `/order/${tableNumber}`;
};
