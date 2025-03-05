
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrders, getTables, getOrdersByStatus } from '@/services/mockData';
import { OrderStatus } from '@/types';
import { Utensils, Users, ChefHat, Clock, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [totalTables, setTotalTables] = useState(0);
  const [occupiedTables, setOccupiedTables] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);

  useEffect(() => {
    // Get tables data
    const tables = getTables();
    setTotalTables(tables.length);
    setOccupiedTables(tables.filter(table => table.status === 'occupied').length);
    
    // Get orders data
    const orders = getOrders();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate active orders (not completed or cancelled)
    const active = orders.filter(order => 
      ![OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(order.status)
    ).length;
    setActiveOrders(active);
    
    // Calculate pending orders (new and preparing)
    const pending = orders.filter(order => 
      [OrderStatus.NEW, OrderStatus.PREPARING].includes(order.status)
    ).length;
    setPendingOrders(pending);
    
    // Calculate today's revenue
    const revenue = orders
      .filter(order => 
        order.status === OrderStatus.COMPLETED && 
        order.createdAt >= today
      )
      .reduce((sum, order) => sum + order.totalAmount, 0);
    setDailyRevenue(revenue);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover border-none shadow-md bg-white/80 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Occupied Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {occupiedTables} <span className="text-muted-foreground text-sm font-normal">/ {totalTables}</span>
              </div>
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover border-none shadow-md bg-white/80 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{activeOrders}</div>
              <Utensils className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover border-none shadow-md bg-white/80 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending in Kitchen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <ChefHat className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover border-none shadow-md bg-white/80 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">Rp {dailyRevenue.toLocaleString()}</div>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-none bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders across all tables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md">
              {getOrders().slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div>
                    <div className="font-medium">Table {order.tableNumber}</div>
                    <div className="text-sm text-muted-foreground">{order.items.length} items</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">Rp {order.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === OrderStatus.NEW ? 'bg-blue-100 text-blue-800' :
                        order.status === OrderStatus.PREPARING ? 'bg-yellow-100 text-yellow-800' :
                        order.status === OrderStatus.READY ? 'bg-green-100 text-green-800' :
                        order.status === OrderStatus.DELIVERED ? 'bg-indigo-100 text-indigo-800' :
                        order.status === OrderStatus.COMPLETED ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {getOrders().length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No orders yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-none bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Kitchen Orders</CardTitle>
            <CardDescription>Orders waiting to be prepared</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md">
              {getOrdersByStatus(OrderStatus.NEW).slice(0, 3).map((order) => (
                <div key={order.id} className="p-4 border-b last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Table {order.tableNumber}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      {new Date().getTime() - order.createdAt.getTime() < 60000
                        ? 'Just now'
                        : `${Math.floor((new Date().getTime() - order.createdAt.getTime()) / 60000)}m ago`}
                    </div>
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>
                          {item.quantity}x {item.name}
                        </div>
                        <div className="text-muted-foreground">
                          Rp {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {getOrdersByStatus(OrderStatus.NEW).length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No pending orders
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
