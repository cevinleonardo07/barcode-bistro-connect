
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Check, 
  Clock, 
  X,
  AlertTriangle,
  User
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import KitchenOrderDetailsDialog from './KitchenOrderDetailsDialog';

interface KitchenHistoryTableProps {
  orders: Order[];
}

const KitchenHistoryTable: React.FC<KitchenHistoryTableProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return <Check className="h-4 w-4 text-green-500" />;
      case OrderStatus.CANCELLED:
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderDuration = (order: Order) => {
    if (!order.completionTime) return "N/A";
    
    const orderTime = new Date(order.createdAt).getTime();
    const completionTime = new Date(order.completionTime).getTime();
    const minutesDiff = (completionTime - orderTime) / (1000 * 60);
    
    if (minutesDiff > 30) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          {minutesDiff.toFixed(0)} min
        </div>
      );
    }
    
    return `${minutesDiff.toFixed(0)} min`;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Order Time</TableHead>
              <TableHead>Completion Time</TableHead>
              <TableHead>Prep Time</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Chef</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow 
                  key={order.id} 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                  <TableCell>Table {order.tableNumber}</TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'HH:mm, MMM d')}</TableCell>
                  <TableCell>
                    {order.completionTime 
                      ? format(new Date(order.completionTime), 'HH:mm, MMM d')
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>{getOrderDuration(order)}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`flex w-fit items-center gap-1 ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.assignedChef ? (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {order.assignedChef}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <KitchenOrderDetailsDialog 
          order={selectedOrder} 
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default KitchenHistoryTable;
