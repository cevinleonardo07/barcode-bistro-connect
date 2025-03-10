
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Activity } from 'lucide-react';

interface OrderStatusSummaryProps {
  completedCount: number;
  cancelledCount: number;
}

const OrderStatusSummary: React.FC<OrderStatusSummaryProps> = ({ 
  completedCount, 
  cancelledCount 
}) => {
  const totalOrders = completedCount + cancelledCount;
  const completionRate = totalOrders > 0 
    ? ((completedCount / totalOrders) * 100).toFixed(1) 
    : '0';

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            Orders in selected period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedCount}</div>
          <p className="text-xs text-muted-foreground">
            {completionRate}% completion rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cancelled Orders</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cancelledCount}</div>
          <p className="text-xs text-muted-foreground">
            {totalOrders > 0 ? ((cancelledCount / totalOrders) * 100).toFixed(1) : '0'}% cancellation rate
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default OrderStatusSummary;
