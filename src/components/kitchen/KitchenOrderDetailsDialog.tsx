
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Order } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Clock, User } from 'lucide-react';

interface KitchenOrderDetailsDialogProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

const KitchenOrderDetailsDialog: React.FC<KitchenOrderDetailsDialogProps> = ({ 
  order, 
  open, 
  onClose 
}) => {
  const preparationTime = order.completionTime ? 
    ((new Date(order.completionTime).getTime() - new Date(order.createdAt).getTime()) / (1000 * 60)).toFixed(0) : 
    'N/A';
  
  const isLongPreparation = order.completionTime && 
    ((new Date(order.completionTime).getTime() - new Date(order.createdAt).getTime()) / (1000 * 60)) > 30;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kitchen Order Details</DialogTitle>
          <DialogDescription>
            Order {order.id} - Table {order.tableNumber}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Order Time</p>
                <p className="font-medium">
                  {format(new Date(order.createdAt), 'PPpp')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Time</p>
                <p className="font-medium">
                  {order.completionTime 
                    ? format(new Date(order.completionTime), 'PPpp')
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Preparation Time</p>
                <p className={`font-medium flex items-center gap-1 ${isLongPreparation ? 'text-red-600' : ''}`}>
                  {isLongPreparation && <AlertTriangle className="h-4 w-4" />}
                  {preparationTime} minutes
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chef</p>
                <p className="font-medium flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {order.assignedChef || 'Unassigned'}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-md font-semibold">Ordered Items</h3>
              <div className="rounded-md border mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell>{item.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {order.specialRequests && (
              <div>
                <h3 className="text-md font-semibold">Special Requests</h3>
                <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                  {order.specialRequests}
                </p>
              </div>
            )}

            {order.preparationNotes && (
              <div>
                <h3 className="text-md font-semibold">Kitchen Notes</h3>
                <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                  {order.preparationNotes}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KitchenOrderDetailsDialog;
