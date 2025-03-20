import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import AppNav from "@/components/ui/appnav"; 
import { useAuthStore } from "@/stores/authstore";
import { useEffect, useState } from "react";



export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    if (!localStorage.getItem("token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: Dashboard,
});


function Dashboard() {
 const user = useAuthStore((state) => state.user);
 console.log(user);
 
  return (
    <div>
      <AppNav />
    </div>
    
  );
  
}
