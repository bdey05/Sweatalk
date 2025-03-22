import React from 'react'
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, addDays, subDays, startOfWeek, isSameDay, isToday } from "date-fns"
import { Button } from "@/components/ui/button"
import { useCalendarStore } from "@/stores/calendarstore";

const WeekNav = () => {
  const { date, setDate, weekStart, setWeekStart, currentMonth, setCurrentMonth, getToday } = useCalendarStore()

  const weekDays = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => addDays(weekStart, index))
  }, [weekStart])

  const handlePrevWeek = () => {
    setWeekStart(subDays(weekStart, 7))
    setCurrentMonth(subDays(weekStart, 3))
  }

  const handleNextWeek = () => {
    setWeekStart(addDays(weekStart, 7))
    setCurrentMonth(addDays(weekStart, 3))

  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center justify-between w-full max-w-md">
        <Button variant="outline" size="icon" onClick={handlePrevWeek} aria-label="Previous week">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-lg font-medium">
          {format(weekStart, "MMMM d")} - {format(addDays(weekStart, 6), "MMMM d, yyyy")}
        </h2>

        <Button variant="outline" size="icon" onClick={handleNextWeek} aria-label="Next week">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center gap-1 w-full max-w-md">
        {weekDays.map((day) => (
          <Button
            key={format(day, "yyyy-MM-dd")}
            variant="ghost"
            className={cn(
              "flex flex-col h-auto py-2 px-0 flex-1 rounded-md",
              isSameDay(day, date) &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              isToday(day) && !isSameDay(day, date) && "border border-primary",
            )}
            onClick={() => setDate(day)}
          >
            <span className="text-xs font-medium">{format(day, "EEE")}</span>
            <span className="text-xl font-bold">{format(day, "d")}</span>
          </Button>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={getToday} className="mt-2">
        <CalendarIcon className="h-4 w-4" />
        Today
      </Button>
    </div>
  )
}

export default WeekNav