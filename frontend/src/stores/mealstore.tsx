export type ServingUnit = {
  unit: string;
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
};

export type Ingredient = {
  id?: number;
  mealID?: number;
  fdcId: number;
  selected_serving_qty: number;
  selected_serving_unit: string;
  name: string;
  available_units: ServingUnit[];
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
};

export type Meal = {
  id?: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  servingQty: number;
  isSaved: boolean;
  ingredients: Ingredient[];
};
