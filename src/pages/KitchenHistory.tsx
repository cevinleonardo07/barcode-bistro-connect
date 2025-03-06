
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getOrders, getOrdersByStatus, updateOrderStatus } from '@/services/mockData';
import { Order, OrderStatus } from '@/types';
import { Clock, CheckCircle, Utensils, Package, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const KitchenHistory = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('new');

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

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">New</Badge>;
      case OrderStatus.PREPARING:
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Preparing</Badge>;
      case OrderStatus.READY:
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ready</Badge>;
      case OrderStatus.DELIVERED:
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Delivered</Badge>;
      case OrderStatus.COMPLETED:
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case OrderStatus.CANCELLED:
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getNextStatus = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case OrderStatus.NEW:
        return OrderStatus.PREPARING;
      case OrderStatus.PREPARING:
        return OrderStatus.READY;
      case OrderStatus.READY:
        return OrderStatus.DELIVERED;
      case OrderStatus.DELIVERED:
        return OrderStatus.COMPLETED;
      default:
        return currentStatus;
    }
  };

  const updateStatus = (orderId: string, currentStatus: OrderStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus !== currentStatus) {
      const updatedOrder = updateOrderStatus(orderId, nextStatus);
      if (updatedOrder) {
        toast({
          description: `Order #${orderId.slice(-4)} updated to ${nextStatus}`,
        });
        loadOrders();
      }
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActionButton = (order: Order) => {
    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
      return null;
    }

    const nextStatus = getNextStatus(order.status);
    let icon = <ArrowRight className="h-4 w-4" />;
    let label = "Next";

    switch (nextStatus) {
      case OrderStatus.PREPARING:
        icon = <Utensils className="h-4 w-4" />;
        label = "Start Preparing";
        break;
      case OrderStatus.READY:
        icon = <Package className="h-4 w-4" />;
        label = "Mark Ready";
        break;
      case OrderStatus.DELIVERED:
        icon = <CheckCircle className="h-4 w-4" />;
        label = "Mark Delivered";
        break;
      case OrderStatus.COMPLETED:
        icon = <CheckCircle className="h-4 w-4" />;
        label = "Complete";
        break;
    }

    return (
      <Button 
        size="sm" 
        className="mt-2" 
        onClick={() => updateStatus(order.id, order.status)}
      >
        {icon}
        <span className="ml-1">{label}</span>
      </Button>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Kitchen History</h1>
        <p className="text-muted-foreground">Track orders and update their status</p>
      </div>

      <Tabs defaultValue={OrderStatus.NEW} className="w-full mb-6">
        <TabsList>
          <TabsTrigger value={OrderStatus.NEW} onClick={() => setFilter(OrderStatus.NEW)}>
            New Orders
          </TabsTrigger>
          <TabsTrigger value={OrderStatus.PREPARING} onClick={() => setFilter(OrderStatus.PREPARING)}>
            In Preparation
          </TabsTrigger>
          <TabsTrigger value={OrderStatus.READY} onClick={() => setFilter(OrderStatus.READY)}>
            Ready
          </TabsTrigger>
          <TabsTrigger value="all" onClick={() => setFilter('all')}>
            All Orders
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Table {order.tableNumber}</CardTitle>
                    <CardDescription>
                      Order Time: {formatTime(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium mb-1">Items:</h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="font-medium">{item.quantity}x</span>
                      <span className="flex-1 ml-2">{item.name}</span>
                      {item.notes && <span className="text-xs text-muted-foreground">{item.notes}</span>}
                    </div>
                  ))}
                </div>
                {getActionButton(order)}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenHistory;
