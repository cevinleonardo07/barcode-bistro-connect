
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { getMenuItems, getMenuCategories, getTableById, createOrder } from '@/services/mockData';
import { MenuItem, OrderItem, Table } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Minus, Trash2, Receipt, QrCode, ArrowLeft, Coffee, Search } from 'lucide-react';

const OrderPage = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const { toast } = useToast();
  const [table, setTable] = useState<Table | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    if (tableId) {
      const foundTable = getTableById(parseInt(tableId));
      if (foundTable) {
        setTable(foundTable);
      } else {
        toast({
          title: "Table not found",
          description: "The requested table couldn't be found",
          variant: "destructive",
        });
      }
    }
    
    // Get menu items and categories
    const items = getMenuItems();
    const cats = getMenuCategories();
    setMenuItems(items);
    setCategories(cats);
    setActiveCategory(cats[0] || '');
  }, [tableId, toast]);

  // Filter menu items by category and search term
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = !activeCategory || item.category === activeCategory;
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

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

  // Submit order
  const submitOrder = () => {
    if (!table) {
      toast({
        title: "Table not found",
        description: "Cannot place order: table information is missing",
        variant: "destructive",
      });
      return;
    }
    
    if (cart.length === 0) {
      toast({
        title: "Empty order",
        description: "Please add at least one item to your order",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const order = createOrder(table.number, cart);
      
      toast({
        title: "Order placed successfully",
        description: `Your order has been sent to the kitchen. Order #${order.id.slice(-4)}`,
        variant: "default",
      });
      
      // Reset cart
      setCart([]);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again or call a server.",
        variant: "destructive",
      });
    }
  };

  if (!table) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[350px] text-center">
          <CardHeader>
            <CardTitle>Table Not Found</CardTitle>
            <CardDescription>The requested table couldn't be found</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-32 animate-fade-in">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center text-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back</span>
          </Link>
          <div className="flex items-center">
            <QrCode className="w-5 h-5 mr-2 text-primary" />
            <h1 className="font-semibold">Table {table.number}</h1>
          </div>
          <Badge variant="outline" className="ml-2">{table.seats} seats</Badge>
        </div>
      </header>
      
      <main className="container mx-auto px-4 mt-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Menu</h2>
          <p className="text-muted-foreground">Browse and place your order directly from your table</p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="bg-muted/50 mb-6 overflow-auto flex-nowrap no-scrollbar">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => {
                  setActiveCategory(category);
                  setSearchTerm('');
                }}
                className="text-sm whitespace-nowrap"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="space-y-4">
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map(item => (
                <Card 
                  key={item.id} 
                  className="flex overflow-hidden border-none shadow-sm" 
                  onClick={() => addToCart(item)}
                >
                  {item.image && (
                    <div className="w-1/3 overflow-hidden relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 font-semibold">
                      Rp {item.price.toLocaleString()}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm
                  ? `No items found matching "${searchTerm}"`
                  : "No items available in this category"}
              </div>
            )}
          </div>
        </Tabs>
      </main>
      
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-4 z-40 animate-slide-in-right">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Your Order</h3>
              <Badge variant="outline">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</Badge>
            </div>
            
            <div className="max-h-40 overflow-y-auto mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex-1 ml-2">
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total</span>
              <span className="font-bold">Rp {calculateTotal().toLocaleString()}</span>
            </div>
            
            <Button className="w-full" onClick={submitOrder}>
              <Receipt className="mr-2 h-4 w-4" /> Place Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
