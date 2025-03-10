import React, { useState, useEffect } from 'react';
import { getMenuItems, getMenuCategories, getTables, createOrder } from '@/services/mockData';
import { MenuItem, OrderItem, Table } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import ManualOrderDialog from '@/components/ManualOrderDialog';
import MenuItemsGrid from '@/components/cashier/MenuItemsGrid';
import CategoryTabs from '@/components/cashier/CategoryTabs';
import OrderCart from '@/components/cashier/OrderCart';
import MenuFilters from '@/components/cashier/MenuFilters';

const Cashier = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(true);

  useEffect(() => {
    // Get menu items and categories
    const items = getMenuItems();
    const cats = getMenuCategories();
    setMenuItems(items);
    setCategories(cats);
    setActiveCategory(cats[0] || '');
    
    // Get tables
    setTables(getTables());
  }, []);

  // Filter menu items by category and availability
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = !activeCategory || item.category === activeCategory;
    const matchesAvailability = showOnlyAvailable ? item.available : true;
    return matchesCategory && matchesAvailability;
  });

  // Toggle availability filter
  const toggleAvailabilityFilter = () => {
    setShowOnlyAvailable(!showOnlyAvailable);
    toast({
      description: `Showing ${!showOnlyAvailable ? 'only available' : 'all'} menu items`,
      duration: 1500,
    });
  };

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    if (item.outOfStock) {
      toast({
        description: `${item.name} is out of stock`,
        variant: "destructive",
        duration: 1500,
      });
      return;
    }
    
    const existingItem = cart.find(cartItem => cartItem.menuItemId === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.menuItemId === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      const newItem: OrderItem = {
        id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      };
      setCart([...cart, newItem]);
    }
    
    toast({
      description: `Added ${item.name} to order`,
      duration: 1500,
    });
  };

  // Update menu item
  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  // Update item quantity
  const updateQuantity = (id: string, change: number) => {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setSelectedTable(null);
  };

  // Submit order
  const submitOrder = () => {
    if (!selectedTable) {
      toast({
        title: "Select a table",
        description: "Please select a table before placing an order",
        variant: "destructive",
      });
      return;
    }
    
    if (cart.length === 0) {
      toast({
        title: "Empty order",
        description: "Please add at least one item to the order",
        variant: "destructive",
      });
      return;
    }
    
    try {
      createOrder(selectedTable.number, cart);
      
      toast({
        title: "Order placed successfully",
        description: `Order for Table ${selectedTable.number} has been sent to the kitchen`,
        variant: "default",
      });
      
      // Reset cart and selected table
      clearCart();
      
      // Update tables
      setTables(getTables());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    }
  };

  // Handle manual order creation
  const handleCreateManualOrder = (tableNumber: number, items: OrderItem[]) => {
    try {
      createOrder(tableNumber, items);
      
      toast({
        title: "Order placed successfully",
        description: `Order for Table ${tableNumber} has been sent to the kitchen`,
        variant: "default",
      });
      
      // Update tables
      setTables(getTables());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Cashier</h1>
              <p className="text-muted-foreground">Create and manage orders</p>
            </div>
            <div className="flex gap-2">
              <MenuFilters 
                showOnlyAvailable={showOnlyAvailable} 
                onToggleAvailability={toggleAvailabilityFilter} 
              />
              <ManualOrderDialog 
                tables={tables} 
                menuItems={menuItems} 
                onCreateOrder={handleCreateManualOrder} 
              />
            </div>
          </div>
        </div>
        
        <CategoryTabs 
          categories={categories} 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory}
        >
          <MenuItemsGrid 
            items={filteredMenuItems} 
            onAddToCart={addToCart}
            onUpdateMenuItem={updateMenuItem}
          />
        </CategoryTabs>
      </div>
      
      <div className="lg:col-span-1">
        <OrderCart 
          cart={cart}
          tables={tables}
          selectedTable={selectedTable}
          onSelectTable={setSelectedTable}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          onSubmitOrder={submitOrder}
        />
      </div>
    </div>
  );
};

export default Cashier;
