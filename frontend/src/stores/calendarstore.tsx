import { create } from "zustand";
import { startOfWeek, startOfDay } from "date-fns"

type CalendarState = {
    currentMonth: Date
    date: Date
    weekStart: Date
    setWeekStart: (newWeekStart: Date) => void
    setCurrentMonth: (month: Date) => void 
    setDate: (newDate: Date) => void
    getToday: () => void 
};


export const useCalendarStore = create<CalendarState>((set) => ({
    currentMonth: startOfDay(new Date()),
    date: startOfDay(new Date()),
    weekStart: startOfWeek(startOfDay(new Date())),
    setCurrentMonth: (month) => {
        set({currentMonth: startOfDay(month)});
    },
    setDate: (newDate) => {
        set({date: startOfDay(newDate)});
    },
    setWeekStart: (newWeekStart) => {
        set({weekStart: startOfDay(newWeekStart)})
    },
    getToday: () => {
        set({currentMonth: startOfDay(new Date()), date: startOfDay(new Date()), weekStart: startOfWeek(startOfDay(new Date()))});
    }
}))