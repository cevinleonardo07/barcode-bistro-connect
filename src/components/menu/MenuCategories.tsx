
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuItem } from '@/types';
import MenuItemGrid from './MenuItemGrid';

interface MenuCategoriesProps {
  categories: string[];
  menuItems: MenuItem[];
  showOnlyAvailable: boolean;
  toggleAvailabilityFilter: () => void;
  onEdit: (item: MenuItem) => void;
  onToggleAvailability: (item: MenuItem) => void;
}

const MenuCategories: React.FC<MenuCategoriesProps> = ({
  categories,
  menuItems,
  showOnlyAvailable,
  toggleAvailabilityFilter,
  onEdit,
  onToggleAvailability
}) => {
  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <TabsList className="bg-muted/50 mb-6">
        {categories.map(category => (
          <TabsTrigger key={category} value={category} className="text-sm">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {categories.map(category => (
        <TabsContent key={category} value={category} className="m-0">
          <MenuItemGrid 
            items={menuItems
              .filter(item => item.category === category && (showOnlyAvailable ? item.available : true))}
            showOnlyAvailable={showOnlyAvailable}
            toggleAvailabilityFilter={toggleAvailabilityFilter}
            onEdit={onEdit}
            onToggleAvailability={onToggleAvailability}
            emptyMessage={`No available items in this category`}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default MenuCategories;
