import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import AppNav from "@/components/ui/appnav"; 

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    if (!localStorage.getItem("token")) {
      throw redirect({ to: "/login" });
    }
  },
  component: Dashboard,
});

function Dashboard() {
 
  return (
    <AppNav />
  );
  
}
