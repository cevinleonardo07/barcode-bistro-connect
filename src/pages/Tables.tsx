
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTables, getTableQRCodeUrl } from '@/services/mockData';
import { Table } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { QrCode, Users, Plus, ArrowRight } from 'lucide-react';

const Tables = () => {
  const { toast } = useToast();
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    setTables(getTables());
  }, []);

  const handleGenerateQR = (table: Table) => {
    toast({
      description: `QR code for Table ${table.number} would be generated here`,
    });
    // In a real app, this would generate a QR code and possibly show a modal with it
  };

  const handleAddTable = () => {
    toast({
      description: "This feature will be available in a future update",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Table Management</h1>
          <p className="text-muted-foreground">Manage tables and generate QR codes</p>
        </div>
        <Button onClick={handleAddTable}>
          <Plus className="mr-2 h-4 w-4" /> Add Table
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map(table => (
          <Card key={table.id} className="border-none shadow-md card-hover">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>Table {table.number}</CardTitle>
                <Badge variant={
                  table.status === 'available' ? 'outline' :
                  table.status === 'occupied' ? 'secondary' :
                  'default'
                }>
                  {table.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center">
                <Users className="h-3 w-3 mr-1" /> 
                {table.seats} seats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-2">
                <Button variant="outline" size="sm" onClick={() => handleGenerateQR(table)}>
                  <QrCode className="mr-2 h-4 w-4" /> Generate QR
                </Button>
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tables;
