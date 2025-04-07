import { createFileRoute, redirect } from "@tanstack/react-router";
import AppNav from "@/components/ui/appnav";
import RightSidebar from "@/components/ui/rightsidebar";
import WeekNav from "@/components/ui/weeknav";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import MealCard from "@/components/ui/mealcard";
import { useEffect, useState } from "react";
import MealList from "@/components/ui/meallist";
import MealDialog from "@/components/ui/mealdialog";
import { useIngredients } from "@/hooks/useIngredients";
import { ServingUnit, Ingredient, Meal } from "@/stores/mealstore";
import { useCalendarStore } from "@/stores/calendarstore";
import { useGetMeals } from "@/hooks/useGetMeals";
import { useAddMeal } from "@/hooks/useAddMeal";
import { useDeleteMeal } from "@/hooks/useDeleteMeal";

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

  const deleteMutation = useDeleteMeal();

  useEffect(() => {
    
    console.log(date.toISOString().split('T')[0])
  }, [date])



  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (mode) => {
    setDialogOpen(true);
  };

  const handleDeleteAll = () => {
    for (let meal of userMeals)
    {
      deleteMutation.mutate(meal.id);
    }
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
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Add New Meal
            </Button>
            <Button
              className="bg-destructive text-primary-foreground hover:bg-destructive/90 px-6 py-3 shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              onClick={handleDeleteAll}
            >
              <Trash className="w-5 h-5" />
              Delete All Meals
            </Button>
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
