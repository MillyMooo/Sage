export interface Recipe {
  id: number;
  name: string;
  person: string;
  mealType: string;
  ingredients: string[];
  instructions: string[];
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  prepTime: string;
  notes: string;
}

export interface Meal {
  id: number;
  batchStartDate: string;
  batchEndDate: string;
  mealDate: string;
  mealType: string;
  person: string;
  recipeId: number;
  recipeName: string;
  completed: boolean;
}

export interface AppData {
  recipes: Recipe[];
  meals: Meal[];
}

export type TabName = 'recipes' | 'plan' | 'calendar' | 'shopping' | 'cook';
