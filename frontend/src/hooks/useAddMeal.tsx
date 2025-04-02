import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { Meal, Ingredient } from "@/stores/mealstore"

export const addMeal = async (meal: Meal, date: string): Promise<string> => {
    if (!date) return "Date is missing for the meal";
    try {
        const res = await fetch("http://localhost:5000/addmeal", {
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
        console.log(data);
        return data;
    }
    catch (error) {
        console.log(error.message)
    }

}

export const useAddMeal = (meal: Meal, date: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => addMeal(meal, date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meals', date] })
        },
        onError: (error) => {
            console.error("Failed mutation: ", error);
        }
    })
}