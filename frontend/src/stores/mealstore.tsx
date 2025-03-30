import { getIngredients, useIngredients } from "@/hooks/useIngredients";
import { create } from "zustand"; 


type ServingUnit = {
    unit: string 
    calories: number
    carbohydrates: number
    fat: number
    protein: number 
}

export type Ingredient = {
    ingredientID?: number
    associatedMealID: number
    fdcID: number,
    selectedServingQty: number
    selectedServingUnit: number
    name: string 
    servingUnits: ServingUnit[]
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