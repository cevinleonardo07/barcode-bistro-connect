
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { OrderStatus } from '@/types';

interface OrderStatusFilterProps {
  selectedStatus: OrderStatus | 'all';
  onChange: (status: OrderStatus | 'all') => void;
}

const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({ 
  selectedStatus,
  onChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Status:</span>
      <Select 
        value={selectedStatus} 
        onValueChange={(value) => onChange(value as OrderStatus | 'all')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Orders</SelectItem>
          <SelectItem value={OrderStatus.NEW}>New</SelectItem>
          <SelectItem value={OrderStatus.PREPARING}>Preparing</SelectItem>
          <SelectItem value={OrderStatus.READY}>Ready</SelectItem>
          <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
          <SelectItem value={OrderStatus.COMPLETED}>Completed</SelectItem>
          <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrderStatusFilter;
