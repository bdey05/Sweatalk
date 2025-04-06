import { createFileRoute, redirect } from "@tanstack/react-router";
import AppNav from "@/components/ui/appnav";
import RightSidebar from "@/components/ui/rightsidebar";
import WeekNav from "@/components/ui/weeknav";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import MealCard from "@/components/ui/mealcard";
import { useEffect, useState } from "react";
import MealList from "@/components/ui/meallist";
import MealDialog from "@/components/ui/mealdialog";
import { useIngredients } from "@/hooks/useIngredients";
import { ServingUnit, Ingredient, Meal } from "@/stores/mealstore";
import { useCalendarStore } from "@/stores/calendarstore";
import { useGetMeals } from "@/hooks/useGetMeals";
import { useAddMeal } from "@/hooks/useAddMeal";

export const Route = createFileRoute("/mealplanner")({
  beforeLoad: async () => {
    if (!localStorage.getItem("token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: MealPlanner,
});

function MealPlanner() {

  const date = useCalendarStore((state) => state.date)

  const { data: userMeals = [], isLoading, isError} = useGetMeals(date.toISOString().split('T')[0])

  useEffect(() => {
    
    console.log(date.toISOString().split('T')[0])
  }, [date])



  /*const suItem: ServingUnit = {
    unit: "grams",
    calories: 135,
    carbohydrates: 23,
    fat: 37,
    protein: 22,
  };
  const item: Ingredient = {
    fdcID: 12,
    selectedServingQty: 23,
    selectedServingUnit: "grams",
    name: "Chicken Breast",
    servingUnits: [suItem],
    calories: 365,
    protein: 66,
    carbohydrates: 69,
    fat: 100,
  };

  const [meals, setMeals] = useState<Meal[]>([
    {
      mealID: 123,
      name: "Chicken Sandwich with Tomato Soup",
      calories: 587,
      protein: 35,
      carbohydrates: 40,
      fat: 90,
      isSaved: true,
      ingredients: [
        item, item, item
      ],
      servingQty: 1
    },
    {
      mealID: 123,
      name: "Grilled Salmon with Potatoes",
      calories: 287,
      protein: 45,
      carbohydrates: 30,
      fat: 120,
      isSaved: true,
      ingredients: [
        item, item, item
      ],
      servingQty: 2
    },
  ]);

  const testMeal: Meal = {
    name: "Grilled Salmon with Potatoes",
      calories: 287,
      protein: 45,
      carbohydrates: 30,
      fat: 120,
      isSaved: true,
      ingredients: [
        item, item, item
      ],
      servingQty: 1
  }

  const mutation = useAddMeal(); 
  const handleAdd = () => {
    mutation.mutate({meal: testMeal, date: date.toISOString().split('T')[0]});
  }*/

  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (mode) => {
    setDialogOpen(true);
  };

  /*const addMeal = () => {
    let newMeal = {
      name: "cake",
      calories: 347,
      protein: 43,
      carbohydrates: 30,
      fat: 30,
      isSaved: true,
    };
    setMeals([...meals, newMeal]);
    return;
  };*/

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
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Add New Meal
            </Button>
            {/*<Button
              className="bg-secondary text-primary-foreground hover:bg-secondary/90 px-6 py-3 shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              onClick={handleAdd}
            >
              <Plus className="w-5 h-5" />
              Add Existing Meal
            </Button>*/}
          </div>
          <div className="mt-6 space-y-4 w-full max-w-2xl lg:max-w-3xl flex flex-col items-center"> 
            <MealList meals={userMeals} />
          </div>
        </main>
      </div>
      <div className="flex-shrink-0">
        <RightSidebar />
      </div>
      <MealDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode="addMeal"
      />
    </div>
  );
}
