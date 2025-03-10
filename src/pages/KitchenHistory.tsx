
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Filter, AlertTriangle } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { getCompletedAndCancelledOrders } from '@/services/mockData';
import KitchenHistoryTable from '@/components/kitchen/KitchenHistoryTable';
import OrderFilters from '@/components/kitchen/OrderFilters';
import OrderStatusSummary from '@/components/kitchen/OrderStatusSummary';
import { toast } from '@/hooks/use-toast';

const KitchenHistory: React.FC = () => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(getCompletedAndCancelledOrders());
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'cancelled'>('all');
  
  const completedOrders = filteredOrders.filter(order => order.status === OrderStatus.COMPLETED);
  const cancelledOrders = filteredOrders.filter(order => order.status === OrderStatus.CANCELLED);
  
  const handleExport = (format: 'csv' | 'pdf') => {
    toast({
      title: `Export ${format.toUpperCase()} Started`,
      description: `Your ${format.toUpperCase()} export is being generated and will download shortly.`,
    });
    // In a real app, this would trigger the actual export functionality
    setTimeout(() => {
      toast({
        title: `Export Complete`,
        description: `Your ${format.toUpperCase()} has been exported successfully.`,
      });
    }, 2000);
  };

  const showDelayedOrderNotifications = () => {
    const delayedOrders = filteredOrders.filter(
      order => {
        if (!order.completionTime) return false;
        const orderTime = new Date(order.createdAt).getTime();
        const completionTime = new Date(order.completionTime).getTime();
        const minutesDiff = (completionTime - orderTime) / (1000 * 60);
        return minutesDiff > 30; // More than 30 minutes
      }
    );
    
    if (delayedOrders.length > 0) {
      toast({
        title: `${delayedOrders.length} Delayed Orders Detected`,
        description: `${delayedOrders.length} orders took longer than 30 minutes to complete.`,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Kitchen History | Bistro Connect</title>
      </Helmet>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kitchen History</h1>
          <p className="text-muted-foreground mt-1">
            View and analyze completed and canceled orders
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => handleExport('csv')} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            onClick={() => handleExport('pdf')} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
          <Button 
            onClick={showDelayedOrderNotifications} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Show Delayed
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <OrderStatusSummary 
          completedCount={completedOrders.length} 
          cancelledCount={cancelledOrders.length} 
        />
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-1">
          <CardTitle className="text-xl">Order History</CardTitle>
          <CardDescription>
            View all completed and canceled orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <OrderFilters 
              onFiltersChange={setFilteredOrders}
            />
            
            <Tabs defaultValue="all" onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <KitchenHistoryTable orders={filteredOrders} />
              </TabsContent>
              <TabsContent value="completed">
                <KitchenHistoryTable orders={completedOrders} />
              </TabsContent>
              <TabsContent value="cancelled">
                <KitchenHistoryTable orders={cancelledOrders} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default KitchenHistory;
