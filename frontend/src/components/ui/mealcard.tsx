import React from 'react';
import { useState, useMemo, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Toggle } from "@/components/ui/toggle";
import IngredientItem from './ingredientitem';
import { ServingUnit, Ingredient, Meal } from "@/stores/mealstore";
import MealDialog from "@/components/ui/mealdialog";
import { useUpdateMeal } from '@/hooks/useUpdateMeal';
import { useDeleteMeal } from '@/hooks/useDeleteMeal';

export const ingredientNutrition = (ing) => {
  const selectedUnit = ing?.available_units.find(selIng => selIng.unit === ing.selected_serving_unit);
  return {
    "calories": ing?.selected_serving_qty * selectedUnit.calories,
    "protein": ing?.selected_serving_qty * selectedUnit.protein,
    "carbohydrates": ing?.selected_serving_qty * selectedUnit.carbohydrates,
    "fat": ing?.selected_serving_qty * selectedUnit.fat
  }
}

const MealCard: React.FC<Meal> = ({
  id,
  name,
  calories, 
  protein,
  carbohydrates,
  fat, 
  isSaved,
  date,
  ingredients, 
  selected_serving_qty

}) => {

   const [dialogOpen, setDialogOpen] = useState(false);
   const [mealName, setMealName] = useState(name);
   const [ingredientsList, setIngredientsList] = useState(ingredients);
   const updateMutation = useUpdateMeal();
   const deleteMutation = useDeleteMeal();

    useEffect(() => {
        setMealName(name); 
    }, [name]);

    useEffect(() => {
        setIngredientsList(ingredients); 
    }, [ingredients]);
  
    const openDialog = (mode) => {
      setDialogOpen(true);
    };
    
    
      const mealNutrition = useMemo(() => {
        let calories = 0;
        let protein = 0;
        let carbohydrates = 0;
        let fat = 0;
        for (let ig of ingredientsList)
        {
          calories += ingredientNutrition(ig).calories;
          protein += ingredientNutrition(ig).protein;
          carbohydrates += ingredientNutrition(ig).carbohydrates;
          fat += ingredientNutrition(ig).fat;
        }
        
        return {
          "calories": Math.round(calories),
          "protein": Math.round(protein), 
          "carbohydrates": Math.round(carbohydrates),
          "fat": Math.round(fat)
        }
      }, [ingredientsList]);


      const handleMutation = useCallback((updatedIngredients: Ingredient[], newMealName: string) => {
        const updatedMeal = {
          name: newMealName,
          id: id, 
          calories: mealNutrition.calories,
          protein: mealNutrition.protein,
          carbohydrates: mealNutrition.carbohydrates,
          fat: mealNutrition.fat,
          isSaved: false,
          ingredients: updatedIngredients,
          servingQty: 1
        }
        updateMutation.mutate(updatedMeal);
      }, [id, mealNutrition.calories, mealNutrition.carbohydrates, mealNutrition.protein, mealNutrition.fat, updateMutation]);

      const handleNameChange = () => {
          const trimmedName = mealName.trim();
          if (trimmedName && trimmedName !== name)
          {
            handleMutation(ingredientsList, mealName);
          }
          else 
          {
            setMealName(name);
          } 
      }
    
    const handleQuantityChange = useCallback((id: number, newQuantity: number) => {
      const newIngredientsList = ingredientsList.map(ing => {
        if (ing.id === id)
        {
          return { ...ing, selected_serving_qty: newQuantity};
        }
        return ing;
      });
      setIngredientsList(newIngredientsList);
      handleMutation(newIngredientsList, mealName);
    }, [ingredientsList, mealName, handleMutation]);

    const handleUnitChange = useCallback((id: number, newUnit: string) => {
      const newIngredientsList = ingredientsList.map(ing => {
        if (ing.id === id)
        {
          return { ...ing, selected_serving_unit: newUnit};
        }
        return ing;
      });
      setIngredientsList(newIngredientsList);
      handleMutation(newIngredientsList, mealName);
    }, [ingredientsList, mealName, handleMutation]);

    const handleIngredientDelete = useCallback((ingID: number) => {
      const newIngredientsList = ingredientsList.filter(ing => ing.id !== ingID);
      setIngredientsList(newIngredientsList);
      if (newIngredientsList.length === 0)
      {
        deleteMutation.mutate(id);
      }
      else {
        handleMutation(newIngredientsList, mealName);
      }
    }, [handleMutation, ingredientsList, mealName, deleteMutation, id]);

  return (
    
    <Card className="w-full mb-7 border border-border dark:border-muted-foreground shadow-sm transition-shadow"> 

      <CardHeader className="pb-2 flex flex-row justify-between items-center border-b border-border gap-4"> 

        <div className="flex-grow mr-2"> 
            <Input
                value={mealName} 
                onChange={(e) => setMealName(e.target.value)}
                onBlur={handleNameChange}
                placeholder="Meal Name"
                className="h-9 p-5 text-lg border-2 border-border font-medium focus-visible:ring-1 focus-visible:ring-ring bg-transparent shadow-none"
                aria-label="Meal name"
            />
        </div>

       
        <div className="flex-shrink-0"> 
            {ingredientsList.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    {ingredientsList.length} {ingredientsList.length === 1 ? 'item' : 'items'}
                </p>
            )}
            
        </div>
      </CardHeader>

      
      {ingredientsList.length > 0 && (
        <div className="px-6 py-3 border-b border-border dark:border-muted-foreground">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-primary/10 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Calories</p>
              <p className="font-bold text-primary">{mealNutrition.calories}</p>
            </div>
            <div className="bg-destructive/10 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="font-bold text-destructive">{mealNutrition.protein}g</p>
            </div>
            <div className="bg-accent/70 dark:bg-accent/40 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="font-bold text-accent-foreground">{mealNutrition.carbohydrates}g</p>
            </div>
            <div className="bg-secondary/70 dark:bg-secondary/40 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Fat</p>
              <p className="font-bold text-secondary-foreground">{mealNutrition.fat}g</p>
            </div>
          </div>
        </div>
      )}

      <CardContent className="pt-4 pb-2">
        {ingredientsList.length > 0 ? (
          <div className="space-y-2">
            {ingredientsList.map((ing, index) => (
              <IngredientItem
               key={ing.id}
               ingredient={ing}
               onQuantityChange={handleQuantityChange}
               onUnitChange={handleUnitChange}
               onDelete={handleIngredientDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">
            No foods added yet
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-3 pb-3 border-t border-border dark:border-muted-foreground">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border border-input text-muted-foreground"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient
          </Button>
        </div>

        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          onClick={() => deleteMutation.mutate(id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Meal
        </Button>
      </CardFooter>

      
      <MealDialog
    open={dialogOpen}
    onClose={() => setDialogOpen(false)}
    mode="addIngredient"
    mealId={id}
    currentNutrition={mealNutrition}
    mealName={name}
    currentIngredients={ingredients}
  />
    </Card>
  );
};

export default MealCard;