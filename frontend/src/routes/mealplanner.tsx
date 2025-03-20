import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import AppNav from "@/components/ui/appnav"; 
import { useAuthStore } from "@/stores/authstore";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";



export const Route = createFileRoute("/mealplanner")({
  beforeLoad: async () => {
    if (!localStorage.getItem("token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: MealPlanner,
});


function MealPlanner() {
 const user = useAuthStore((state) => state.user);
 const [selected, setSelected] = useState<Date>();

 console.log(user);
 
  return (
    <div className="flex">
      <AppNav/>
      <div className="flex-1 p-4">
        <div className="flex justify-center items-center mt-6">
          <div className="border border-card-foreground rounded-lg p-4 shadow-md">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
    
  );
  
}
