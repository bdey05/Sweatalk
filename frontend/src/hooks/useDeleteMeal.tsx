import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { Meal, Ingredient } from "@/stores/mealstore"
import { useCalendarStore } from "@/stores/calendarstore"


export const deleteMeal = async (mealID: number): Promise<Meal> => {
    console.log(mealID);
    try {
        const res = await fetch(`http://localhost:5000/deletemeal/${mealID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-access-tokens": localStorage.getItem("token")
            }
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

export const useDeleteMeal = () => {
    const queryClient = useQueryClient();
    const date = useCalendarStore((state) => state.date);

    return useMutation({
        mutationFn: deleteMeal,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['meals', date.toISOString().split('T')[0]] })
        },
        onError: (error) => {
            console.error("Failed to delete meal: ", error);
        }
    })
}