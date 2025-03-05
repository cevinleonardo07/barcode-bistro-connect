
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getOrdersByStatus, updateOrderStatus } from '@/services/mockData';
import { Order, OrderStatus } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Clock, CheckCircle, ChefHat, Bell } from 'lucide-react';

const Kitchen = () => {
  const { toast } = useToast();
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  
  const fetchOrders = () => {
    setNewOrders(getOrdersByStatus(OrderStatus.NEW));
    setPreparingOrders(getOrdersByStatus(OrderStatus.PREPARING));
    setReadyOrders(getOrdersByStatus(OrderStatus.READY));
  };

  useEffect(() => {
    fetchOrders();
    
    // Refresh orders every 5 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleStartPreparing = (orderId: string) => {
    const updated = updateOrderStatus(orderId, OrderStatus.PREPARING);
    if (updated) {
      toast({ description: `Started preparing order #${orderId.slice(-4)}` });
      fetchOrders();
    }
  };
  
  const handleOrderReady = (orderId: string) => {
    const updated = updateOrderStatus(orderId, OrderStatus.READY);
    if (updated) {
      toast({ description: `Order #${orderId.slice(-4)} is ready for service` });
      fetchOrders();
    }
  };
  
  const handleOrderDelivered = (orderId: string) => {
    const updated = updateOrderStatus(orderId, OrderStatus.DELIVERED);
    if (updated) {
      toast({ description: `Order #${orderId.slice(-4)} has been delivered` });
      fetchOrders();
    }
  };

  const renderOrderCard = (order: Order, actions: React.ReactNode) => (
    <Card key={order.id} className="mb-4 border-none shadow-md bg-white/80 backdrop-blur animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Table {order.tableNumber}</CardTitle>
            <CardDescription>
              Order #{order.id.slice(-4)} · {order.items.length} items
            </CardDescription>
          </div>
          <Badge
            variant={
              order.status === OrderStatus.NEW ? 'default' :
              order.status === OrderStatus.PREPARING ? 'secondary' :
              'outline'
            }
          >
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-2 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Ordered at {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span className="text-muted-foreground">
                  Rp {(item.price * item.quantity).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          {actions}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Kitchen Display</h1>
        <p className="text-muted-foreground">Manage orders in preparation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="mb-4 flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">New Orders</h2>
            <Badge variant="outline" className="ml-2">{newOrders.length}</Badge>
          </div>
          
          {newOrders.length > 0 ? (
            newOrders.map((order) => 
              renderOrderCard(order, (
                <Button 
                  onClick={() => handleStartPreparing(order.id)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <ChefHat className="mr-2 h-4 w-4" /> Start Preparing
                </Button>
              ))
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No new orders
            </div>
          )}
        </div>
        
        <div>
          <div className="mb-4 flex items-center">
            <ChefHat className="mr-2 h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-semibold">Preparing</h2>
            <Badge variant="outline" className="ml-2">{preparingOrders.length}</Badge>
          </div>
          
          {preparingOrders.length > 0 ? (
            preparingOrders.map((order) => 
              renderOrderCard(order, (
                <Button 
                  onClick={() => handleOrderReady(order.id)}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark as Ready
                </Button>
              ))
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No orders in preparation
            </div>
          )}
        </div>
        
        <div>
          <div className="mb-4 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold">Ready to Serve</h2>
            <Badge variant="outline" className="ml-2">{readyOrders.length}</Badge>
          </div>
          
          {readyOrders.length > 0 ? (
            readyOrders.map((order) => 
              renderOrderCard(order, (
                <Button 
                  variant="outline"
                  onClick={() => handleOrderDelivered(order.id)}
                >
                  Delivered to Table
                </Button>
              ))
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No orders ready to serve
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kitchen;
