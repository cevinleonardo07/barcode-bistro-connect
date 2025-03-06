
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface MenuFiltersProps {
  showOnlyAvailable: boolean;
  onToggleAvailability: () => void;
}

const MenuFilters: React.FC<MenuFiltersProps> = ({ 
  showOnlyAvailable, 
  onToggleAvailability 
}) => {
  return (
    <Button
      variant={showOnlyAvailable ? "default" : "outline"}
      size="sm"
      onClick={onToggleAvailability}
      className="flex items-center gap-1"
    >
      <Filter className="h-4 w-4" />
      {showOnlyAvailable ? 'Available Items' : 'All Items'}
    </Button>
  );
};

export default MenuFilters;
