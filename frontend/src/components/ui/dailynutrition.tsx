import React from 'react';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react'; 

type DailyNutritionProps = {
  calories: number
  protein: number
  carbohydrates: number
  fat: number
}

const DailyNutritionSummary: React.FC<DailyNutritionProps> = ({
    calories,
    protein,
    carbohydrates,
    fat,
}) => {
  return (
    <div className="mt-auto p-4 border-t border-border bg-background"> 
      <h4 className="mb-3 text-sm font-semibold text-foreground uppercase tracking-wider">
        Daily Nutrition
      </h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 rounded-md bg-primary/10 border border-primary/20">
          <div className="flex items-center space-x-2">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">Calories</span>
          </div>
          <span className="text-sm font-bold text-primary">
            {calories} kcal
          </span>
        </div>

        
        <div className="flex items-center justify-between p-2 rounded-md bg-destructive/10 border border-destructive/20">
          <div className="flex items-center space-x-2">
            <Beef className="h-4 w-4 text-destructive" /> 
            <span className="text-xs font-medium text-destructive">Protein</span>
          </div>
          <span className="text-sm font-bold text-destructive">
            {protein}g
          </span>
        </div>

        
        <div className="flex items-center justify-between p-2 rounded-md bg-accent/70 dark:bg-accent/40 border border-accent/50">
           <div className="flex items-center space-x-2">
            <Wheat className="h-4 w-4 text-accent-foreground" /> 
            <span className="text-xs font-medium text-accent-foreground">Carbs</span>
          </div>
          <span className="text-sm font-bold text-accent-foreground">
            {carbohydrates}g
          </span>
        </div>

       
        <div className="flex items-center justify-between p-2 rounded-md bg-secondary/70 dark:bg-secondary/40 border border-secondary/50">
           <div className="flex items-center space-x-2">
            <Droplet className="h-4 w-4 text-secondary-foreground" /> 
            <span className="text-xs font-medium text-secondary-foreground">Fat</span>
          </div>
          <span className="text-sm font-bold text-secondary-foreground">
            {fat}g
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyNutritionSummary;