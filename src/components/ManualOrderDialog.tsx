
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, MenuItem, OrderItem } from '@/types';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ManualOrderDialogProps {
  tables: Table[];
  menuItems: MenuItem[];
  onCreateOrder: (tableNumber: number, items: OrderItem[]) => void;
}

const ManualOrderDialog: React.FC<ManualOrderDialogProps> = ({ tables, menuItems, onCreateOrder }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  // Reset form when dialog closes
  const resetForm = () => {
    setTableNumber(0);
    setOrderItems([]);
    setSelectedItemId('');
    setQuantity(1);
    setNotes('');
  };

  // Handle dialog open state
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  // Add item to order
  const addItemToOrder = () => {
    if (!selectedItemId) {
      toast({
        description: "Please select a menu item",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const menuItem = menuItems.find(item => item.id === selectedItemId);
    if (!menuItem) return;

    const newItem: OrderItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: quantity,
      notes: notes.trim() || undefined
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedItemId('');
    setQuantity(1);
    setNotes('');

    toast({
      description: `Added ${menuItem.name} to order`,
      duration: 1500,
    });
  };

  // Remove item from order
  const removeItemFromOrder = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  // Handle order submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tableNumber <= 0) {
      toast({
        description: "Please select a valid table number",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (orderItems.length === 0) {
      toast({
        description: "Please add at least one item to the order",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    onCreateOrder(tableNumber, orderItems);
    setOpen(false);
    resetForm();
  };

  // Calculate total
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Group menu items by category
  const menuByCategory: Record<string, MenuItem[]> = {};
  menuItems.forEach(item => {
    if (!menuByCategory[item.category]) {
      menuByCategory[item.category] = [];
    }
    menuByCategory[item.category].push(item);
  });

  const availableTables = tables.filter(table => table.status === "available");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Manual Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Manual Order</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Table Selection */}
          <div className="space-y-2">
            <Label htmlFor="table-select">Select Table</Label>
            <div className="flex flex-wrap gap-2">
              {availableTables.map(table => (
                <button
                  key={table.id}
                  type="button"
                  className={`px-4 py-2 rounded-md transition-colors ${
                    tableNumber === table.number 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                  onClick={() => setTableNumber(table.number)}
                >
                  Table {table.number} ({table.seats} seats)
                </button>
              ))}
            </div>
            {availableTables.length === 0 && (
              <p className="text-sm text-muted-foreground">No available tables</p>
            )}
          </div>

          {/* Item Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-select">Add Menu Items</Label>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <select
                      id="item-select"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                    >
                      <option value="">Select an item</option>
                      {Object.entries(menuByCategory).map(([category, items]) => (
                        <optgroup key={category} label={category}>
                          {items.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name} - Rp {item.price.toLocaleString()}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="w-20">
                    <Label htmlFor="quantity" className="sr-only">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button type="button" onClick={addItemToOrder}>Add</Button>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special instructions (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-muted/30 p-4 rounded-md space-y-4">
              <h3 className="font-medium">Order Summary</h3>
              {orderItems.length > 0 ? (
                <>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {orderItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} x Rp {item.price.toLocaleString()}
                            {item.notes && <div className="italic text-xs">{item.notes}</div>}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeItemFromOrder(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 font-medium flex justify-between">
                    <span>Total:</span>
                    <span>Rp {calculateTotal().toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">No items added yet</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Place Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualOrderDialog;
