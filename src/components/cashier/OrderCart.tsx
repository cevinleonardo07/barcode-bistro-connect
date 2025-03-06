
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { OrderItem, Table } from '@/types';
import CartItem from './CartItem';
import TableSelection from './TableSelection';

interface OrderCartProps {
  cart: OrderItem[];
  tables: Table[];
  selectedTable: Table | null;
  onSelectTable: (table: Table) => void;
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onSubmitOrder: () => void;
}

const OrderCart: React.FC<OrderCartProps> = ({
  cart,
  tables,
  selectedTable,
  onSelectTable,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder
}) => {
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Card className="border-none shadow-md sticky top-24 bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Current Order</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearCart}
            disabled={cart.length === 0}
          >
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        </CardTitle>
        <CardDescription>
          {selectedTable 
            ? `Table ${selectedTable.number} (${selectedTable.seats} seats)` 
            : 'Select a table below'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TableSelection 
          tables={tables} 
          selectedTable={selectedTable} 
          onSelectTable={onSelectTable} 
        />
        
        {cart.length > 0 ? (
          <div className="space-y-4">
            {cart.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No items in order
          </div>
        )}
      </CardContent>
      
      {cart.length > 0 && (
        <CardFooter className="flex-col">
          <Separator className="mb-4" />
          <div className="w-full flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-bold">Rp {calculateTotal().toLocaleString()}</span>
          </div>
          <Button 
            className="w-full"
            onClick={onSubmitOrder}
            disabled={cart.length === 0 || !selectedTable}
          >
            <Receipt className="mr-2 h-4 w-4" /> Place Order
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderCart;
