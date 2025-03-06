
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/types';
import { Edit } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onToggleAvailability: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onEdit, onToggleAvailability }) => {
  return (
    <Card className="overflow-hidden border-none shadow-md card-hover">
      {item.image && (
        <div className="w-full h-40 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="line-clamp-2 h-10">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center">
          <span className="font-bold">Rp {item.price.toLocaleString()}</span>
          <Button
            variant={item.available ? "outline" : "secondary"}
            size="sm"
            onClick={() => onToggleAvailability(item)}
          >
            {item.available ? 'Available' : 'Unavailable'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
