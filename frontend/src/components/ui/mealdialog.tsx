import React, { useState, useEffect, useMemo } from "react";
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
import { ServingUnit, Ingredient, Meal } from "@/stores/mealstore";
import { useCalendarStore } from "@/stores/calendarstore";
import { useAddMeal } from "@/hooks/useAddMeal";

type MealDialogProps = {
  open: boolean;
  onClose: () => void;
  mode: "addMeal" | "addIngredient";
  mealId?: number;
}

type SelectedIngredient = {
  fdcId: number    
  name: string     
  selectedServingQty: number
  selectedServingUnit: string
  servingUnits: ServingUnit[]
  selectedServingUnitInfo?: ServingUnit
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
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const date = useCalendarStore((state) => state.date);
  const mutation = useAddMeal();

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

  const handleAddItem = (ing) => {
    const newIngredient: SelectedIngredient = {
      fdcId: ing.fdcId, 
      name: ing.name, 
      selectedServingQty: 1, 
      selectedServingUnit: ing.servings[0].unit,
      servingUnits: ing.servings,
      selectedServingUnitInfo: ing.servings[0] 
    }
    setSelectedIngredients(prevIngredients => [...prevIngredients, newIngredient]);
  }

  const handleUnselect = (selectedID) => {
    setSelectedIngredients(currentIngredients => currentIngredients.filter(s => s.fdcId !== selectedID));
  }

  const handleUnitChange = (id, newUnit) => {
    setSelectedIngredients(currentItems => 
      currentItems.map(item => {
        if (item.fdcId === id)
        {
          const newServingInfo = item.servingUnits.find(unitInfo => unitInfo.unit === newUnit);
          return {
            ...item,
            selectedServingUnit: newUnit,
            selectedServingUnitInfo: newServingInfo
          }
        }
        return item;
      })
    )
  }

  const handleQuantityChange = (id, newQuantity) => {
    setSelectedIngredients(currentItems => 
      currentItems.map(item =>
        item.fdcId === id ? 
        {...item, selectedServingQty: newQuantity}
        : item
      )
    )
  }

  const validateFields = useMemo(() => {
    if (selectedIngredients.length === 0)
    {
      return false;
    }
    if (mode === "addMeal" && title.trim() === "")
    {
      return false;
    }
    return selectedIngredients.every(sig => {
      const quantityValid = sig.selectedServingQty > 0;
      return quantityValid;
    })
  }, [selectedIngredients, title, mode]);


  const ingredientNutrition = (id) => {
    const ing = selectedIngredients.find(selIng => selIng.fdcId === id);
    return {
      "calories": ing?.selectedServingQty * ing?.selectedServingUnitInfo.calories,
      "protein": ing?.selectedServingQty * ing?.selectedServingUnitInfo.protein,
      "carbohydrates": ing?.selectedServingQty * ing?.selectedServingUnitInfo.carbohydrates,
      "fat": ing?.selectedServingQty * ing?.selectedServingUnitInfo.fat
    }
  }

  const mealNutrition = () => {
    let calories = 0;
    let protein = 0;
    let carbohydrates = 0;
    let fat = 0;
    for (let seling of selectedIngredients)
    {
      calories += ingredientNutrition(seling.fdcId).calories;
      protein += ingredientNutrition(seling.fdcId).protein;
      carbohydrates += ingredientNutrition(seling.fdcId).carbohydrates;
      fat += ingredientNutrition(seling.fdcId).fat;
    }
    
    return {
      "calories": calories,
      "protein": protein, 
      "carbohydrates": carbohydrates,
      "fat": fat
    }
  }

  const handleSave = () => {
    const mealInfo = mealNutrition();
    if (mode === "addMeal")
    {
      const newMeal: Meal = {
        name: title,
        calories: mealInfo.calories,
        protein: mealInfo.protein,
        carbohydrates: mealInfo.carbohydrates,
        fat: mealInfo.fat,
        isSaved: false, 
        ingredients: selectedIngredients, 
        servingQty: 1
      }
      mutation.mutate({meal: newMeal, date: date.toISOString().split('T')[0]});
      onClose();
    }
  }

  useEffect(() => {
    if (!open) {
        setTitle("");
        setQuery("");
        setDebouncedQuery("");
        setSelectedIngredients([]);
    }
  }, [open]);

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
                          onClick={() => handleAddItem(ig)}
                          disabled={selectedIngredients.some(
                            (sel) => sel.fdcId === ig.fdcId
                          )}
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
              selectedIngredients.map((sig) => 
              {
                const nutrition = ingredientNutrition(sig.fdcId);
                return (
                  <div key={sig.fdcId} className="p-3 border rounded-md space-y-2 bg-background shadow-sm">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium mr-2 flex-grow break-words">
                        {sig?.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => handleUnselect(sig.fdcId)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Item</span>
                      </Button>
                    </div>

                    <div className="flex items-end gap-2 flex-wrap sm:flex-nowrap">
                      <div className="flex-1 min-w-[80px]"> 
                        <Label htmlFor={`qty-${sig.fdcId}`} className="text-xs text-muted-foreground">
                          Quantity
                        </Label>
                        <Input
                          id={`qty-${sig.fdcId}`}
                          type="number"
                          min="0"
                          step="0.1" 
                          className="h-8 text-sm mt-1 w-full" 
                          value={sig.selectedServingQty} 
                          onChange={(e) => handleQuantityChange(sig.fdcId, e.target.value)}
                        />
                      </div>

                      <div className="flex-1 min-w-[100px]">
                        <Label htmlFor={`unit-${sig.fdcId}`} className="text-xs text-muted-foreground">
                          Unit
                        </Label>
                        <Select
                          value={sig.selectedServingUnit}
                          onValueChange={(newUnit) => handleUnitChange(sig.fdcId, newUnit)}
                        >
                          <SelectTrigger
                            id={`unit-${sig.fdcId}`}
                            className="h-8 text-sm mt-1 w-full" 
                          >
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {sig?.servingUnits.map((sigServ) => (
                              <SelectItem key={sigServ.unit} value={sigServ.unit} className="text-sm">
                                {sigServ.unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-muted/50 text-xs">
                      <p className="text-muted-foreground mb-1">Nutrition Information:</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <span>Calories:</span>
                          <span className="text-right font-medium">{Math.round(nutrition.calories)} kcal</span>

                          <span>Protein:</span>
                          <span className="text-right font-medium">{Math.round(nutrition.protein)} g</span>

                          <span>Carbohydrates:</span>
                          <span className="text-right font-medium">{Math.round(nutrition.carbohydrates)} g</span>

                          <span>Fat:</span>
                          <span className="text-right font-medium">{Math.round(nutrition.fat)} g</span>
                      </div>
                     </div>
                  </div>
              )})}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={!validateFields}>
            {mode === "addMeal" ? "Save Meal" : "Add Ingredients"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MealDialog;
