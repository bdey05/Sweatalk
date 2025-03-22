import { create } from "zustand";
import { format, addDays, subDays, startOfWeek, isSameDay, isToday } from "date-fns"

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
    currentMonth: new Date(),
    date: new Date(),
    weekStart: startOfWeek(new Date()),
    setCurrentMonth: (month) => {
        set({currentMonth: month});
    },
    setDate: (newDate) => {
        set({date: newDate});
    },
    setWeekStart: (newWeekStart) => {
        set({weekStart: newWeekStart})
    },
    getToday: () => {
        set({currentMonth: new Date(), date: new Date(), weekStart: startOfWeek(new Date())});
    }
}))