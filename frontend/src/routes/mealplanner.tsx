import { createFileRoute, redirect } from "@tanstack/react-router";
import AppNav from "@/components/ui/appnav";
import RightSidebar from "@/components/ui/rightsidebar";
import WeekNav from "@/components/ui/weeknav";

export const Route = createFileRoute("/mealplanner")({
  beforeLoad: async () => {
    if (!localStorage.getItem("token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: MealPlanner,
});

function MealPlanner() {

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex-shrink-0">
        <AppNav />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b p-4 bg-background">
          <WeekNav />
        </header>

        <main className="flex-1 overflow-auto p-6"></main>
      </div>

      <div className="flex-shrink-0">
        <RightSidebar />
      </div>
    </div>
  );
}
