
import React, { useState, useEffect } from 'react';
import { getOrders } from '@/services/mockData';
import { Order, OrderStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import OrderHistoryTable from '@/components/orders/OrderHistoryTable';
import OrderStatusFilter from '@/components/orders/OrderStatusFilter';
import { useToast } from '@/components/ui/use-toast';

const OrderHistory = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const allOrders = getOrders();
      setOrders(allOrders);
      setFilteredOrders(allOrders);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error loading orders",
        description: "There was a problem loading the order history.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === selectedStatus));
    }
  }, [selectedStatus, orders]);

  const handleStatusChange = (status: OrderStatus | 'all') => {
    setSelectedStatus(status);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">View all orders placed in the restaurant</p>
        </div>
        <OrderStatusFilter selectedStatus={selectedStatus} onChange={handleStatusChange} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <OrderHistoryTable orders={filteredOrders} />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-lg text-muted-foreground mb-2">No orders found</p>
          <p className="text-sm text-muted-foreground">
            {selectedStatus === 'all' 
              ? "There are no orders in the system yet." 
              : `There are no orders with status "${selectedStatus}".`}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
