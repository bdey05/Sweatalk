import React from "react";
import MealCard from "@/components/ui/mealcard";
import { Meal } from "@/stores/mealstore";

type MealListProps = {
  meals: Meal[];
};

const MealList: React.FC<MealListProps> = ({ meals }) => {
  const sortedMeals = [...meals].sort((mealA, mealB) => {
    if (mealA.id && mealB.id) {
      return mealA.id - mealB.id;
    }
    return 0;
  });

  return (
    <>
      {sortedMeals.length === 0 ? (
        <p className="mt-4 text-muted-foreground">
          No Meals Tracked For This Day
        </p>
      ) : (
        sortedMeals.map((meal) => <MealCard key={meal.id} {...meal} />)
      )}
    </>
  );
};

export default MealList;
