import { createFileRoute, redirect } from "@tanstack/react-router";
import AppNav from "@/components/ui/appnav";
import RightSidebar from "@/components/ui/rightsidebar";
import WeekNav from "@/components/ui/weeknav";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { useState, useMemo } from "react";
import MealList from "@/components/ui/meallist";
import MealDialog from "@/components/ui/mealdialog";
import { useCalendarStore } from "@/stores/calendarstore";
import { useGetMeals } from "@/hooks/useGetMeals";
import { useDeleteMeal } from "@/hooks/useDeleteMeal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mealplanner")({
  beforeLoad: async () => {
    if (!localStorage.getItem("token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: MealPlanner,
});

function MealPlanner() {
  const date = useCalendarStore((state) => state.date);

  const { data: userMeals = [] } = useGetMeals(
    date.toISOString().split("T")[0]
  );

  const deleteMutation = useDeleteMeal();

  const dailyNutrition = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbohydrates = 0;
    let fat = 0;

    for (const meal of userMeals) {
      calories += meal.calories;
      protein += meal.protein;
      carbohydrates += meal.carbohydrates;
      fat += meal.fat;
    }

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbohydrates: Math.round(carbohydrates),
      fat: Math.round(fat),
    };
  }, [userMeals]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteAll = () => {
    for (const meal of userMeals) {
      if (meal.id) {
        deleteMutation.mutate(meal.id);
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex-shrink-0">
        <AppNav dailyNutrition={dailyNutrition} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b p-4 bg-background shrink-0">
          <WeekNav />
        </header>

        <main
          className={cn(
            "flex flex-1 flex-col items-center overflow-y-auto min-h-0",
            "p-4 lg:p-6"
          )}
        >
          <div className="flex flex-wrap justify-center gap-4 flex-shrink-0">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 sm:px-6 sm:py-3 shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add New Meal
            </Button>
            <Button
              className="bg-destructive text-primary-foreground hover:bg-destructive/90 px-4 py-2 sm:px-6 sm:py-3 shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              onClick={handleDeleteAll}
            >
              <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
              Delete All Meals
            </Button>
          </div>

          <div className="mt-6 space-y-4 w-full max-w-2xl lg:max-w-3xl">
            <MealList meals={userMeals} />
          </div>
          <div className="h-[500px] shrink-0 lg:h-0"></div>
        </main>
      </div>

      <div className="hidden flex-shrink-0 lg:block">
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
