
import React from 'react';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import MenuItemCard from './MenuItemCard';

interface MenuItemGridProps {
  items: MenuItem[];
  showOnlyAvailable: boolean;
  toggleAvailabilityFilter: () => void;
  onEdit: (item: MenuItem) => void;
  onToggleAvailability: (item: MenuItem) => void;
  emptyMessage?: string;
  searchTerm?: string;
}

const MenuItemGrid: React.FC<MenuItemGridProps> = ({
  items,
  showOnlyAvailable,
  toggleAvailabilityFilter,
  onEdit,
  onToggleAvailability,
  emptyMessage = "No items found",
  searchTerm
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <MenuItemCard 
          key={item.id} 
          item={item} 
          onEdit={onEdit} 
          onToggleAvailability={onToggleAvailability} 
        />
      ))}
      
      {items.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          {searchTerm ? `No items found matching "${searchTerm}"` : emptyMessage}
          {showOnlyAvailable && (
            <div className="mt-2">
              <Button variant="link" onClick={toggleAvailabilityFilter}>
                Show all items
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuItemGrid;
