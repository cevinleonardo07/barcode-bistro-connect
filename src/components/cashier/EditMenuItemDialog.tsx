
import React, { useState } from 'react';
import { MenuItem } from '@/types';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogDescription, DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface EditMenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: MenuItem | null;
  onSave: (menuItem: MenuItem) => void;
}

const EditMenuItemDialog: React.FC<EditMenuItemDialogProps> = ({
  open, 
  onOpenChange,
  menuItem,
  onSave
}) => {
  const [editedItem, setEditedItem] = useState<MenuItem | null>(null);

  // Update editedItem when menuItem changes
  React.useEffect(() => {
    setEditedItem(menuItem);
  }, [menuItem]);

  if (!editedItem) return null;

  const handleSave = () => {
    onSave(editedItem);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            Make changes to the menu item. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={editedItem.name}
              onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={editedItem.description}
              onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={editedItem.price}
              onChange={(e) => setEditedItem({ ...editedItem, price: Number(e.target.value) })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={editedItem.category}
              onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="available" className="text-right">
              Available
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch 
                id="available"
                checked={editedItem.available}
                onCheckedChange={(checked) => setEditedItem({ ...editedItem, available: checked })}
              />
              <Label htmlFor="available">
                {editedItem.available ? 'Yes' : 'No'}
              </Label>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="outOfStock" className="text-right">
              Out of Stock
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch 
                id="outOfStock"
                checked={!!editedItem.outOfStock}
                onCheckedChange={(checked) => setEditedItem({ ...editedItem, outOfStock: checked })}
              />
              <Label htmlFor="outOfStock">
                {editedItem.outOfStock ? 'Yes' : 'No'}
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenuItemDialog;
