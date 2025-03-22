import React from 'react'
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

const WeekNav = () => {
    const weekRange = "March 21 - March 27, 2023"
  const weekDays = [
    { day: "Sun", date: "21", isSelected: false, isToday: false },
    { day: "Mon", date: "22", isSelected: false, isToday: true },
    { day: "Tue", date: "23", isSelected: true, isToday: false },
    { day: "Wed", date: "24", isSelected: false, isToday: false },
    { day: "Thu", date: "25", isSelected: false, isToday: false },
    { day: "Fri", date: "26", isSelected: false, isToday: false },
    { day: "Sat", date: "27", isSelected: false, isToday: false },
  ]
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center justify-between w-full max-w-md">
        <Button variant="outline" size="icon" onClick={() => {}} aria-label="Previous week">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-lg font-medium">{weekRange}</h2>

        <Button variant="outline" size="icon" onClick={() => {}} aria-label="Next week">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center gap-1 w-full max-w-md">
        {weekDays.map((dayInfo, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "flex flex-col h-auto py-2 px-0 flex-1 rounded-md",
              dayInfo.isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              dayInfo.isToday && !dayInfo.isSelected && "border border-primary",
            )}
            onClick={() => {}}
          >
            <span className="text-xs font-medium">{dayInfo.day}</span>
            <span className="text-xl font-bold">{dayInfo.date}</span>
          </Button>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={() => {}} className="mt-2">
        Today
      </Button>
    </div>
  )
}

export default WeekNav