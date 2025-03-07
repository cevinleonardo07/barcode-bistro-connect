
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
  Coffee, 
  X,
  ChefHat,
  Bell
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import OrderDetailsDialog from './OrderDetailsDialog';

interface OrderHistoryTableProps {
  orders: Order[];
}

const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return <Check className="h-4 w-4 text-green-500" />;
      case OrderStatus.CANCELLED:
        return <X className="h-4 w-4 text-red-500" />;
      case OrderStatus.NEW:
        return <Clock className="h-4 w-4 text-blue-500" />;
      case OrderStatus.PREPARING:
        return <ChefHat className="h-4 w-4 text-yellow-500" />;
      case OrderStatus.READY:
        return <Bell className="h-4 w-4 text-purple-500" />;
      case OrderStatus.DELIVERED:
        return <Coffee className="h-4 w-4 text-orange-500" />;
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
      case OrderStatus.NEW:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.PREPARING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.READY:
        return "bg-purple-100 text-purple-800";
      case OrderStatus.DELIVERED:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id} 
                className="cursor-pointer hover:bg-muted"
                onClick={() => setSelectedOrder(order)}
              >
                <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                <TableCell>Table {order.tableNumber}</TableCell>
                <TableCell>{order.items.length} items</TableCell>
                <TableCell>Rp {order.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`flex w-fit items-center gap-1 ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <OrderDetailsDialog 
          order={selectedOrder} 
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default OrderHistoryTable;
