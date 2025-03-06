
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MenuItem } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface MenuItemsGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemsGrid: React.FC<MenuItemsGridProps> = ({ items, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <Card 
          key={item.id} 
          className="cursor-pointer card-hover border-none shadow-sm overflow-hidden"
          onClick={() => onAddToCart(item)}
        >
          {item.image && (
            <div className="w-full h-36 overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <CardDescription className="h-10 line-clamp-2">{item.description}</CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <span className="font-bold">Rp {item.price.toLocaleString()}</span>
            <Button size="sm" variant="outline" onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
      {items.length === 0 && (
        <div className="col-span-3 py-10 text-center text-muted-foreground">
          No items available in this category.
        </div>
      )}
    </div>
  );
};

export default MenuItemsGrid;
