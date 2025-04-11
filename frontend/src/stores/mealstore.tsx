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
  fdcId?: number;
  fdc_id?: number;
  selected_serving_qty?: number;
  selected_serving_unit?: string;
  name: string;
  available_units?: ServingUnit[];
  servings?: ServingUnit[];
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
};

export type SelectedIngredient = {
  fdcId: number;
  id?: number;
  name: string;
  selectedServingQty: number;
  selectedServingUnit: string;
  servingUnits: ServingUnit[];
  selectedServingUnitInfo?: ServingUnit;
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
  ingredients: Ingredient[] | SelectedIngredient[];
};
