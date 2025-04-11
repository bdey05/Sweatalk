import React, { useState, useEffect } from 'react';
import { Utensils, Trash2} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ingredient } from '@/stores/mealstore';
import { ingredientNutrition } from './mealcard';
    
type IngredientItemProps = {
  ingredient: Ingredient;
  onQuantityChange: (id: number, newQuantity: number) => void; 
  onUnitChange: (id: number, newUnit: string) => void;
  onDelete: (id: number) => void;
}

  const IngredientItem: React.FC<IngredientItemProps> = ({
    ingredient,
    onQuantityChange,
    onUnitChange,
    onDelete
  }) => {

    const [qty, setQty] = useState(ingredient.selected_serving_qty);
    const [unit, setUnit] = useState(ingredient.selected_serving_unit);


    useEffect(() => {
      setQty(ingredient.selected_serving_qty);
    }, [ingredient.selected_serving_qty]);

    const nutrition = ingredientNutrition(ingredient);

    const handleQuantityChange = () => {
      if (qty === undefined || qty <= 0)
      {
        setQty(ingredient.selected_serving_qty);
      }
      else 
      {
        if (qty !== ingredient.selected_serving_qty && ingredient.id)
        {
          onQuantityChange(ingredient.id, qty);
        }
      }
    };
  
    const handleUnitChange = (newUnit: string) => {
       setUnit(newUnit);
       if (ingredient.id)
       {
          onUnitChange(ingredient.id, newUnit); 
       }
    };
  
    const handleDeleteClick = () => {
      if (ingredient.id)
      {
          onDelete(ingredient.id); 
      }
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
            {Math.round(nutrition?.calories ?? 0)} kcal
            • P: {Math.round(nutrition?.protein ?? 0)}g
            • C: {Math.round(nutrition?.carbohydrates ?? 0)}g
            • F: {Math.round(nutrition?.fat ?? 0)}g
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Input
          type="number"
          value={qty} 
          onChange={(e) => setQty(parseFloat(e.target.value))}
          onBlur={handleQuantityChange}
          className="h-8 text-sm w-[70px] flex-shrink-0" 
          min="0"
          step="0.1"
          placeholder="Qty"
          aria-label={`Quantity for ${ingredient.name}`}
        />
        <Select
          value={unit} 
          onValueChange={(newUnit) => handleUnitChange(newUnit)}
        >
          <SelectTrigger className="h-8 text-sm w-[240px] flex-shrink-0" aria-label={`Unit for ${ingredient.name}`}> 
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