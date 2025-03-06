
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { OrderItem } from '@/types';

interface CartItemProps {
  item: OrderItem;
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div className="flex items-center justify-between pb-2 border-b">
      <div className="flex-1">
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-muted-foreground">
          Rp {item.price.toLocaleString()} x {item.quantity}
        </div>
      </div>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => onUpdateQuantity(item.id, -1)}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button variant="ghost" size="icon" onClick={() => onUpdateQuantity(item.id, 1)}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
