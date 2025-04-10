import { useQuery } from "@tanstack/react-query"
import { Meal, Ingredient } from "@/stores/mealstore"


const apiUrl = import.meta.env.VITE_APP_API_URL;


export const getMeals = async (date: string): Promise<Meal[]> => {
    if (!date) return [];
    try {
        const res = await fetch(`${apiUrl}/getmeals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-tokens": localStorage.getItem("token")
            },
            body: JSON.stringify({"date": date})
        })
        if (!res.ok){
            throw new Error("Failed to reach endpoint")
        }
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.log(error.message)
    }

}

export const useGetMeals = (date: string) => {
    return useQuery<Meal[]>({
        queryKey: ['meals', date],
        queryFn: () => getMeals(date),
        enabled: !!date
    });
}