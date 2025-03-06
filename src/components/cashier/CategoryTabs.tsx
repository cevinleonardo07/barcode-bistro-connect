
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  children: React.ReactNode;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  children 
}) => {
  return (
    <Tabs defaultValue={categories[0] || ''} className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="bg-muted/50">
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              onClick={() => onCategoryChange(category)}
              className="text-sm"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {categories.map(category => (
        <TabsContent key={category} value={category} className="m-0">
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CategoryTabs;
