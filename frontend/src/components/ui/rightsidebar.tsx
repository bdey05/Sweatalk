import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Profile from "./profile";
import { useCalendarStore } from "@/stores/calendarstore";

const RightSidebar = () => {
  const date = useCalendarStore((state) => state.date);
  const setDate = useCalendarStore((state) => state.setDate);
  const currentMonth = useCalendarStore((state) => state.currentMonth);
  const setCurrentMonth = useCalendarStore((state) => state.setCurrentMonth);
  const setWeekStart = useCalendarStore((state) => state.setWeekStart);
  const getToday = useCalendarStore((state) => state.getToday);

  return (
    <SidebarProvider className="overflow-x-hidden">
      <Sidebar
        side="right"
        className="border-b border-sidebar-border overflow-x-hidden"
      >
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="p-4">
            <h2 className="text-lg font-semibold">My Profile</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <Profile />
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupContent className="overflow-hidden">
              <div className="max-w-full">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    if (d) {
                      setDate(d);
                      setWeekStart(d);
                    }
                  }}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="w-full max-w-full"
                />

                <div className="flex justify-center mt-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={getToday}
                    className="w-full mx-3 flex items-center justify-center"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Today
                  </Button>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};

export default RightSidebar;
