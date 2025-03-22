import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import AppNav from "@/components/ui/appnav"; 
import { useAuthStore } from "@/stores/authstore";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
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
 const user = useAuthStore((state) => state.user);
 
  return (
    <div className="flex">
      <AppNav/>
      <WeekNav />
      <RightSidebar />
      
    </div>
    
  );
  
}
