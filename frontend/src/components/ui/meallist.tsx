import React from 'react'
import MealCard from "@/components/ui/mealcard";


const MealList = ({meals}) => {
  return (
    <>
        {meals.length === 0 ? (
                    <p className="mt-4 text-muted-foreground">
                      No Meals Tracked For This Day
                    </p>
                  ) : (
                    <div className="mt-6 space-y-4 w-full max-w-xl flex flex-col items-center">
                      {meals.map((meal, index) => (
                        <MealCard key={index} meal={meal} />
                      ))}
                    </div>
        )}
    </>
  )
}

export default MealList