
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getTables, getTableQRCodeUrl, updateTableStatus } from '@/services/mockData';
import { Table } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { QrCode, Users, Plus, ArrowRight, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const Tables = () => {
  const { toast } = useToast();
  const [tables, setTables] = useState<Table[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTable, setNewTable] = useState({
    number: '',
    seats: ''
  });

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
    setIsAddDialogOpen(true);
  };

  const handleResetUnavailableTables = () => {
    let resetCount = 0;
    const updatedTables = tables.map(table => {
      if (table.status !== 'available') {
        resetCount++;
        updateTableStatus(table.id, 'available');
        return { ...table, status: 'available' as const };
      }
      return table;
    });
    
    setTables(updatedTables);
    
    toast({
      description: resetCount > 0 
        ? `Reset ${resetCount} tables to available status` 
        : "All tables are already available",
    });
  };

  const handleSubmitNewTable = () => {
    // Validate inputs
    if (!newTable.number || !newTable.seats || isNaN(Number(newTable.number)) || isNaN(Number(newTable.seats))) {
      toast({
        description: "Please enter valid numbers for table number and seats",
        variant: "destructive"
      });
      return;
    }

    // Check if table number already exists
    if (tables.some(table => table.number === Number(newTable.number))) {
      toast({
        description: `Table ${newTable.number} already exists`,
        variant: "destructive"
      });
      return;
    }

    // Create new table
    const newTableId = Math.max(...tables.map(t => t.id), 0) + 1;
    const tableToAdd: Table = {
      id: newTableId,
      number: Number(newTable.number),
      seats: Number(newTable.seats),
      status: "available"
    };

    setTables([...tables, tableToAdd]);
    setIsAddDialogOpen(false);
    setNewTable({ number: '', seats: '' });

    toast({
      description: `Table ${newTable.number} has been added successfully`,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Table Management</h1>
          <p className="text-muted-foreground">Manage tables and generate QR codes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetUnavailableTables}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset Tables
          </Button>
          <Button onClick={handleAddTable}>
            <Plus className="mr-2 h-4 w-4" /> Add Table
          </Button>
        </div>
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
            <DialogDescription>
              Enter the details for the new table.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="table-number" className="text-right text-sm font-medium">
                Table #
              </label>
              <Input
                id="table-number"
                type="number"
                min="1"
                className="col-span-3"
                value={newTable.number}
                onChange={(e) => setNewTable({...newTable, number: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="seats" className="text-right text-sm font-medium">
                Seats
              </label>
              <Input
                id="seats"
                type="number"
                min="1"
                className="col-span-3"
                value={newTable.seats}
                onChange={(e) => setNewTable({...newTable, seats: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNewTable}>
              Add Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tables;
