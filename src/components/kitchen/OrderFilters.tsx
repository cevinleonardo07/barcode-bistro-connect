
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Search, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { Order, OrderStatus } from '@/types';
import { getCompletedAndCancelledOrders } from '@/services/mockData';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface OrderFiltersProps {
  onFiltersChange: (orders: Order[]) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ onFiltersChange }) => {
  const allOrders = getCompletedAndCancelledOrders();
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Apply filters whenever they change
  useEffect(() => {
    let filtered = [...allOrders];
    const newActiveFilters: string[] = [];
    
    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= startDate
      );
      newActiveFilters.push(`From: ${format(startDate, 'MMM dd, yyyy')}`);
    }
    
    if (endDate) {
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filtered = filtered.filter(order => 
        new Date(order.createdAt) < nextDay
      );
      newActiveFilters.push(`To: ${format(endDate, 'MMM dd, yyyy')}`);
    }
    
    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
      newActiveFilters.push(`Status: ${status}`);
    }
    
    // Filter by table number
    if (tableNumber) {
      filtered = filtered.filter(order => 
        order.tableNumber === parseInt(tableNumber)
      );
      newActiveFilters.push(`Table: ${tableNumber}`);
    }
    
    // Filter by search term (search in item names, chef name, etc.)
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.assignedChef && order.assignedChef.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
        ) ||
        (order.specialRequests && order.specialRequests.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.preparationNotes && order.preparationNotes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      newActiveFilters.push(`Search: ${searchTerm}`);
    }
    
    setActiveFilters(newActiveFilters);
    onFiltersChange(filtered);
  }, [startDate, endDate, status, tableNumber, searchTerm, allOrders, onFiltersChange]);

  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStatus('all');
    setTableNumber('');
    setSearchTerm('');
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith('From:')) {
      setStartDate(undefined);
    } else if (filter.startsWith('To:')) {
      setEndDate(undefined);
    } else if (filter.startsWith('Status:')) {
      setStatus('all');
    } else if (filter.startsWith('Table:')) {
      setTableNumber('');
    } else if (filter.startsWith('Search:')) {
      setSearchTerm('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders, items or chef..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Date Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="from">From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="from"
                          variant={"outline"}
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="to">To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="to"
                          variant={"outline"}
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Order Status</h4>
                <Select 
                  value={status} 
                  onValueChange={(value) => setStatus(value as OrderStatus | 'all')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value={OrderStatus.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Table Number</h4>
                <Input 
                  placeholder="Enter table number" 
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  type="number"
                  min="1"
                />
              </div>
              
              <Button onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
