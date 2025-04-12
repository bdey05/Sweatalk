import { useQuery } from "@tanstack/react-query";
import { Ingredient } from "@/stores/mealstore";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const getIngredients = async (query: string): Promise<Ingredient[]> => {
  if (!query) return [];
  try {
    const res = await fetch(`${apiUrl}/searchingredients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-tokens": localStorage.getItem("token") || "",
      },
      body: JSON.stringify({ query: query }),
    });
    if (!res.ok) {
      throw new Error("Failed to reach endpoint");
    }
    const data = await res.json();
    return data["items"];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getIngredients:", error.message);
    } else {
      console.error("Unknown error in getIngredients:", error);
    }
    throw error;
  }
};

export const useIngredients = (query: string) => {
  return useQuery<Ingredient[]>({
    queryKey: ["ingredients", query],
    queryFn: () => getIngredients(query),
    enabled: query.trim().length > 1,
  });
};
