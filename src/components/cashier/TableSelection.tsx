
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface TableSelectionProps {
  tables: Table[];
  selectedTable: Table | null;
  onSelectTable: (table: Table) => void;
}

const TableSelection: React.FC<TableSelectionProps> = ({ 
  tables, 
  selectedTable, 
  onSelectTable 
}) => {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tables.map(table => (
        <Badge
          key={table.id}
          variant={table.status === 'available' ? 'outline' : 'secondary'}
          className={`cursor-pointer px-3 py-2 transition-all ${
            selectedTable?.id === table.id ? 'bg-primary text-primary-foreground' : ''
          } ${table.status !== 'available' ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => {
            if (table.status === 'available') {
              onSelectTable(table);
            } else {
              toast({
                description: `Table ${table.number} is ${table.status}`,
                variant: "default",
              });
            }
          }}
        >
          {table.number}
        </Badge>
      ))}
    </div>
  );
};

export default TableSelection;
