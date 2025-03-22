import { create } from "zustand";



type CalendarState = {
    currentMonth: Date
    date: Date
    setCurrentMonth: (month: Date) => void 
    setDate: (newDate: Date) => void
    getToday: () => void 
};


export const useCalendarStore = create<CalendarState>((set) => ({
    currentMonth: new Date(),
    date: new Date(),
    setCurrentMonth: (month) => {
        set({currentMonth: month});
    },
    setDate: (newDate) => {
        set({date: newDate});
    },
    getToday: () => {
        set({currentMonth: new Date(), date: new Date()});
    }
}))