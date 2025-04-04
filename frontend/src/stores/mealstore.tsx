import { getIngredients, useIngredients } from "@/hooks/useIngredients";
import { create } from "zustand"; 


export type ServingUnit = {
    unit: string 
    calories: number
    carbohydrates: number
    fat: number
    protein: number 
}

export type Ingredient = {
    ingredientID?: number
    mealID?: number
    fdcId: number,
    selectedServingQty: number
    selectedServingUnit: string
    name: string 
    servingUnits: ServingUnit[]
    calories?: number
    protein?: number
    carbohydrates?: number
    fat?: number
}

export type Meal = {
    mealID?: number
    name: string
    calories: number
    protein: number
    carbohydrates: number
    fat: number
    servingQty: number
    isSaved: boolean
    ingredients: Ingredient[]
}


type MealState = {
    userMeals: Meal[]
    addMeal: (meal: Meal, date: Date) => void
    removeMeal: (mealID: number) => void
    editMeal: (mealID: number, newMeal: Meal) => void
    getMeal: () => void
    getSavedMeals: () => void
    getMealsForDate: (userID: number, date: Date) => Promise<void>;
} 


export const useMealStore = create<MealState>((set) => ({
    userMeals: [],
    
}))