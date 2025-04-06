import React from 'react';
import { Utensils, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServingUnit, Ingredient } from '@/stores/mealstore';
import { ingredientNutrition } from './mealcard';
    
  const IngredientItem: React.FC<Ingredient> = ({
    ingredient
  }) => {

    const nutrition = ingredientNutrition(ingredient);
    const handleQuantityChange = (e) => {
      return;
    };
  
    const handleUnitChange = (value: string) => {
      return;
    };
  
    const handleDeleteClick = () => {
      return;
    }

    return (
      <div className="flex items-center justify-between py-2 border-b border-muted last:border-0 group gap-3">

      <div className="flex items-center flex-grow-[1] mr-2 min-w-0">
        <div className="bg-border p-2 rounded-lg mr-3 flex-shrink-0">
          <Utensils className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium">{ingredient.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {Math.round(nutrition.calories)} kcal
            {nutrition.protein > 0 && <> • P: {Math.round(nutrition.protein)}g</>}
            {nutrition.carbohydrates > 0 && <> • C: {Math.round(nutrition.carbohydrates)}g</>}
            {nutrition.fat > 0 && <> • F: {Math.round(nutrition.fat)}g</>}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Input
          type="number"
          value={ingredient.selected_serving_qty || ''} 
          onChange={handleQuantityChange}
          className="h-8 text-sm w-[70px] flex-shrink-0" 
          min="0"
          step="0.1"
          placeholder="Qty"
          aria-label={`Quantity for ${ingredient.name}`}
        />
        <Select
          value={ingredient.selected_serving_unit || ''} 
          onValueChange={handleUnitChange}
        >
          <SelectTrigger className="h-8 text-sm w-[225px] flex-shrink-0" aria-label={`Unit for ${ingredient.name}`}> 
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {ingredient.available_units?.map((unit) => (
              <SelectItem key={unit.unit} value={unit.unit} className="text-sm">
                {unit.unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-shrink-0 w-8">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
          onClick={handleDeleteClick}
          aria-label={`Delete ${ingredient.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
    );
  };
  
  export default IngredientItem;