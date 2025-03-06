
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, Plus } from 'lucide-react';

interface MenuFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showOnlyAvailable: boolean;
  toggleAvailabilityFilter: () => void;
  handleAddItem: () => void;
}

const MenuFilters: React.FC<MenuFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  showOnlyAvailable,
  toggleAvailabilityFilter,
  handleAddItem
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant's menu</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showOnlyAvailable ? "default" : "outline"}
            size="sm"
            onClick={toggleAvailabilityFilter}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            {showOnlyAvailable ? 'Available Items' : 'All Items'}
          </Button>
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </>
  );
};

export default MenuFilters;
