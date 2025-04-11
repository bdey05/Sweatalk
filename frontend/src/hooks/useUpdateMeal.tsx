import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Meal } from "@/stores/mealstore";
import { useCalendarStore } from "@/stores/calendarstore";


const apiUrl = import.meta.env.VITE_APP_API_URL;


export const updateMeal = async (mealToUpdate: Meal): Promise<Meal> => {
  try {
    const res = await fetch(
      `${apiUrl}/editmeal/${mealToUpdate.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-tokens": localStorage.getItem("token") || "",
        },
        body: JSON.stringify(mealToUpdate),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to reach endpoint");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
        console.error("Error in updateMeal:", error.message);
      } else {
        console.error("Unknown error in updateMeal:", error);
      }
      throw error;
}
};

export const useUpdateMeal = () => {
  const queryClient = useQueryClient();
  const date = useCalendarStore((state) => state.date);

  return useMutation({
    mutationFn: updateMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meals", date.toISOString().split("T")[0]],
      });
    },
    onError: (error) => {
      console.error("Failed to update meal: ", error);
    },
  });
};
