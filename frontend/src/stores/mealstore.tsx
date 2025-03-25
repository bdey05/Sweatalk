import { create } from "zustand"; 


type Ingredient = {
    ingredientID: number
    associatedMealID: number
    isBranded: boolean
    apiQuery: string 
    servingQty: number
    servingUnit: number
}

type Meal = {
    mealID: number
    title: string
    calories: number
    protein: number
    carbohydrates: number
    fat: number
    isSaved: boolean
    ingredients: Ingredient[]
}

type mealsForDate = {
    //mealDateID: number
    userID: number
    mealID: number
    servingQty: number
    date: Date
}

type useMealStore = {
    userMeals: mealsForDate[]
    addMeal: (meal: Meal, date: Date) => void
    removeMeal: (mealID: number) => void
    editMeal: (mealID: number, newMeal: Meal) => void
    toggleSavedMeal: (meaLID: number) => void 
    getSavedMeals: () => void
    getMealsForDate: (userID: number, date: Date) => Promise<void>;
} 