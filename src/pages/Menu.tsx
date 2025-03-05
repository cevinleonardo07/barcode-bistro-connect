
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMenuItems, getMenuCategories } from '@/services/mockData';
import { MenuItem } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Plus, Coffee, Search } from 'lucide-react';

const Menu = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load menu items and categories
    setMenuItems(getMenuItems());
    setCategories(getMenuCategories());
  }, []);

  const filteredItems = searchTerm
    ? menuItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : menuItems;

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant's menu</p>
        </div>
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
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
      
      {searchTerm ? (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                onEdit={handleEditItem} 
                onToggleAvailability={handleToggleAvailability} 
              />
            ))}
            
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No items found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      ) : (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems
                  .filter(item => item.category === category)
                  .map(item => (
                    <MenuItemCard 
                      key={item.id} 
                      item={item} 
                      onEdit={handleEditItem} 
                      onToggleAvailability={handleToggleAvailability} 
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

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

export default Menu;
