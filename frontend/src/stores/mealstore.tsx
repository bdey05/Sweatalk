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

type MealsForDate = {
    //mealDateID: number
    userID: number
    mealID: number
    servingQty: number
    date: Date
}

