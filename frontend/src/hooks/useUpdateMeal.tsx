import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { Meal, Ingredient } from "@/stores/mealstore"
import { useCalendarStore } from "@/stores/calendarstore"


export const updateMeal = async (mealToUpdate: Meal): Promise<Meal> => {
    console.log(mealToUpdate);
    try {
        const res = await fetch(`http://localhost:5000/editmeal/${mealToUpdate.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-tokens": localStorage.getItem("token")
            },
            body: JSON.stringify(mealToUpdate)
        })
        if (!res.ok){
            throw new Error("Failed to reach endpoint")
        }
        const data = await res.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.log(error.message)
    }

}

export const useUpdateMeal = () => {
    const queryClient = useQueryClient();
    const date = useCalendarStore((state) => state.date);

    return useMutation({
        mutationFn: updateMeal,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['meals', date] })
        },
        onError: (error) => {
            console.error("Failed to update meal: ", error);
        }
    })
}