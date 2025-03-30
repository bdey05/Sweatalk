import React from 'react';
import { Utensils, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServingUnit, Ingredient } from '@/stores/mealstore';

    
  const IngredientItem: React.FC<Ingredient> = ({
    ingredientID="N/A",
    associatedMealID,
    fdcID,
    selectedServingQty,
    selectedServingUnit,
    name, 
    servingUnits,
    calories,
    protein,
    carbohydrates,
    fat
  }) => {
    return (
      <div className="flex items-center justify-between py-3 border-b border-muted-foreground last:border-0 group">
        <div className="flex items-center flex-1">
          <div className="bg-border p-2 rounded-lg mr-3">
            <Utensils className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium">{name}</h4>
            <p className="text-xs text-muted-foreground">{selectedServingQty} {selectedServingUnit}</p>
          </div>
        </div>
        <div className="text-right mr-2">
          <p className="font-medium">{calories} cal</p>
          {protein !== undefined && carbohydrates !== undefined && fat !== undefined && (
            <p className="text-xs text-muted-foreground">
              P: {protein}g • C: {carbohydrates}g • F: {fat}g
            </p>
          )}
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    );
  };
  
  export default IngredientItem;