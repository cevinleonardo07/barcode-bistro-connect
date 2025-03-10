
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, AlertCircle } from 'lucide-react';
import { MenuItem } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import EditMenuItemDialog from './EditMenuItemDialog';

interface MenuItemsGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateMenuItem?: (item: MenuItem) => void;
}

const MenuItemsGrid: React.FC<MenuItemsGridProps> = ({ 
  items, 
  onAddToCart,
  onUpdateMenuItem 
}) => {
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleEditClick = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const handleSaveItem = (updatedItem: MenuItem) => {
    if (onUpdateMenuItem) {
      onUpdateMenuItem(updatedItem);
      toast({
        description: `${updatedItem.name} has been updated`,
        duration: 1500,
      });
    }
  };

  const toggleOutOfStock = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateMenuItem) {
      const updatedItem = { 
        ...item, 
        outOfStock: !item.outOfStock,
        available: item.outOfStock ? item.available : false // If marking as out of stock, also mark as unavailable
      };
      onUpdateMenuItem(updatedItem);
      toast({
        description: `${item.name} marked as ${updatedItem.outOfStock ? 'out of stock' : 'in stock'}`,
        duration: 1500,
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <Card 
            key={item.id} 
            className={`cursor-pointer card-hover border-none shadow-sm overflow-hidden ${item.outOfStock ? 'opacity-70' : ''}`}
            onClick={() => {
              if (item.outOfStock) {
                toast({
                  description: `${item.name} is out of stock`,
                  variant: "destructive",
                  duration: 1500,
                });
                return;
              }
              onAddToCart(item);
            }}
          >
            {item.image && (
              <div className="w-full h-36 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {item.outOfStock && (
                  <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                    <div className="bg-destructive text-white px-4 py-1 rounded-md font-medium text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Out of Stock
                    </div>
                  </div>
                )}
              </div>
            )}
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                {onUpdateMenuItem && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={(e) => handleEditClick(item, e)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardDescription className="h-10 line-clamp-2">{item.description}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <span className="font-bold">Rp {item.price.toLocaleString()}</span>
              <div className="flex gap-2">
                {onUpdateMenuItem && (
                  <Button
                    size="sm"
                    variant={item.outOfStock ? "default" : "destructive"}
                    onClick={(e) => toggleOutOfStock(item, e)}
                  >
                    {item.outOfStock ? 'In Stock' : 'Out of Stock'}
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.outOfStock) {
                      toast({
                        description: `${item.name} is out of stock`,
                        variant: "destructive",
                        duration: 1500,
                      });
                      return;
                    }
                    onAddToCart(item);
                  }}
                  disabled={item.outOfStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="col-span-3 py-10 text-center text-muted-foreground">
            No items available in this category.
          </div>
        )}
      </div>
      
      <EditMenuItemDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        menuItem={selectedItem}
        onSave={handleSaveItem}
      />
    </>
  );
};

export default MenuItemsGrid;
