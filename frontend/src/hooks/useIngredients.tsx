import { useQuery } from "@tanstack/react-query"
import { Ingredient } from "@/stores/mealstore"

export const getIngredients = async (query: string): Promise<Ingredient[]> => {
    if (!query) return [];
    try {
        const res = await fetch("http://localhost:5000/searchingredients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-tokens": localStorage.getItem("token")
            },
            body: JSON.stringify({"query": query})
        })
        if (!res.ok){
            throw new Error("Failed to reach endpoint")
        }
        const data = await res.json();
        console.log(data["items"]);
        return data["items"];
    }
    catch (error) {
        console.log(error.message)
    }

}

export const useIngredients = (query: string) => {
    return useQuery<Ingredient[]>({
        queryKey: ['ingredients', query],
        queryFn: () => getIngredients(query),
        enabled: query.trim().length > 1
    });
}