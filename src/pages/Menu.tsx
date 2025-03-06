
import React, { useState, useEffect } from 'react';
import { getMenuItems, getMenuCategories } from '@/services/mockData';
import { MenuItem } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import MenuFilters from '@/components/menu/MenuFilters';
import MenuCategories from '@/components/menu/MenuCategories';
import MenuItemGrid from '@/components/menu/MenuItemGrid';

const Menu = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(false);

  useEffect(() => {
    // Load menu items and categories
    setMenuItems(getMenuItems());
    setCategories(getMenuCategories());
  }, []);

  // Filter menu items by search term and availability
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = showOnlyAvailable ? item.available : true;
    return matchesSearch && matchesAvailability;
  });

  // Toggle availability filter
  const toggleAvailabilityFilter = () => {
    setShowOnlyAvailable(!showOnlyAvailable);
    toast({
      description: `Showing ${!showOnlyAvailable ? 'only available' : 'all'} menu items`,
      duration: 1500,
    });
  };

  const handleAddItem = () => {
    toast({
      description: "This feature will be available in a future update",
    });
  };

  const handleEditItem = (item: MenuItem) => {
    toast({
      description: `Editing ${item.name} - This feature will be available in a future update`,
    });
  };

  const handleToggleAvailability = (item: MenuItem) => {
    // In a real app, this would update the backend
    const updatedItems = menuItems.map(menuItem => 
      menuItem.id === item.id 
        ? { ...menuItem, available: !menuItem.available } 
        : menuItem
    );
    
    setMenuItems(updatedItems);
    
    toast({
      description: `${item.name} is now ${!item.available ? 'available' : 'unavailable'}`,
    });
  };

  return (
    <div className="animate-fade-in">
      <MenuFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showOnlyAvailable={showOnlyAvailable}
        toggleAvailabilityFilter={toggleAvailabilityFilter}
        handleAddItem={handleAddItem}
      />
      
      {searchTerm ? (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Search Results</h2>
          <MenuItemGrid 
            items={filteredItems}
            showOnlyAvailable={showOnlyAvailable}
            toggleAvailabilityFilter={toggleAvailabilityFilter}
            onEdit={handleEditItem}
            onToggleAvailability={handleToggleAvailability}
            searchTerm={searchTerm}
          />
        </div>
      ) : (
        <MenuCategories 
          categories={categories}
          menuItems={menuItems}
          showOnlyAvailable={showOnlyAvailable}
          toggleAvailabilityFilter={toggleAvailabilityFilter}
          onEdit={handleEditItem}
          onToggleAvailability={handleToggleAvailability}
        />
      )}
    </div>
  );
};

export default Menu;
