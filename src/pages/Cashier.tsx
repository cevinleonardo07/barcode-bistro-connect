
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { getMenuItems, getMenuCategories, getTables, createOrder, updateOrderStatus } from '@/services/mockData';
import { MenuItem, OrderItem, OrderStatus, Table } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Minus, Trash2, Receipt, CheckCircle, X } from 'lucide-react';

const Cashier = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');

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

  // Filter menu items by category
  const filteredMenuItems = activeCategory 
    ? menuItems.filter(item => item.category === activeCategory) 
    : menuItems;

  // Add item to cart
  const addToCart = (item: MenuItem) => {
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

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
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
      const order = createOrder(selectedTable.number, cart);
      
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Cashier</h1>
          <p className="text-muted-foreground">Create and manage orders</p>
        </div>
        
        <Tabs defaultValue={categories[0]} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-muted/50">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className="text-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenuItems.map(item => (
                  <Card 
                    key={item.id} 
                    className="cursor-pointer card-hover border-none shadow-sm overflow-hidden"
                    onClick={() => addToCart(item)}
                  >
                    {item.image && (
                      <div className="w-full h-36 overflow-hidden relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="h-10 line-clamp-2">{item.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <span className="font-bold">Rp {item.price.toLocaleString()}</span>
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <div className="lg:col-span-1">
        <Card className="border-none shadow-md sticky top-24 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Current Order</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCart}
                disabled={cart.length === 0}
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            </CardTitle>
            <CardDescription>
              {selectedTable 
                ? `Table ${selectedTable.number} (${selectedTable.seats} seats)` 
                : 'Select a table below'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {tables.map(table => (
                <Badge
                  key={table.id}
                  variant={table.status === 'available' ? 'outline' : 'secondary'}
                  className={`cursor-pointer px-3 py-2 transition-all ${
                    selectedTable?.id === table.id ? 'bg-primary text-primary-foreground' : ''
                  } ${table.status !== 'available' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (table.status === 'available') {
                      setSelectedTable(table);
                    } else {
                      toast({
                        description: `Table ${table.number} is ${table.status}`,
                        variant: "default",
                      });
                    }
                  }}
                >
                  {table.number}
                </Badge>
              ))}
            </div>
            
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between pb-2 border-b">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Rp {item.price.toLocaleString()} x {item.quantity}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No items in order
              </div>
            )}
          </CardContent>
          
          {cart.length > 0 && (
            <CardFooter className="flex-col">
              <Separator className="mb-4" />
              <div className="w-full flex justify-between mb-4">
                <span className="font-medium">Total</span>
                <span className="font-bold">Rp {calculateTotal().toLocaleString()}</span>
              </div>
              <Button 
                className="w-full"
                onClick={submitOrder}
                disabled={cart.length === 0 || !selectedTable}
              >
                <Receipt className="mr-2 h-4 w-4" /> Place Order
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Cashier;
