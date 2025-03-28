import { createFileRoute, redirect } from "@tanstack/react-router";
import AppNav from "@/components/ui/appnav";
import RightSidebar from "@/components/ui/rightsidebar";
import WeekNav from "@/components/ui/weeknav";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import MealCard from "@/components/ui/mealcard";
import { useState } from "react";
import MealList from "@/components/ui/meallist";
import MealDialog from "@/components/ui/mealdialog";
import { useIngredients } from "@/hooks/useIngredients";


export const Route = createFileRoute("/mealplanner")({
  beforeLoad: async () => {
    if (!localStorage.getItem("token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: MealPlanner,
});

function MealPlanner() {
  const { data: ingredients = [], isLoading, isError } = useIngredients("burger");
  console.log(ingredients)
  
  const [meals, setMeals] = useState([
    {
      name: "Chicken Sandwich with Tomato Soup",
      calories: 587,
      protein: 35,
      carbohydrates: 40,
      fat: 90,
      isSaved: true
    },
    {
      name: "Lasagna with Vegetables",
      calories: 480,
      protein: 35,
      carbohydrates: 50,
      fat: 40,
      isSaved: false
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (mode) => {
    setDialogOpen(true);
  };

  let addMeal = () => {
    let newMeal = {name: "cake", calories: 347, protein: 43, carbohydrates: 30, fat: 30, isSaved: true};
    setMeals([...meals, newMeal]);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex-shrink-0">
        <AppNav />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b p-4 bg-background">
          <WeekNav />
        </header>

        <main className="flex flex-1 flex-col items-center overflow-auto p-6">
          <div className="flex gap-5">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 shadow-lg flex items-center gap-2 transition-transform hover:scale-105" onClick={() => setDialogOpen(true)}>
              <Plus className="w-5 h-5" />
              Add New Meal
            </Button>
            <Button className="bg-secondary text-primary-foreground hover:bg-secondary/90 px-6 py-3 shadow-lg flex items-center gap-2 transition-transform hover:scale-105" onClick={addMeal}>
              <Plus className="w-5 h-5" />
              Add Existing Meal
            </Button>
          </div>
          <MealList meals={meals} />
        </main>
      </div>
      <div className="flex-shrink-0">
        <RightSidebar />
      </div>
      <MealDialog open={dialogOpen} onClose={() => setDialogOpen(false)} mode="add" />

    </div>
  );
}
