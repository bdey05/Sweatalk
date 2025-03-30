import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Trash2, Plus, Loader2 } from "lucide-react";

interface MealDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "addMeal" | "addIngredient";
  mealId?: number;
}

const MealDialog: React.FC<MealDialogProps> = ({
  open,
  onClose,
  mode,
  mealId,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {mode === "addMeal" ? "Add New Meal" : "Add Ingredients"}
          </DialogTitle>
          <DialogDescription>
            {mode === "addMeal"
              ? "Name your meal and search for ingredients to add."
              : "Search for ingredients to add to this meal."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="flex flex-col gap-4 overflow-hidden">
            {mode === "addMeal" && (
              <div>
                <Label htmlFor="mealName">Meal Name</Label>
                <Input
                  id="mealName"
                  placeholder="e.g., Chicken Salad Lunch"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="ingredientSearch">Search Ingredients</Label>
              <Input
                id="ingredientSearch"
                placeholder="e.g., chicken breast, apple"
                className="mt-1"
              />
            </div>

            <div className="flex-grow overflow-hidden border rounded-md">
              <ScrollArea className="h-full p-3">
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Search Results
                </h4>

                <p className="text-sm text-muted-foreground">
                  Start typing to search for ingredients.
                </p>

                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between p-2 border rounded-md bg-muted/30 hover:bg-muted/60">
                    <span className="text-sm flex-grow mr-2">
                      Sample Ingredient Name
                    </span>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex flex-col gap-4 overflow-hidden border rounded-md">
            <ScrollArea className="h-full p-3">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                Ingredients Added
              </h4>

              <p className="text-sm text-muted-foreground text-center py-4">
                No ingredients added yet.
              </p>

              <div className="space-y-3 mt-2">
                <div className="p-3 border rounded-md space-y-2 bg-background">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium mr-2">
                      Selected Item Name
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove Item</span>
                    </Button>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={`qty-sample`} className="text-xs">
                        Qty
                      </Label>
                      <Input
                        id={`qty-sample`}
                        type="number"
                        min="0"
                        step="0.1"
                        className="h-8 text-sm"
                        defaultValue="1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Label htmlFor={`unit-sample`} className="text-xs">
                        Unit
                      </Label>

                      <Select>
                        <SelectTrigger
                          id={`unit-sample`}
                          className="h-8 text-sm"
                        >
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grams" className="text-sm">
                            grams
                          </SelectItem>
                          <SelectItem value="oz" className="text-sm">
                            oz
                          </SelectItem>
                          <SelectItem value="cup" className="text-sm">
                            cup
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Save Meal / Add Ingredients</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MealDialog;
