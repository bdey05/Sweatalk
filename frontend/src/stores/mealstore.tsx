import { getIngredients, useIngredients } from "@/hooks/useIngredients";
import { create } from "zustand"; 


export type Ingredient = {
    ingredientID?: number
    associatedMealID: number
    isBranded: boolean
    apiQuery: string 
    servingQty: number
    servingUnit: number
    name: string 
    calories?: number
    protein?: number
    carbohydrates?: number
    fat?: number
}

export type Meal = {
    mealID: number
    title: string
    calories: number
    protein: number
    carbohydrates: number
    fat: number
    isSaved: boolean
    ingredients: Ingredient[]
}

export type mealsForDate = {
    //mealDateID: number
    userID: number
    mealID: number
    servingQty: number
    date: Date
}

type MealState = {
    userMeals: mealsForDate[]
    queryIngredients: (query: string) => Ingredient[] 
    addMeal: (meal: Meal, date: Date) => void
    removeMeal: (mealID: number) => void
    editMeal: (mealID: number, newMeal: Meal) => void
    toggleSavedMeal: (meaLID: number) => void 
    getSavedMeals: () => void
    getMealsForDate: (userID: number, date: Date) => Promise<void>;
} 


export const useMealStore = create<MealState>((set) => ({
    userMeals: [],
    queryIngredients: async (query: string) => {
        return await getIngredients(query) || [];
    },
}))