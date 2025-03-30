import React from 'react';
import { Plus, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import IngredientItem from './ingredientitem';
import { ServingUnit, Ingredient, Meal } from "@/stores/mealstore";


const MealCard: React.FC<Meal> = ({
  mealID,
  name,
  calories, 
  protein,
  carbohydrates,
  fat, 
  isSaved,
  date,
  ingredients

}) => {
  

  return (
    
    <Card className="w-full mb-4 border border-border dark:border-muted-foreground shadow-sm hover:shadow-md transition-shadow group">
   
      <CardHeader className="pb-2 flex flex-row justify-between items-center border-b border-border">
        <div className="flex items-center">
        
          <CardTitle className="text-lg font-medium mr-2">{name}</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
          </Button>
          {ingredients.length > 0 && (
            <p className="text-xs text-muted-foreground ml-2">{ingredients.length} {ingredients.length === 1 ? 'item' : 'items'}</p>
          )}
        </div>
        <div className="flex items-center">
          <Toggle
             // defaultPressed={isSaved}
             aria-label="Toggle Save Meal"
             className="rounded-full px-4 py-1 flex items-center text-xs font-medium transition-all border bg-muted text-muted-foreground border-border dark:border-muted-foreground hover:bg-muted/80">
            Save Meal
          </Toggle>
        </div>
      </CardHeader>

      {ingredients.length > 0 && (
        <div className="px-6 py-3 border-b border-border dark:border-muted-foreground">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-primary/10 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Calories</p>
              <p className="font-bold text-primary">{calories}</p>
            </div>
            <div className="bg-destructive/10 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="font-bold text-destructive">{protein}g</p>
            </div>
            <div className="bg-accent/70 dark:bg-accent/40 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="font-bold text-accent-foreground">{carbohydrates}g</p>
            </div>
            <div className="bg-secondary/70 dark:bg-secondary/40 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Fat</p>
              <p className="font-bold text-secondary-foreground">{fat}g</p>
            </div>
          </div>
        </div>
      )}

    
      <CardContent className="pt-4 pb-2"> 
        {ingredients.length > 0 ? (
          <div className="space-y-2"> 
            {ingredients.map((ing, index) => ( 
              <IngredientItem
               key={ing.ingredientID || index} 
               {...ing}
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
            className="border border-input text-muted-foreground hover:text-primary hover:border-primary"
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