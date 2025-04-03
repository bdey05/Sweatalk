import React, { useState, useEffect } from "react";
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
import { useIngredients } from "@/hooks/useIngredients";
import { Ingredient } from "@/stores/mealstore";

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
  const [title, setTitle] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    console.log(selectedIngredients);
  }, [selectedIngredients]);

  const {
    data: ingredients = [],
    isLoading,
    isError,
  } = useIngredients(debouncedQuery);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1400px] flex flex-col h-[90vh]">
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
                  placeholder="e.g., Chicken Salad"
                  className="mt-1"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            )}

            <div>
              <Label htmlFor="ingredientSearch">Search Ingredients</Label>
              <Input
                id="ingredientSearch"
                placeholder="e.g., chicken breast, apple"
                className="mt-1"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="flex-grow overflow-hidden border rounded-md">
              <ScrollArea className="h-full p-3">
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Search Results:
                </h4>

                {!isLoading && (
                  <p className="text-sm text-muted-foreground">
                    Start typing to search for ingredients.
                  </p>
                )}

                <div className="space-y-2 mt-2">
                  {isLoading && <h2>Loading...</h2>}
                  {ingredients.length > 0 &&
                    ingredients.map((ig, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 border rounded-md bg-muted/30 hover:bg-muted/60"
                      >
                        <span className="text-sm flex-grow mr-2">
                          {ig?.name}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedIngredients([...selectedIngredients, ig])
                          }
                          /*disabled={selectedIngredients.some(
                            (sel) => sel.fdcID === ig.fdcID
                          )}*/
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                    ))}
                  {isError && <h2>Could not load ingredients</h2>}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex flex-col gap-4 overflow-hidden border rounded-md">
            <ScrollArea className="h-full p-3">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                Ingredients Added
              </h4>

              {selectedIngredients.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No ingredients added yet.
                </p>
              )}
      
              {selectedIngredients.length > 0 && 
              selectedIngredients.map((sig, idx) => (
                  <div key={idx} className="space-y-3 mt-2">
                    <div className="p-3 border rounded-md space-y-2 bg-background">
                      
    
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium mr-2">
                            {sig?.name}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => setSelectedIngredients(selectedIngredients.filter(s => s.fdcID !== sig.fdcID))}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove Item</span>
                          </Button>
                        </div>
                      
                      <div className="flex items-end gap-2">
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={`qty-sample`} className="text-xs">
                            Quantity
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
                            {sig?.servings.map((sigServ, idx) => (
                              <SelectItem value={sigServ.unit} className="text-sm">
                                {sigServ.unit}
                              </SelectItem>
                            ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
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
