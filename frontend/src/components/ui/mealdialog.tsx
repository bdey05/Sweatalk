import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { Trash2, Plus, Flame, Beef, Wheat, Droplet } from "lucide-react";
import { useIngredients } from "@/hooks/useIngredients";
import { Ingredient, SelectedIngredient, Meal } from "@/stores/mealstore";
import { useCalendarStore } from "@/stores/calendarstore";
import { useAddMeal } from "@/hooks/useAddMeal";
import { useUpdateMeal } from "@/hooks/useUpdateMeal";
//import { cn } from "@/lib/utils";

type MealNutritionData = {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

type MealDialogProps = {
  open: boolean;
  onClose: () => void;
  mode: "addMeal" | "addIngredient";
  mealId?: number;
  currentNutrition?: MealNutritionData;
  mealName?: string;
  currentIngredients?: Ingredient[];
};

const MealDialog: React.FC<MealDialogProps> = ({
  open,
  onClose,
  mode,
  mealId,
  currentNutrition,
  mealName,
  currentIngredients,
}) => {
  const [title, setTitle] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredient[]
  >([]);
  const date = useCalendarStore((state) => state.date);
  const mutation = useAddMeal();
  const updateMutation = useUpdateMeal();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const handleAddItem = (ing: Ingredient) => {
    if (ing.fdcId === undefined || ing.fdcId === null) {
      console.warn("Attempted to add an ingredient with an invalid fdcId");
      return;
    }

    const firstServing = ing.servings?.[0];

    const newIngredient: SelectedIngredient = {
      fdcId: ing.fdcId,
      name: ing.name,
      selectedServingQty: 1,
      selectedServingUnit: firstServing?.unit ?? "",
      servingUnits: ing.servings ?? [],
      selectedServingUnitInfo: ing.servings![0],
    };
    setSelectedIngredients((prevIngredients) => [
      ...prevIngredients,
      newIngredient,
    ]);
  };

  const handleUnselect = (selectedID: number) => {
    setSelectedIngredients((currentIngredients) =>
      currentIngredients.filter((s) => s.fdcId !== selectedID)
    );
  };

  const handleUnitChange = (id: number, newUnit: string) => {
    setSelectedIngredients((currentItems) =>
      currentItems.map((item) => {
        if (item.fdcId === id) {
          const newServingInfo = item.servingUnits.find(
            (unitInfo) => unitInfo.unit === newUnit
          );
          return {
            ...item,
            selectedServingUnit: newUnit,
            selectedServingUnitInfo: newServingInfo,
          };
        }
        return item;
      })
    );
  };

  const handleQuantityBlur = (id: number, newQuantity: number) => {
    if (isNaN(newQuantity) || newQuantity === 0) {
      newQuantity = 1;
    }
    setSelectedIngredients((currentItems) =>
      currentItems.map((item) =>
        item.fdcId === id ? { ...item, selectedServingQty: newQuantity } : item
      )
    );
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setSelectedIngredients((currentItems) =>
      currentItems.map((item) =>
        item.fdcId === id ? { ...item, selectedServingQty: newQuantity } : item
      )
    );
  };

  const validateFields = useMemo(() => {
    if (selectedIngredients.length === 0) {
      return false;
    }
    if (mode === "addMeal" && title.trim() === "") {
      return false;
    }
    return selectedIngredients.every((sig) => {
      const quantityValid = sig.selectedServingQty > 0;
      return quantityValid;
    });
  }, [selectedIngredients, title, mode]);

  const ingredientNutrition = useCallback(
    (id: number) => {
      const ing = selectedIngredients.find((selIng) => selIng.fdcId === id);
      if (ing && ing.selectedServingUnitInfo) {
        return {
          calories:
            ing?.selectedServingQty * ing?.selectedServingUnitInfo.calories,
          protein:
            ing?.selectedServingQty * ing?.selectedServingUnitInfo.protein,
          carbohydrates:
            ing?.selectedServingQty *
            ing?.selectedServingUnitInfo.carbohydrates,
          fat: ing?.selectedServingQty * ing?.selectedServingUnitInfo.fat,
        };
      }
    },
    [selectedIngredients]
  );

  const mealNutrition = useMemo(() => {
    let calories, protein, carbohydrates, fat;
    if (mode === "addMeal") {
      calories = 0;
      protein = 0;
      carbohydrates = 0;
      fat = 0;
    } else {
      calories = currentNutrition?.calories ?? 0;
      protein = currentNutrition?.protein ?? 0;
      carbohydrates = currentNutrition?.carbohydrates ?? 0;
      fat = currentNutrition?.fat ?? 0;
    }
    for (const seling of selectedIngredients) {
      const calculatedNutrition = ingredientNutrition(seling.fdcId);
      if (calculatedNutrition) {
        calories += calculatedNutrition.calories;
        protein += calculatedNutrition.protein;
        carbohydrates += calculatedNutrition.carbohydrates;
        fat += calculatedNutrition.fat;
      }
    }

    return {
      calories: calories,
      protein: protein,
      carbohydrates: carbohydrates,
      fat: fat,
    };
  }, [
    selectedIngredients,
    ingredientNutrition,
    currentNutrition?.calories,
    currentNutrition?.protein,
    currentNutrition?.carbohydrates,
    currentNutrition?.fat,
    mode,
  ]);

  const handleSave = () => {
    if (mode === "addMeal") {
      const newMeal: Meal = {
        name: title,
        calories: mealNutrition.calories,
        protein: mealNutrition.protein,
        carbohydrates: mealNutrition.carbohydrates,
        fat: mealNutrition.fat,
        isSaved: false,
        ingredients: selectedIngredients,
        servingQty: 1,
      };
      mutation.mutate({
        meal: newMeal,
        date: date.toISOString().split("T")[0],
      });
    } else {
      const updatedIngredients = [...(currentIngredients ?? [])];

      for (const ing of selectedIngredients) {
        const ingToAdd = {
          available_units: ing.servingUnits,
          fdc_id: ing.fdcId,
          name: ing.name,
          selected_serving_qty: ing.selectedServingQty,
          selected_serving_unit: ing.selectedServingUnit,
        };
        updatedIngredients.push(ingToAdd);
      }

      const updatedMeal: Meal = {
        name: mealName ?? "",
        id: mealId,
        calories: mealNutrition.calories,
        protein: mealNutrition.protein,
        carbohydrates: mealNutrition.carbohydrates,
        fat: mealNutrition.fat,
        isSaved: false,
        ingredients: updatedIngredients,
        servingQty: 1,
      };

      updateMutation.mutate(updatedMeal);
    }
    onClose();
  };

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
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {mode === "addMeal" ? "Add New Meal" : "Add Ingredients"}
          </DialogTitle>
          <DialogDescription>
            {mode === "addMeal"
              ? "Name your meal and search for ingredients to add."
              : "Search for ingredients to add to this meal."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-auto grid grid-cols-1 md:grid-cols-2 gap-4 py-4 min-h-0">
          <div className="flex flex-col gap-4 overflow-hidden min-h-0">
            {mode === "addMeal" && (
              <div className="shrink-0">
                <Label htmlFor="mealName">Meal Name</Label>
                <Input
                  id="mealName"
                  placeholder="e.g., Chicken Salad"
                  className="mt-1"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            )}
            <div className="shrink-0">
              <Label htmlFor="ingredientSearch">Search Ingredients</Label>
              <Input
                id="ingredientSearch"
                placeholder="e.g., chicken breast, apple"
                className="mt-1"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex-grow overflow-hidden border rounded-md min-h-0">
              <ScrollArea className="h-full p-3">
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Search Results:
                </h4>
                {!isLoading &&
                  query.trim() === "" &&
                  ingredients.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Start typing to search for ingredients.
                    </p>
                  )}
                {isLoading && (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                )}
                {isError && (
                  <p className="text-sm text-destructive">
                    Could not load ingredients.
                  </p>
                )}
                {!isLoading &&
                  !isError &&
                  ingredients.length === 0 &&
                  debouncedQuery.trim() !== "" && (
                    <p className="text-sm text-muted-foreground">
                      No results found for "{debouncedQuery}".
                    </p>
                  )}
                <div className="space-y-2 mt-2">
                  {ingredients.length > 0 &&
                    ingredients.map((ig, idx) => (
                      <div
                        key={ig.fdcId ?? idx}
                        className="flex items-center justify-between p-2 border rounded-md bg-muted/30 hover:bg-muted/60 gap-2"
                      >
                        <span className="text-sm flex-grow mr-2 min-w-0 break-words">
                          {ig?.name}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => handleAddItem(ig)}
                          disabled={selectedIngredients.some(
                            (sel) => sel.fdcId === ig.fdcId
                          )}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex flex-col gap-4 overflow-hidden min-h-0">
            <h4 className="text-sm font-medium text-muted-foreground px-3 pt-3 shrink-0">
              Ingredients Added
            </h4>
            <div className="flex-grow overflow-hidden border rounded-md min-h-0">
              <ScrollArea className="h-full p-3">
                {selectedIngredients.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No ingredients added yet.
                  </p>
                )}
                <div className="flex flex-col space-y-3">
                  {selectedIngredients.length > 0 &&
                    selectedIngredients.map((sig) => {
                      const nutrition = ingredientNutrition(sig.fdcId);
                      return (
                        <div
                          key={sig.fdcId}
                          className="p-3 border rounded-md space-y-2 bg-background shadow-sm"
                        >
                          <div className="flex justify-between items-start gap-1">
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
                            <div className="flex-1 min-w-0">
                              <Label
                                htmlFor={`qty-${sig.fdcId}`}
                                className="text-xs text-muted-foreground"
                              >
                                Quantity
                              </Label>
                              <Input
                                id={`qty-${sig.fdcId}`}
                                type="number"
                                min="0.1"
                                step="0.1"
                                className="h-8 text-sm mt-1 w-full"
                                value={sig.selectedServingQty}
                                onBlur={(e) =>
                                  handleQuantityBlur(
                                    sig.fdcId,
                                    parseFloat(e.target.value)
                                  )
                                }
                                onChange={(e) =>
                                  handleQuantityChange(
                                    sig.fdcId,
                                    parseFloat(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Label
                                htmlFor={`unit-${sig.fdcId}`}
                                className="text-xs text-muted-foreground"
                              >
                                Unit
                              </Label>
                              <Select
                                value={sig.selectedServingUnit}
                                onValueChange={(newUnit) =>
                                  handleUnitChange(sig.fdcId, newUnit)
                                }
                              >
                                <SelectTrigger
                                  id={`unit-${sig.fdcId}`}
                                  className="h-8 text-sm mt-1 w-full"
                                >
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sig?.servingUnits.map((sigServ) => (
                                    <SelectItem
                                      key={sigServ.unit}
                                      value={sigServ.unit}
                                      className="text-sm"
                                    >
                                      {sigServ.unit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {nutrition && (
                            <div className="mt-2 pt-2 border-t border-muted/50 text-xs">
                              <p className="text-muted-foreground mb-1">
                                Approx. Nutrition:
                              </p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <span>Calories:</span>
                                <span className="text-right font-medium">
                                  {Math.round(nutrition.calories)} kcal
                                </span>
                                <span>Protein:</span>
                                <span className="text-right font-medium">
                                  {Math.round(nutrition.protein)} g
                                </span>
                                <span>Carbs:</span>
                                <span className="text-right font-medium">
                                  {Math.round(nutrition.carbohydrates)} g
                                </span>
                                <span>Fat:</span>
                                <span className="text-right font-medium">
                                  {Math.round(nutrition.fat)} g
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t shrink-0">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3 text-center text-primary">
            Meal Nutrition Summary
          </h3>
          {selectedIngredients.length > 0 || currentNutrition ? (
            <div>
              <div className="sm:hidden grid grid-cols-4 gap-x-2 text-center px-2 py-1 bg-muted/50 rounded-md">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Calories
                  </p>
                  <p className="text-xs font-bold">
                    {Math.round(mealNutrition.calories)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Protein
                  </p>
                  <p className="text-xs font-bold">
                    {Math.round(mealNutrition.protein)}g
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Carbohydrates
                  </p>
                  <p className="text-xs font-bold">
                    {Math.round(mealNutrition.carbohydrates)}g
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Fat
                  </p>
                  <p className="text-xs font-bold">
                    {Math.round(mealNutrition.fat)}g
                  </p>
                </div>
              </div>

              <div className="hidden sm:grid sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg bg-card border shadow-sm text-center">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 mb-1 text-primary" />
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                    Calories
                  </span>
                  <span className="text-sm sm:text-lg font-bold text-card-foreground">
                    {Math.round(mealNutrition.calories)}
                  </span>
                  <span className="text-[9px] sm:text-xs text-muted-foreground">
                    kcal
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg bg-card border shadow-sm text-center">
                  <Beef className="w-4 h-4 sm:w-5 sm:h-5 mb-1 text-destructive" />
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                    Protein
                  </span>
                  <span className="text-sm sm:text-lg font-bold text-card-foreground">
                    {Math.round(mealNutrition.protein)}
                  </span>
                  <span className="text-[9px] sm:text-xs text-muted-foreground">
                    g
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg bg-card border shadow-sm text-center">
                  <Wheat className="w-4 h-4 sm:w-5 sm:h-5 mb-1 text-accent" />
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                    Carbs
                  </span>
                  <span className="text-base sm:text-xl font-bold text-card-foreground">
                    {Math.round(mealNutrition.carbohydrates)}
                  </span>
                  <span className="text-[9px] sm:text-xs text-muted-foreground">
                    g
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg bg-card border shadow-sm text-center">
                  <Droplet className="w-4 h-4 sm:w-5 sm:h-5 mb-1 text-secondary" />
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                    Fat
                  </span>
                  <span className="text-base sm:text-xl font-bold text-card-foreground">
                    {Math.round(mealNutrition.fat)}
                  </span>
                  <span className="text-[9px] sm:text-xs text-muted-foreground">
                    g
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Add ingredients to see nutrition summary.
            </p>
          )}
        </div>

        <DialogFooter className="shrink-0 mt-4 sm:mt-6">
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
