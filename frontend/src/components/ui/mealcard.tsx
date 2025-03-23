import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function MealCard({ meal }) {
  const [isSaved, setIsSaved] = useState(meal.isSaved);

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
          <Button className="flex-1">
            View/Edit Ingredients
          </Button>
          <Button variant="destructive" className="flex-1">
            Delete Meal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
