import { Link } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Calendar,
  DumbbellIcon,
  LayoutDashboard,
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

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard", isActive: true },
  { icon: Calendar, label: "Schedule", to: "/schedule" },
  { icon: DumbbellIcon, label: "Workout Tracker", to: "/workout-tracker" },
  { icon: Utensils, label: "Meal Plan", to: "/meal-plan" },
]

import { useState } from "react";

const AppNav = () => {

    const [JWT, setJWT] = useState<string | null>(localStorage.getItem("token"));

    const handleLogout = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/logout", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "x-access-tokens": token || "",
          },
        });
        if (!res.ok)
        {
          throw new Error(`Response status: ${res.status}`);
        }
        localStorage.clear();
        setJWT(null);
  
      } catch(error) {
          console.log(error);
      }
    }
    
  return (
     <SidebarProvider>
          <Sidebar className="border-sidebar-border">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-2 px-2">
              <span className="text-4xl font-semibold text-primary"><Link to="/dashboard">Sweatalk</Link></span>
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