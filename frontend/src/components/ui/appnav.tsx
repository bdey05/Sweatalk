import { Link } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DumbbellIcon,
  LogOut,
  Utensils
} from "lucide-react";

import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
 

import DailyNutritionSummary from "./dailynutrition";

import { useAuthStore } from "@/stores/authstore";

const navigationItems = [
  { icon: Utensils, label: "Meal Plan", to: "/mealplanner" },
  { icon: DumbbellIcon, label: "Workout Tracker", to: "/workout" },
]

type DailyNutriton = {
  calories: number
  protein: number
  carbohydrates: number
  fat: number
}

type AppNavProps = {
  dailyNutrition: DailyNutriton;
}


const AppNav: React.FC<AppNavProps> = ({ dailyNutrition }) => {
  const handleLogout = useAuthStore((state) => state.handleLogout);

  return (
     <SidebarProvider>
          <Sidebar className="border-sidebar-border">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-2 px-2">
              <span className="text-4xl font-semibold text-primary"><Link to="/mealplanner">Sweatalk</Link></span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4">
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className={item.isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                  >
                    <Link
                      to={item.to}
                      className="flex items-center gap-3"
                      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
                {dailyNutrition &&
                <div className="mt-auto mb-4"> 
                    <DailyNutritionSummary
                        calories={dailyNutrition.calories}
                        protein={dailyNutrition.protein}
                        carbohydrates={dailyNutrition.carbohydrates}
                        fat={dailyNutrition.fat}
                    />
                </div> 
              }
          </SidebarContent>
          <SidebarFooter className="p-4">
          <SidebarMenu>
          <div className="flex items-center justify-between px-2">
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} asChild>
                <Link to="/" className="flex items-center gap-3">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <ModeToggle />
          </div>
        </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
    </SidebarProvider>
  )
}

export default AppNav