
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  RefreshCw, 
  Check, 
  Clock, 
  X, 
  Calendar, 
  BarChart, 
  FileText, 
  AlertTriangle,
  ChevronDown, 
  ChevronUp,
  Bell 
} from 'lucide-react';
import { 
  getPayments, 
  getPaymentById, 
  updatePaymentStatus, 
  generateSalesReport, 
  getOrderById 
} from '@/services/mockData';
import { Payment, PaymentStatus, PaymentMethod, SalesReport, Order } from '@/types';

// Payment Status Badge component
const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  switch (status) {
    case PaymentStatus.PAID:
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 flex w-fit items-center gap-1">
          <Check className="h-3 w-3" />
          Paid
        </Badge>
      );
    case PaymentStatus.PENDING:
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex w-fit items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case PaymentStatus.FAILED:
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 flex w-fit items-center gap-1">
          <X className="h-3 w-3" />
          Failed
        </Badge>
      );
  }
};

// Payment Method Badge component
const PaymentMethodBadge = ({ method }: { method: PaymentMethod }) => {
  switch (method) {
    case PaymentMethod.CASH:
      return <Badge variant="secondary">Cash</Badge>;
    case PaymentMethod.CREDIT_CARD:
      return <Badge variant="secondary">Credit Card</Badge>;
    case PaymentMethod.DEBIT_CARD:
      return <Badge variant="secondary">Debit Card</Badge>;
    case PaymentMethod.BANK_TRANSFER:
      return <Badge variant="secondary">Bank Transfer</Badge>;
    case PaymentMethod.E_WALLET:
      return <Badge variant="secondary">E-Wallet</Badge>;
  }
};

// Transaction Detail Dialog
const TransactionDetailDialog = ({ 
  payment, 
  order, 
  open, 
  onOpenChange, 
  onStatusUpdate 
}: { 
  payment: Payment; 
  order?: Order; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (id: string, status: PaymentStatus, notes?: string) => void;
}) => {
  const [status, setStatus] = useState<PaymentStatus>(payment.status);
  const [notes, setNotes] = useState<string>(payment.notes || '');
  const { toast } = useToast();

  const handleStatusUpdate = () => {
    onStatusUpdate(payment.id, status, notes);
    toast({
      description: "Payment status updated successfully",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Payment ID: {payment.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Order Information</h4>
              <p className="text-sm text-muted-foreground">Order ID: {payment.orderId}</p>
              <p className="text-sm text-muted-foreground">
                Date: {format(payment.createdAt, 'PPP')}
              </p>
              <p className="text-sm text-muted-foreground">
                Time: {format(payment.createdAt, 'p')}
              </p>
              {order && (
                <p className="text-sm text-muted-foreground">
                  Table: {order.tableNumber}
                </p>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium">Payment Information</h4>
              <p className="text-sm text-muted-foreground">
                Amount: Rp {payment.amount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Method: {payment.method.replace('_', ' ')}
              </p>
              {payment.transactionId && (
                <p className="text-sm text-muted-foreground">
                  Transaction ID: {payment.transactionId}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Status: {payment.status}
              </p>
            </div>
          </div>

          {order && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Items</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">Rp {item.price.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Update Status</h4>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as PaymentStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
                <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this payment..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleStatusUpdate} 
            disabled={status === payment.status && notes === payment.notes}
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Sales Report Card
const SalesReportCard = ({ report }: { report: SalesReport }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Sales Report</CardTitle>
        <CardDescription>
          {format(report.periodStart, 'PPP')} - {format(report.periodEnd, 'PPP')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Total Revenue</h4>
              <p className="text-2xl font-bold">Rp {report.totalRevenue.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Transactions</h4>
              <p className="text-2xl font-bold">{report.transactionCount}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Payment Method Breakdown</h4>
            <div className="space-y-2">
              {Object.entries(report.paymentMethodBreakdown).map(([method, amount]) => (
                <div key={method} className="flex justify-between items-center">
                  <span className="text-sm">{method.replace('_', ' ')}</span>
                  <span className="text-sm font-medium">
                    Rp {amount.toLocaleString()} 
                    {report.totalRevenue > 0 && (
                      <span className="text-muted-foreground ml-2">
                        ({Math.round((amount / report.totalRevenue) * 100)}%)
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Payments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all');
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Payment | '';
    direction: 'ascending' | 'descending';
  }>({ key: '', direction: 'descending' });

  // Load initial data
  useEffect(() => {
    try {
      const allPayments = getPayments();
      setPayments(allPayments);
      setFilteredPayments(allPayments);
      
      // Generate initial daily report
      const today = new Date();
      const dailyReport = generateSalesReport(startOfDay(today), endOfDay(today));
      setSalesReport(dailyReport);
    } catch (error) {
      toast({
        title: "Error loading payments",
        description: "There was a problem loading the payment data.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Apply filters
  useEffect(() => {
    let result = payments;
    
    // Filter by date range
    result = result.filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(payment => payment.status === statusFilter);
    }
    
    // Filter by method
    if (methodFilter !== 'all') {
      result = result.filter(payment => payment.method === methodFilter);
    }
    
    // Search by order ID, customer name, or transaction ID
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(payment => 
        payment.orderId.toLowerCase().includes(query) ||
        (payment.customerName && payment.customerName.toLowerCase().includes(query)) ||
        (payment.transactionId && payment.transactionId.toLowerCase().includes(query))
      );
    }
    
    // Sort
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredPayments(result);
  }, [payments, searchQuery, statusFilter, methodFilter, startDate, endDate, sortConfig]);

  // Handle sort
  const handleSort = (key: keyof Payment) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle payment view
  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    const order = getOrderById(payment.orderId);
    if (order) {
      setSelectedOrder(order);
    } else {
      setSelectedOrder(null);
    }
  };

  // Handle payment status update
  const handleUpdatePaymentStatus = (id: string, status: PaymentStatus, notes?: string) => {
    const updatedPayment = updatePaymentStatus(id, status, notes);
    if (updatedPayment) {
      setPayments(prevPayments => 
        prevPayments.map(p => p.id === id ? updatedPayment : p)
      );
      
      toast({
        description: `Payment status updated to ${status}`,
      });
    }
  };

  // Generate reports
  const generateReport = (period: 'daily' | 'weekly' | 'monthly') => {
    setReportPeriod(period);
    
    const today = new Date();
    let start: Date;
    let end: Date;
    
    switch (period) {
      case 'daily':
        start = startOfDay(today);
        end = endOfDay(today);
        break;
      case 'weekly':
        start = startOfWeek(today);
        end = endOfWeek(today);
        break;
      case 'monthly':
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
    }
    
    const report = generateSalesReport(start, end);
    setSalesReport(report);
  };

  // Export data
  const handleExport = (format: 'csv' | 'pdf') => {
    // In a real app, this would generate and download a file
    toast({
      title: `Export ${format.toUpperCase()}`,
      description: `${filteredPayments.length} transactions exported as ${format.toUpperCase()}`,
    });
  };

  // Get payment notifications (failed or pending)
  const notificationCount = payments.filter(
    p => p.status === PaymentStatus.FAILED || p.status === PaymentStatus.PENDING
  ).length;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-muted-foreground">
            Manage payments and generate sales reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <div className="relative">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Transactions</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-8 w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value) => setStatusFilter(value as PaymentStatus | 'all')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
                      <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={methodFilter} 
                    onValueChange={(value) => setMethodFilter(value as PaymentMethod | 'all')}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                      <SelectItem value={PaymentMethod.CREDIT_CARD}>Credit Card</SelectItem>
                      <SelectItem value={PaymentMethod.DEBIT_CARD}>Debit Card</SelectItem>
                      <SelectItem value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</SelectItem>
                      <SelectItem value={PaymentMethod.E_WALLET}>E-Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor="date-range" className="text-sm whitespace-nowrap">Date Range:</Label>
                    <Input
                      id="start-date"
                      type="date"
                      className="w-[140px]"
                      value={format(startDate, 'yyyy-MM-dd')}
                      onChange={(e) => {
                        if (e.target.value) {
                          setStartDate(new Date(e.target.value));
                        }
                      }}
                    />
                    <span>to</span>
                    <Input
                      id="end-date"
                      type="date"
                      className="w-[140px]"
                      value={format(endDate, 'yyyy-MM-dd')}
                      onChange={(e) => {
                        if (e.target.value) {
                          setEndDate(new Date(e.target.value));
                        }
                      }}
                    />
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:text-primary"
                        onClick={() => handleSort('orderId')}
                      >
                        Order ID
                        {sortConfig.key === 'orderId' && (
                          sortConfig.direction === 'ascending' 
                            ? <ChevronUp className="inline ml-1 h-4 w-4" />
                            : <ChevronDown className="inline ml-1 h-4 w-4" />
                        )}
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary"
                        onClick={() => handleSort('amount')}
                      >
                        Amount
                        {sortConfig.key === 'amount' && (
                          sortConfig.direction === 'ascending' 
                            ? <ChevronUp className="inline ml-1 h-4 w-4" />
                            : <ChevronDown className="inline ml-1 h-4 w-4" />
                        )}
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary"
                        onClick={() => handleSort('createdAt')}
                      >
                        Date
                        {sortConfig.key === 'createdAt' && (
                          sortConfig.direction === 'ascending' 
                            ? <ChevronUp className="inline ml-1 h-4 w-4" />
                            : <ChevronDown className="inline ml-1 h-4 w-4" />
                        )}
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id} className="cursor-pointer hover:bg-muted">
                          <TableCell className="font-medium" onClick={() => handleViewPayment(payment)}>
                            {payment.orderId.substring(0, 8)}...
                          </TableCell>
                          <TableCell onClick={() => handleViewPayment(payment)}>
                            {payment.customerName || "Anonymous"}
                          </TableCell>
                          <TableCell onClick={() => handleViewPayment(payment)}>
                            <PaymentMethodBadge method={payment.method} />
                          </TableCell>
                          <TableCell onClick={() => handleViewPayment(payment)}>
                            Rp {payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell onClick={() => handleViewPayment(payment)}>
                            <PaymentStatusBadge status={payment.status} />
                          </TableCell>
                          <TableCell onClick={() => handleViewPayment(payment)} className="text-muted-foreground">
                            {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewPayment(payment)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              {(payment.status === PaymentStatus.PENDING || payment.status === PaymentStatus.FAILED) && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    handleUpdatePaymentStatus(payment.id, PaymentStatus.PAID);
                                  }}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              )}
                              {payment.status === PaymentStatus.FAILED && (
                                <span className="text-red-500">
                                  <AlertTriangle className="h-4 w-4" />
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>
                Generate financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={reportPeriod} 
                onValueChange={(value) => generateReport(value as 'daily' | 'weekly' | 'monthly')}
                className="space-y-4"
              >
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="daily">
                    <Calendar className="mr-2 h-4 w-4" />
                    Daily
                  </TabsTrigger>
                  <TabsTrigger value="weekly">
                    <Calendar className="mr-2 h-4 w-4" />
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly">
                    <Calendar className="mr-2 h-4 w-4" />
                    Monthly
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="daily" className="space-y-4">
                  {salesReport && <SalesReportCard report={salesReport} />}
                </TabsContent>
                <TabsContent value="weekly" className="space-y-4">
                  {salesReport && <SalesReportCard report={salesReport} />}
                </TabsContent>
                <TabsContent value="monthly" className="space-y-4">
                  {salesReport && <SalesReportCard report={salesReport} />}
                </TabsContent>
              </Tabs>
              
              <div className="mt-4">
                <Button className="w-full" onClick={() => handleExport('pdf')}>
                  <BarChart className="mr-2 h-4 w-4" />
                  Export Detailed Report
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {(notificationCount > 0) && (
            <Card className="mt-4 border-orange-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">
                    {notificationCount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments
                    .filter(p => p.status === PaymentStatus.FAILED || p.status === PaymentStatus.PENDING)
                    .slice(0, 3)
                    .map(payment => (
                      <div key={payment.id} className="flex items-center justify-between py-2 border-b">
                        <div>
                          <p className="text-sm font-medium">
                            {payment.status === PaymentStatus.FAILED ? (
                              <span className="text-red-600">Payment Failed</span>
                            ) : (
                              <span className="text-yellow-600">Payment Pending</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.orderId.substring(0, 8)}... - Rp {payment.amount.toLocaleString()}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewPayment(payment)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  
                  {notificationCount > 3 && (
                    <Button variant="ghost" className="w-full text-xs">
                      View all {notificationCount} notifications
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {selectedPayment && (
        <TransactionDetailDialog
          payment={selectedPayment}
          order={selectedOrder || undefined}
          open={!!selectedPayment}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedPayment(null);
              setSelectedOrder(null);
            }
          }}
          onStatusUpdate={handleUpdatePaymentStatus}
        />
      )}
    </div>
  );
};

export default Payments;
