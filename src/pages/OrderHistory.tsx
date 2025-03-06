
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getOrders, getOrdersByStatus } from '@/services/mockData';
import { Order, OrderStatus } from '@/types';
import { Clock, CheckCircle, X, AlertTriangle, Package, Utensils } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = () => {
    if (filter === 'all') {
      setOrders(getOrders());
    } else {
      setOrders(getOrdersByStatus(filter as OrderStatus));
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return <Clock className="h-4 w-4 text-blue-500" />;
      case OrderStatus.PREPARING:
        return <Utensils className="h-4 w-4 text-orange-500" />;
      case OrderStatus.READY:
        return <Package className="h-4 w-4 text-green-500" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle className="h-4 w-4 text-indigo-500" />;
      case OrderStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case OrderStatus.CANCELLED:
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
    
    switch (status) {
      case OrderStatus.NEW:
        variant = "outline";
        break;
      case OrderStatus.PREPARING:
      case OrderStatus.READY:
        variant = "secondary";
        break;
      case OrderStatus.DELIVERED:
      case OrderStatus.COMPLETED:
        variant = "default";
        break;
      case OrderStatus.CANCELLED:
        variant = "destructive";
        break;
    }
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">View and track all orders</p>
      </div>

      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilter('all')}>
            All Orders
          </TabsTrigger>
          <TabsTrigger value={OrderStatus.NEW} onClick={() => setFilter(OrderStatus.NEW)}>
            New
          </TabsTrigger>
          <TabsTrigger value={OrderStatus.PREPARING} onClick={() => setFilter(OrderStatus.PREPARING)}>
            Preparing
          </TabsTrigger>
          <TabsTrigger value={OrderStatus.READY} onClick={() => setFilter(OrderStatus.READY)}>
            Ready
          </TabsTrigger>
          <TabsTrigger value={OrderStatus.COMPLETED} onClick={() => setFilter(OrderStatus.COMPLETED)}>
            Completed
          </TabsTrigger>
          <TabsTrigger value={OrderStatus.CANCELLED} onClick={() => setFilter(OrderStatus.CANCELLED)}>
            Cancelled
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(-4)}</CardTitle>
                    <CardDescription>
                      Table {order.tableNumber} • {formatDate(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t flex justify-between font-medium">
                    <span>Total</span>
                    <span>Rp {order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
