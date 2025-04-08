export type ServingUnit = {
  unit: string;
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
};

export type Ingredient = {
  ingredientID?: number;
  mealID?: number;
  fdcId: number;
  selectedServingQty: number;
  selectedServingUnit: string;
  name: string;
  servingUnits: ServingUnit[];
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
};

export type Meal = {
  mealID?: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  servingQty: number;
  isSaved: boolean;
  ingredients: Ingredient[];
};
