import React from 'react'
import MealCard from "@/components/ui/mealcard";
import { ServingUnit, Ingredient, Meal } from "@/stores/mealstore";


type MealListProps = {
  meals: Meal[]
}

const MealList: React.FC<MealListProps> = ({meals}) => {
  return (
    <>
      {meals.length === 0 ? (
        <p className="mt-4 text-muted-foreground">
          No Meals Tracked For This Day
        </p>
      ) : (
        
        meals.map((meal) => (
          <MealCard key={meal.id} {...meal} />
        ))
      )}
    </>
  );
};

export default MealList;