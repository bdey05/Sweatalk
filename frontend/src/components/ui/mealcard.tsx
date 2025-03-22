import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Meal } from "@/types/meal";

export default function MealCard ( {meal} ) {
  return (
    <Card className="w-full max-w-md bg-card text-card-foreground shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="flex gap-10">
            <h2 className="text-lg font-semibold">{meal.name}</h2>
            <Save />
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
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1">
            Save Meal
          </Button>
          <Button variant="outline" className="flex-1">
            View/Edit Ingredients
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
