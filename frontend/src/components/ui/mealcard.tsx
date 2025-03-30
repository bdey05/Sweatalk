import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle } from "lucide-react";
import MealDialog from "./mealdialog";
import { useState } from "react";
import IngredientItem from "./ingredientitem";
import { ServingUnit, Ingredient } from "@/stores/mealstore";

const MealCard = ({ meal }) => {
  const [isSaved, setIsSaved] = useState(meal.isSaved);
  const [dialogOpen, setDialogOpen] = useState(false);


  const suItem: ServingUnit = {
    unit: "grams",
    calories: 135,
    carbohydrates: 23,
    fat: 37,
    protein: 22
  }
  const item: Ingredient = {
    associatedMealID: 123,
    fdcID: 12,
    selectedServingQty: 23,
    selectedServingUnit: "grams",
    name: "Chicken Breast",
    servingUnits: [suItem],
    calories: 365, 
    protein: 66,
    carbohydrates: 69,
    fat: 100
  }

  const openDialog = (mode) => {
    setDialogOpen(true);
  };
  
  const toggleSave = () => setIsSaved(!isSaved);
  return (
    <Card className="relative w-full max-w-md bg-card text-card-foreground shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{meal.name}</h2>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isSaved ? "Unsave meal" : "Save meal"}
            onClick={toggleSave}
          >
            {isSaved ? <CheckCircle /> : <Save />}
            
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Calories</p>
            <p>{meal.calories} kcal</p>
          </div>
          <div>
            <p className="text-muted-foreground">Carbohydrates</p>
            <p>{meal.carbohydrates} g</p>
          </div>
          <div>
            <p className="text-muted-foreground">Protein</p>
            <p>{meal.protein} g</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fat</p>
            <p>{meal.fat} g</p>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Button className="flex-1" onClick={() => openDialog("edit")}>
            View/Edit Ingredients
          </Button>
          <Button variant="destructive" className="flex-1">
            Delete Meal
          </Button>
        </div>
        <IngredientItem {...item}/>
      </CardContent>
      <MealDialog open={dialogOpen} onClose={() => setDialogOpen(false)} mode="edit" />
    </Card>
  );
}

export default MealCard

/*import React from 'react';
import { Plus, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//import { Toggle } from "@/components/ui/toggle";
//import FoodItem from "./FoodItem";

type FoodData = {
  id: number;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servingSize?: string;
  servingUnit?: string;
  servingQty?: number;
};

type MealSectionProps = {
  id: string;
  title: string;
  foods: FoodData[];
  totalCalories: number;
};

const MealCard: React.FC<MealSectionProps> = ({
  id,
  title,
  foods,
  totalCalories,
}) => {
  // Calculate nutrition totals - pure calculation, no state or effects
  const totalProtein = foods.reduce((sum, food) => sum + (food.protein || 0), 0);
  const totalCarbs = foods.reduce((sum, food) => sum + (food.carbs || 0), 0);
  const totalFat = foods.reduce((sum, food) => sum + (food.fat || 0), 0);

  return (
    <Card className="w-full mb-4 border border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row justify-between items-center bg-muted/50 rounded-t-lg">
        <div className="flex items-center">
          <div className="flex items-center">
            <CardTitle className="text-lg font-medium mr-2">{title}</CardTitle>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
            >
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
            {foods.length > 0 && (
              <p className="text-xs text-muted-foreground ml-2">{foods.length} {foods.length === 1 ? 'item' : 'items'}</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <Toggle
            className="rounded-full px-4 py-1 flex items-center text-xs font-medium transition-all border bg-muted text-muted-foreground border-border hover:bg-muted/80"
          >
            Save Meal
          </Toggle>
        </div>
      </CardHeader>

      {foods.length > 0 && (
        <div className="px-6 py-3 bg-muted/50 border-b border-border">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-primary/10 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Calories</p>
              <p className="font-bold text-primary">{totalCalories}</p>
            </div>
            <div className="bg-destructive/10 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="font-bold text-destructive">{totalProtein}g</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="font-bold text-yellow-500">{totalCarbs}g</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Fat</p>
              <p className="font-bold text-blue-500">{totalFat}g</p>
            </div>
          </div>
        </div>
      )}

      <CardContent className="pt-4">
        {foods.length > 0 ? (
          <div className="mb-2">
            {foods.map((food) => (
              <FoodItem 
                key={food.id}
                id={food.id}
                name={food.name}
                calories={food.calories}
                protein={food.protein}
                carbs={food.carbs}
                fat={food.fat}
                servingSize={food.servingSize}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">
            No foods added yet
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-3 border-t border-border">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="border-dashed border-input text-muted-foreground hover:text-primary hover:border-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Meal
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MealCard;
*/