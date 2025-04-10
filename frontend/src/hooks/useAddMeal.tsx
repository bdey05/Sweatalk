import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { Meal, Ingredient } from "@/stores/mealstore"

interface MealDate {
    meal: Meal;
    date: string;
}

const apiUrl = import.meta.env.VITE_APP_API_URL;


export const addMeal = async (mealToAdd: MealDate): Promise<string> => {
    const {meal, date} = mealToAdd;
    if (!date) return "Date is missing for the meal";
    try {
        const res = await fetch(`${apiUrl}/addmeal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-tokens": localStorage.getItem("token")
            },
            body: JSON.stringify({"meal": meal, "date": date})
        })
        if (!res.ok){
            throw new Error("Failed to reach endpoint")
        }
        const data = await res.text();
        return data;
    }
    catch (error) {
        console.log(error.message)
    }

}

export const useAddMeal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addMeal,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['meals', variables.date] })
        },
        onError: (error) => {
            console.error("Failed to add meal: ", error);
        }
    })
}