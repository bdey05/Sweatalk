import { Link } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { LogOut, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  //Sidebar,
  SidebarProvider,
 // SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import DailyNutritionSummary from "./dailynutrition";

import { useAuthStore } from "@/stores/authstore";

const navigationItems = [
  { icon: Utensils, label: "Meal Tracker", to: "/mealplanner" },
  //{ icon: DumbbellIcon, label: "Workout Tracker", to: "/workout" },
];

type DailyNutriton = {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

type AppNavProps = {
  dailyNutrition: DailyNutriton;
};

const AppNav: React.FC<AppNavProps> = ({ dailyNutrition }) => {
  const handleLogout = useAuthStore((state) => state.handleLogout);

  return (
    <SidebarProvider>
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background",
        "lg:relative lg:left-auto lg:top-auto lg:z-auto lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-r lg:border-t-0 lg:border-sidebar-border"
      )}
    >
      <div className="flex w-full flex-col lg:hidden">
        {dailyNutrition && (
          <div className="w-full shrink-0 border-b border-border px-4 py-2">
            <DailyNutritionSummary
              calories={dailyNutrition.calories}
              protein={dailyNutrition.protein}
              carbohydrates={dailyNutrition.carbohydrates}
              fat={dailyNutrition.fat}
            />
          </div>
        )}

        <div className="flex h-16 w-full flex-row items-stretch justify-around px-4">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex flex-1 flex-col items-center justify-center gap-1 p-1 text-sm"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-1 flex-col items-center justify-center gap-3 p-1 text-sm"
          >
            <Link to="/">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
            </Link>
          </button>
          <div className="flex items-center justify-center px-5">
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="hidden h-full w-full flex-col lg:flex">
        <SidebarHeader className="shrink-0 p-6">
          <div className="flex items-center gap-2 px-2">
            <span className="text-4xl font-semibold text-primary">
              <Link to="/mealplanner">Jotmeal</Link>
            </span>
          </div>
        </SidebarHeader>

        <div className="flex w-full flex-grow flex-col overflow-y-auto px-4">
          <SidebarMenu className="shrink-0">
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.to}
                    className="flex items-center gap-3"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          {dailyNutrition && (
            <div className="mt-auto w-full shrink-0 pb-4">
              <DailyNutritionSummary
                calories={dailyNutrition.calories}
                protein={dailyNutrition.protein}
                carbohydrates={dailyNutrition.carbohydrates}
                fat={dailyNutrition.fat}
              />
            </div>
          )}
        </div>

        <SidebarFooter className="shrink-0 p-4">
          <SidebarMenu>
            <div className="flex items-center justify-between px-2">
              <SidebarMenuItem>
                 <button onClick={handleLogout} className="flex items-center gap-3 p-2 text-sm">
                 <Link to="/" className="flex items-center gap-3">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                  </button>
              </SidebarMenuItem>
              <ModeToggle />
            </div>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </div>
  </SidebarProvider>
    
  );
};

export default AppNav;
